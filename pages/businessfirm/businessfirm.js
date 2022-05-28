var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     region: ["四川省", "广元市", "苍溪县"],
     countryList1: ['否','是'],
     countryIndex1: 0,
     previewImageArr: [],
	 address:'',
	 latitude:'',
	 longitude:'',
	 merchantsInfo:[],
	 contactname:'',
	 metel:'',
	 mename:'',
	 imgs: [],
	 upload_picture_list: [],
	 isDe11:'block',
	 isDe22:'none'
  },
  merchants_modify() {
    wx.reLaunch({
      url: '../businessfirmup/businessfirm'
    })
  },
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
	  	        merchantsInfo: res.data.data.merchants,
				countryIndex1:res.data.data.merchants.is_business,
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
