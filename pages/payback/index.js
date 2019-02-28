// pages/payback/index.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      money: "",
      authModalShow: '', // 是否显示授权modal
   },
   // 获取目前提前金额
   showMoney() {
      app.ajax({
         method: "GET",
         url: "/xcx/uid/",
         data: {
            hqhb: wx.getStorageSync("openid")
         }
      }).then((result) => {
         result = result >= 0 ? result : 0;
         this.setData({
            money: result
         })
      });
   },
   // 提现红包
   getMoney() {
      app.ajax({
         method: "GET",
         url: "/xcx/uid/",
         data: {
            tx: wx.getStorageSync("openid")
         }
      }).then((result) => {
         if (result) {
            wx.showModal({
               title: '通知',
               content: '提现成功！',
               showCancel: false
            })
         } else {
            wx.showModal({
               title: '通知',
               content: '提现失败！',
               showCancel: false
            })
         }
      });
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      // 获取目前提前金额
      this.showMoney();
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function() {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {

   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function() {

   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function() {

   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function() {

   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function() {

   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   }
})