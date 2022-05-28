var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     userinfo:[],
	 money:0,
	 bankname:'',
	 banknameuser:'',
	 banknummber:''
  },
   // 选择国家函数
   changeCountry(e){
    this.setData({ countryIndex: e.detail.value});
  },
  changeCountry1(e){
    this.setData({ countryIndex1: e.detail.value});
  },
  changeCountry2(e){
    this.setData({ countryIndex2: e.detail.value});
  },
  bindmoneyText: function(e) {
  	this.setData({
  	  money: e.detail.value
  	})
   },
   bindbanknameText: function(e) {
   	this.setData({
   	  bankname: e.detail.value
   	})
    },
	bindbanknameuserText: function(e) {
		this.setData({
		  banknameuser: e.detail.value
		})
	 },
	 bindbanknummberText: function(e) {
	 	this.setData({
	 	  banknummber: e.detail.value
	 	})
	  },
  /**
   * 获取个人账户信息
   */
  get_member_info: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Miniapi/merchantsinfo',
      method: 'post',
      data: {
        token: main.get_storage('merchants_token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (!res.data) {
          wx.showToast({
            title: '加载错误',
            icon: 'loading',
            duration: 10000
          })
        }
        if (res.data.errcode == '200') {
          wx.hideLoading();
          that.setData({
  			userinfo: res.data.data.merchants,
			money: res.data.data.merchants.me_wallet,
          })
        } else {
  		  wx.showToast({
  			title: res.data.errmsg,
  			icon: 'none',
  			duration: 3000
  		  })
        }
      }
    })
  },
  
  getwithdrawal: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Miniapi/withdrawal_merchants',
      method: 'post',
      data: {
        token: main.get_storage('merchants_token'),
		money:that.data.money,
		bankname:that.data.bankname,
		username:that.data.banknameuser,
		bankcard:that.data.banknummber
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (!res.data) {
          wx.showToast({
            title: '加载错误',
            icon: 'loading',
            duration: 10000
          })
        }
        if (res.data.errcode == '200') {
          wx.hideLoading();
          wx.showToast({
			title: res.data.errmsg,
			icon: 'none',
			duration: 3000
          })
		  setTimeout(function() {
		    wx.reLaunch({
		      url: '/pages/list/list',
		    })
		  }, 500);
        } else {
  		  wx.showToast({
  			title: res.data.errmsg,
  			icon: 'none',
  			duration: 3000
  		  })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  	var that = this;
  	//判断是否已经授权
  	that.get_member_info();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})