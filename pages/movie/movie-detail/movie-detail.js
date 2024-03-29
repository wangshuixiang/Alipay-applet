// import { Movie } from './class/Movie.js';
import ajaxAction from '../../../ajax/ajax';
var util = require('../../../utils/util.js')
var app = getApp();
Page({
  data: {
    movie: {},
    visible: false
  },
  onLoad: function(options) {
    this.getDetailInfo(options.id);
  },

  async getDetailInfo(id) {
    const data = await ajaxAction.movieDetail({}, id);
    if (!data) {
      return;
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large

      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.setData({
      movie: movie,
      visible: true
    });
  },

  /*查看图片*/
  viewMoviePostImg: function(e) {
    var src = e.currentTarget.dataset.src;
    console.log(src)
    my.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
})
