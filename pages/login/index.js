// pages/login/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    schools: [],
    showSelect: false,
    x: "",
    u: "",
    p: "",
  },
  // 学校输入框
  schoolHandle(e) {
    setTimeout(() => {
      this.getSchoolList(e.detail.value);
    }, 500);
  },
  // 根据keyword获取学校列表
  getSchoolList(keyword) {
    app.ajax({
      method: "GET",
      url: "/xcx/xx.php",
      data: {
        t: keyword
      }
    }).then((result) => {
      if (result.user.length == 0) {
        this.setData({
          showSelect: false
        });
        return false;
      }
      this.setData({
        schools: result.user,
        showSelect: true
      });
    });
  },
  // 下拉选择框
  selectHandle(e) {
    this.setData({
      x: e.currentTarget.dataset.name,
      showSelect: false,
    });
  },
  // 表单验证
  validate(formData) {
    // 表单项是否为空
    for (var key in formData) {
      if (!formData[key]) {
        wx.showToast({
          title: '请完整填写信息！',
          icon: 'none',
        });
        return false;
      }
    }
    return true;
  },
  // 表单提交
  formSubmit(e) {
    let data = e.detail.value;
    var flag = this.validate(data);
    if (!flag) {
      return false;
    }
    data.x = data.x || 1;
    data.action = this.data.id;
    data.FormID = e.detail.formId;
    app.ajax({
      method: "POST",
      url: "/xcx/yz.php",
      data
    })
      .then((result) => {
        if (result == 0) {
          wx.showToast({
            title: '登录成功！',
            success() {
              setTimeout(() => {
                wx.redirectTo({
                  url: `../list/index?x=${data.x}&u=${data.u}&p=${data.p}&lx=${data.action}`,
                });
              }, 1200);
            }
          })
        } else {
          wx.showToast({
            title: result,
            icon: "none",
          })
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      title: options.lesson,
      id: options.id,
      type: options.type,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})