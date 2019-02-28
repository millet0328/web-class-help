// component/auth-modal/index.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean, // 类型（必填），String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo(e) {
      if (e.detail.errMsg == "getUserInfo:fail auth deny") {
        wx.showToast({
          title: '未授权获取用户信息！',
          icon: 'none'
        });
        return false;
      }
			this.triggerEvent('getAuth', e.detail);
    },
    hide: function() {
      // 缓存授权状态
      this.triggerEvent('cancel');
    }
  }
})