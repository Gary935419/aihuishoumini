var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchantsInfo:[],
	shujusum:[]
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
  gomemberinfopage:function(){
    	  var that = this;
    	  wx.showLoading({
    	    title: '加载中',
    	  })
		  main.remove_storage('merchants_token');
    	  wx.switchTab({
    	    url: '/pages/my/my',
    	  })
    },
  infoshujuxinxi: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Miniapi/infoshujuxinxi_merchants',
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
  			shujusum: res.data.data.shujusum,
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
  
  warncostatenoTrue:function(){
    	  var that = this;
    	  wx.showToast({
  		title: "正在马不停蹄的开发中~",
  		icon: 'none',
  		duration: 3000
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
	 that.infoshujuxinxi();
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