// pages/order/index.js
const app = getApp();
let i = 1;
Page({
   /**
    * 页面的初始数据
    */
   data: {
      list: [],
      keyword: "",
      max: 1,
   },
   // 启动按钮
   startHandle(e) {
      let id = e.currentTarget.dataset.id;
      app.ajax({
         method: "GET",
         url: "/xcx/api.php",
         data: {
            t1: 1,
            id,
            token: wx.getStorageSync("unionId"),
         }
      }).then((result) => {
         wx.showModal({
            title: '提示',
            content: result,
            showCancel: false,
         });
      });
   },
   // 暂停按钮
   pauseHandle(e) {
      let id = e.currentTarget.dataset.id;
      app.ajax({
         method: "GET",
         url: "/xcx/api.php",
         data: {
            t1: 2,
            id,
            token: wx.getStorageSync("unionId"),
         }
      }).then((result) => {
         wx.showModal({
            title: '提示',
            content: result,
            showCancel: false,
         });
      });
   },
   // 关键词
   keywordHandle(e) {
      this.setData({
         keyword: e.detail.value,
      });
   },
   // 搜索
   searchHandle() {
      i = 1;
      this.getOrderList(i, this.data.keyword).then((result) => {
         let list = [];
         if (result.cx) {
            list = list.concat(result.cx.rt);
         }
         if (result.zhs) {
            list = list.concat(result.zhs.rt);
         }
         this.setData({
            list,
         });
      });
   },
   // 获取订单列表
   getOrderList(pageIndex, keyword = "") {
      return app.ajax({
         method: "GET",
         url: "/xcx/api.php",
         data: {
            page: pageIndex,
            s: keyword,
            token: wx.getStorageSync("unionId"),
         }
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {

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
      this.getOrderList(i).then((result) => {
         let list = [];
         if (result.cx) {
            list = list.concat(result.cx.rt);
         }
         if (result.zhs) {
            list = list.concat(result.zhs.rt);
         }
         this.setData({
            list,
            max: parseInt(result.hs),
         });
      });
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
      if (i >= this.data.max) {
         wx.showToast({
            title: '订单已全部加载完！',
            icon: "none",
         });
         return false;
      } else {
         i++;
      }
      this.getOrderList(i, this.data.keyword).then((result) => {
         let list = this.data.list;
         if (result.cx) {
            list = list.concat(result.cx.rt);
         }
         if (result.zhs) {
            list = list.concat(result.zhs.rt);
         }
         this.setData({
            list
         });
      });
   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   }
})