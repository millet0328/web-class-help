// pages/payment/index.js
const app = getApp();
let timer;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id: "",
		detail: {},
		friends: [],
		day: "00",
		hour: "00",
		min: "00",
		sec: "00",
		authModalShow: '', // 是否显示授权modal
	},
	// 获取用户授权
	authHandle(e) {
		app.encryptedData(e.detail)
			.then((result) => {
				wx.setStorageSync("unionId", result);
				this.setData({
					authModalShow: false
				});
			})
	},
	// 打开规则
	ruleOpenHandle() {
		wx.showModal({
			title: '活动规则',
			content: '1.每个微信24小时内只能砍一次价格',
		});
	},
	// 获取砍价信息
	getDetail(id) {
		app.ajax({
				method: "GET",
				url: "/xcx/kj.php",
				data: {
					id,
					openid: wx.getStorageSync("openid"),
				}
			})
			.then((result) => {
				if (result.friends) {
					this.setData({
						friends: result.friends,
					});
				}
				this.setData({
					detail: result.data,
				});
				let maxDate = this.data.detail.time;
				clearInterval(timer);
				timer = setInterval(() => {
					let now = new Date();
					this.dateformat(maxDate - now);
				}, 1000);
			});
	},
	// 砍价
	cutHandle() {
		app.ajax({
			method: "GET",
			url: "/xcx/kj.php",
			data: {
				kj: 1,
				id: this.data.id,
				openid: wx.getStorageSync("openid")
			}
		}).then((result) => {
			if (result == -1) {
				wx.showToast({
					title: "砍价失败！",
					icon: 'none'
				});
				return false;
			}
			wx.showToast({
				title: '砍价成功!',
				icon: 'success',
				duration: 2000,
				success: () => {
					this.getDetail(this.data.id);
				}
			})

		});
	},
	navigateHome() {
		wx.switchTab({
			url: "/pages/lessons/index"
		});
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		// options.id = 389181;
		this.setData({
			id: options.id
		});
		this.getDetail(options.id);
		// 监测用户授权
		wx.getSetting({
			success: res => {
				if (!res.authSetting['scope.userInfo']) {
					this.setData({
						authModalShow: true
					});
					return false;
				}
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							let sessionKey = wx.getStorageSync("session_key");
							if (!sessionKey) {
								app.userInfoCallback = result => {
									if (result) {
										wx.setStorageSync("session_key", result.session_key);
										app.encryptedData(res).then((result) => {
											wx.setStorageSync("unionId", result);
										});
									}
								}
								return false;
							}
							app.encryptedData(res).then((result) => {
								wx.setStorageSync("unionId", result);
							});
						}
					})
				}
			}
		});
	},
	// 购买
	payHandle() {
		app.ajax({
			method: "GET",
			url: "/xcx/wxzf/",
			data: {
				id: this.data.id,
			}
		}).then((result) => {
			let { timeStamp, nonceStr, signType, paySign } = result;
			wx.requestPayment({
				timeStamp,
				nonceStr,
				"package": result.package,
				signType,
				paySign,
				success: (res) => {
					wx.showToast({
						title: '付款成功!',
						icon: 'success',
						success: () => {
							setTimeout(() => {
								wx.switchTab({
									url: "../order/index"
								});
							}, 1500);
						}
					});
				},
				fail(res) {
					if (res.errMsg == "requestPayment:fail cancel") {
						wx.showToast({
							title: "取消成功！",
							icon: 'none',
						});
					}
				}
			})
		});
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},
	// 时间格式化输出，将时间戳转为 倒计时时间
	dateformat(msc) {
		var second = msc / 1000; //总的秒数
		// 天数位
		var day = Math.floor(second / 3600 / 24);
		var dayStr = day.toString();
		if (dayStr.length == 1) dayStr = '0' + dayStr;

		// 小时位
		var hr = Math.floor(second / 3600); //直接转为小时 没有天 超过1天为24小时以上
		var hrStr = hr.toString();
		if (hrStr.length == 1) hrStr = '0' + hrStr;

		// 分钟位
		var min = Math.floor(second / 60 % 60);
		var minStr = min.toString();
		if (minStr.length == 1) minStr = '0' + minStr;

		// 秒位
		var sec = Math.floor(second % 60);
		var secStr = sec.toString();
		if (secStr.length == 1) secStr = '0' + secStr;

		this.setData({
			day: dayStr,
			hour: hrStr,
			min: minStr,
			sec: secStr,
		})
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
		return {
			title: '我的网课，需要兄弟来助力，一起来砍价免费拿',
			path: '/pages/payment/index?id=' + this.data.id
		}
	}
})
