let baseUrl = 'https://api.douban.com/v2/';
const ajaxAction = ((url, method, data) => {
  return new Promise((resolve, reject) => {
    url = baseUrl + url;
    if (url.indexOf("?") < 0) {
      url += '?_dt=' + Math.random();
    }
    if (method === 'GET' && data) {
      for (let k in data) {
        url += '&' + k + '=' + data[k];
      }
    }
    url += "&apikey=0df993c66c0c636e29ecbb5344252a4a";

    my.httpRequest({
      url: url,
      method: method,
      header: {
        "Content-Type": "json"
      },
      success: function(res) {
        if (res.data.code) {
          my.showToast({
            type: 'fail',
            content: 'res.data.msg',
            duration: 3000,
          });
        }
        resolve(res.data)
      },
      fail: function(error) {
        reject(error)
      },
      complete() {
        // 加载完成        
      }
    })

  });
});

module.exports = {
  in_theaters: (data) => {
    return ajaxAction('movie/in_theaters', 'GET', data);
  },
  coming_soon: (data) => {
    return ajaxAction('movie/coming_soon', 'GET', data);
  },
  top250: (data) => {
    return ajaxAction('movie/top250', 'GET', data);
  },
  movieDetail: (data, id) => {
    return ajaxAction('movie/subject/' + id, 'GET', data);
  }
}