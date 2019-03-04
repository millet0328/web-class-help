//app.js
const config = require('config');
const diaries = require('demo/diaries');
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
   // 获取用户信息
   getUserInfo: function(cb) {
      var that = this;

      if (this.globalData.userInfo) {
         typeof cb == 'function' && cb(this.globalData.userInfo)
      } else {
         // 先登录
         wx.login({
            success: function() {
               wx.getUserInfo({
                  success: (res) => {
                     that.globalData.userInfo = res.userInfo;
                     typeof cb == 'function' && cb(that.globalData.userInfo)
                  }
               })
            }
         })
      }
   },
   // 获取本地全部日记列表
   getDiaryList(cb) {
      var that = this;

      if (this.globalData.diaryList) {
         typeof cb == 'function' && cb(this.globalData.diaryList);
      } else {
         let list = [];

         this.getLocalDiaries(storage => {
            // 本地缓存数据
            for (var k in storage) {
               list.push(storage[k]);
            }
         });

         // 本地假数据
         list.push(...diaries.diaries);
         that.globalData.diaryList = list;
         typeof cb == 'function' && cb(that.globalData.diaryList)
      }
   },
   // 获取本地日记缓存
   getLocalDiaries(cb) {
      var that = this;

      if (this.globalData.localDiaries) {
         typeof cb == 'function' && cb(this.globalData.localDiaries);
      } else {
         wx.getStorage({
            key: config.storage.diaryListKey,
            success: (res) => {
               that.globalData.localDiaries = res.data;
               typeof cb == 'function' && cb(that.globalData.localDiaries);
            },
            fail: (error) => {
               that.globalData.localDiaries = {};
               typeof cb == 'function' && cb(that.globalData.localDiaries);
            }
         });
      }
   },
   // 获取当前设备信息
   getDeviceInfo: function(callback) {
      var that = this;

      if (this.globalData.deviceInfo) {
         typeof callback == "function" && callback(this.globalData.deviceInfo)
      } else {
         wx.getSystemInfo({
            success: function(res) {
               that.globalData.deviceInfo = res;
               typeof callback == "function" && callback(that.globalData.deviceInfo)
            }
         })
      }
   },
   // 公共数据
   globalData: {
      // 请求api域名
      url: 'https://x.daikan8.com',
      // 设备信息，主要用于获取屏幕尺寸而做适配
      deviceInfo: null,

      // 本地日记缓存列表 + 假数据
      // TODO 真实数据同步至服务端，本地只做部分缓存
      diaryList: null,

      // 本地日记缓存
      localDiaries: null,

      // 用户信息
      userInfo: null,
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