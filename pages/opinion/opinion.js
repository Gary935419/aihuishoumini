var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
	note:'',
	items: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
  bindnoteText: function(e) {
	  console.log(e.detail.value)
  	this.setData({
  	  note: e.detail.value
  	})
   },
  sendorder:function(){
    	  var that = this;
    	  wx.showLoading({
    	    title: '加载中',
    	  })
    	  wx.request({
  			url: app.taskapi + '/Miniapi/opinion_insert',
    	    method: 'post',
    	    data: {
    	      token: main.get_storage('token'),
  		      note: that.data.note,
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
  			    duration: 2000,
  			    success: function () {
  			      setTimeout(function() {
  			        wx.redirectTo({
  			          url: '/pages/opinion/opinion',
  			        })
  			      }, 2000);
  			    }
  			});
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
	 * 获取个人账户信息
	 */
	get_member_info: function() {
	  var that = this;
	  wx.showLoading({
	    title: '加载中',
	  })
	  wx.request({
	    url: app.taskapi + '/Miniapi/memberinfo',
	    method: 'post',
	    data: {
	      token: main.get_storage('token'),
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
	          items: res.data.data.sendyourself_arr
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