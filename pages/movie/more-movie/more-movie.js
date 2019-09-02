// pages/movies/more-movie/more-movie.js
import ajaxAction from '../../../ajax/ajax';
let app = getApp()
let util = require('../../../utils/util.js')
Page({
  data: {
    movies: [],
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
    hiddenLoading: false,
    disabledRemind: false,
    pager: {
      page: 1,
      size: 20,
      totalPage: 1
    }
  },
  onLoad: function(options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = 'in_theaters';
        break;
      case "即将上映":
        dataUrl = 'coming_soon';
        break;
      case "豆瓣Top250":
        dataUrl = 'top250';
        break;
    }
    my.setNavigationBar({
      title: category,
      color: "#fff",
      backgroundColor: '#314C6D',
    })
    this.setData({
      requestUrl: dataUrl
    });
    this.getMovieListData();
  },

  async getMovieListData() {
    my.showNavigationBarLoading()
    let pd = {
      start: (this.data.pager.page - 1) * this.data.pager.size,
      count: this.data.pager.size,
    };
    const res = await ajaxAction[this.data.requestUrl](pd);
    my.hideNavigationBarLoading();
     console.log(res.total);
    this.data.pager.totalPage = Math.ceil(res.total / this.data.pager.size);
    console.log(this.data.pager.size);
    if (this.data.pager.page >= this.data.pager.totalPage) {
      this.setData({
        disabledRemind: false
      });
    }
    this.processDoubanData(res)
  },

  onPullDownRefresh: function(event) {

    this.data.movies = [];
    this.data.isEmpty = true;
    this.data.pager.page = 1;
    this.getMovieListData();
  },

  onReachBottom: function(event) {
    // 上滑加载
    if (this.data.pager.page < this.data.pager.totalPage) {
      this.data.pager.page++;
      this.getMovieListData();
    }
  },

  processDoubanData: function(moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var totalMovies = {}

    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    my.hideNavigationBarLoading();
    my.stopPullDownRefresh()
    this.setData({
      hiddenLoading: true
    })
  },

  onReady: function(event) {
    my.setNavigationBar({
      title: this.data.navigateTitle
    })
  },

  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieid;
    my.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
})