// 获取应用实例
const app = getApp()

Page({
  data: {
    remind: '加载中'
  },
  onLoad() {
    setTimeout(() => {
      this.setData({
        remind: ''
      });
    }, 1000);

  },
  bindViewTap() {
    my.navigateTo({
      url: '../movie/movie',
    });

  },
});
