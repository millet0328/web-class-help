// pages/list/index.js
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		name: "",
		list: [],
		allChecked: false,
		totalPayment: 0,
		discountedPayment: 0
	},
	// 获取列表
	getList(opt) {
		app.ajax({
				url: "/xcx/api.php",
				data: opt
			})
			.then((result) => {
				let arr = result.rt;
				arr.forEach((item) => {
					item.allChecked = false;
					item.spChecked = false;
					item.ksChecked = false;
				});
				this.setData({
					name: result.xm,
					list: arr
				})
			})
	},
	// sp选择
	spCheckHandle(e) {
		let index = e.currentTarget.dataset.index;
		let list = this.data.list;
		// 如果禁用checkbox
		if (list[index].spgm != 0) {
			return false;
		}
		list[index].spChecked = !list[index].spChecked;
		list[index].allChecked = this.itemCheckAll(list[index]);
		this.calculatePayment();
		this.setData({
			list,
			allChecked: this.checkAll(),
		});
	},
	// ks选择
	ksCheckHandle(e) {
		let index = e.currentTarget.dataset.index;
		let list = this.data.list;
		// 如果禁用checkbox
		if (list[index].ksgm != 0) {
			return false;
		}
		list[index].ksChecked = !list[index].ksChecked;
		list[index].allChecked = this.itemCheckAll(list[index]);
		this.calculatePayment();
		this.setData({
			list,
			allChecked: this.checkAll(),
		});
	},
	// item全选
	itemCheckHandle(e) {
		let index = e.currentTarget.dataset.index;
		let list = this.data.list;
		let { ksgm, spgm } = list[index];
		if (ksgm == 0 || spgm == 0) {
			list[index].allChecked = !list[index].allChecked;
		}
		if (ksgm == 0) {
			list[index].ksChecked = list[index].allChecked;
		}
		if (spgm == 0) {
			list[index].spChecked = list[index].allChecked;
		}
		this.calculatePayment();
		this.setData({
			list,
			allChecked: this.checkAll(),
		});
	},
	// item判断是否全选
	itemCheckAll(item) {
		let { ksgm, spgm, ksChecked, spChecked } = item;
		if (ksgm == 0 && spgm == 0) {
			return ksChecked && spChecked;
		}
		if (ksgm == 0 || spgm == 0) {
			return ksChecked || spChecked;
		}
	},
	// bottom-bar全选
	checkAllHandle() {
		let list = this.data.list;
		let allChecked = !this.data.allChecked;
		list.forEach((item) => {
			let { ksgm, spgm } = item;
			if (spgm == 0) {
				item.spChecked = allChecked;
			}
			if (ksgm == 0) {
				item.ksChecked = allChecked;
			}
			item.allChecked = item.ksChecked || item.spChecked;
		});
		this.calculatePayment();
		this.setData({
			list,
			allChecked
		});
	},
	// bottom-bar判断是否全选
	checkAll() {
		let list = this.data.list;
		let max = 0; //激活的item-checkAllBox总数
		let num = 0; //全选的item-checkAllBox数量

		list.forEach((item) => {
			// 计算激活的item-checkAllBox总数
			if (item.spgm == 0 || item.ksgm == 0) {
				max++;
			}
			// 计算全选的item-checkAllBox数量
			if (item.allChecked == true) {
				num++;
			}
		});
		return max == num;
	},
	// bottom-bar价格计算：总计、折后价
	calculatePayment() {
		let list = this.data.list;
		let discountedPayment = 0;
		// 计算折后价格
		list.forEach((item) => {
			if (item.spChecked) {
				discountedPayment += +item.spjg;
			}
			if (item.ksChecked) {
				discountedPayment += +item.ksjg;
			}
		});
		this.setData({
			totalPayment: discountedPayment * 2,
			discountedPayment
		});
	},
	//购买下单 
	orderHandle() {
		let list = this.data.list;
		let selected = [];
		list.forEach((item) => {
			let obj = {};
			obj.id = item.id;
			obj.sp = item.spChecked ? 1 : 0;
			obj.ks = item.ksChecked ? 1 : 0;
			selected.push(obj);
		});
		let p = {
			rt: {
				a: selected
			}
		};

		app.ajax({
			method: "GET",
			url: "/xcx/kj.php",
			data: {
				p,
				openid: wx.getStorageSync("openid"),
			}
		}).then((result) => {
			wx.navigateTo({
				url: `../payment/index?id=${result}`,
			});
		});
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.getList(options);
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
