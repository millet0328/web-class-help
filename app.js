//app.js
App({
	onLaunch: function() {
		this.getOpenId().then((result) => {
			//由于这里是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			if (this.userInfoCallback) {
				this.userInfoCallback(result);
			}
		});
	},
	// 换取openId、ssesionKey
	getOpenId() {
		// 登录
		return new Promise((resolve, reject) => {
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
						resolve(result);
					});
				}
			})
		});
	},
	// 解密用户信息
	encryptedData({ encryptedData, iv, Recommender = "" }) {
		return this.ajax({
			method: "POST",
			url: "/xcx/uid/",
			data: {
				sessionKey: wx.getStorageSync("session_key"),
				encryptedData,
				iv,
				Recommender
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
