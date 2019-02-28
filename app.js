//app.js
App({
  onLaunch: function() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.ajax({
          method: "GET",
          url: "/xcx/api.php",
          data: {
            open: 1,
            code: res.code
          }
        }).then((result) => {
          wx.setStorageSync("openid", result.openid);
          wx.setStorageSync("session_key", result.session_key);
          wx.setStorageSync("unionId", result.unionid);
        });
      }
    })
  },
  // 公共数据
  globalData: {
    userInfo: null,
    url: 'https://x.daikan8.com',
  },
  // model:{method,url,data,config}
  ajax(model) {
    let headerConfig = { // 默认header ticket、token、params参数是每次请求需要携带的认证信息
      ticket: '',
      token: '',
      params: '',
      'content-type': 'application/x-www-form-urlencoded'
    };
    wx.showLoading({
      title: '加载中',
    })
    // method默认
    model.method = model.method || "POST";
    //拼接url
    model.url = this.globalData.url + model.url;
    //返回Promise对象
    return new Promise(function(resolve) {
      wx.request({
        method: model.method,
        url: model.url,
        data: model.data,
        header: Object.assign({}, headerConfig, model.config), // 合并传递进来的配置
        success: (res) => {
          wx.hideLoading();
          if (res.statusCode == 200) {
            resolve(res.data);
          } else {
            //错误信息处理
            wx.showModal({
              title: '提示',
              content: '服务器错误，请联系客服',
              showCancel: false,
            })
          }
        }
      })
    })
  }
})