var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
	shujusum:[],
	ostate:0,
	page: 1,
	withdrawallist:[]
  },
  
  getwithdrawallist:function(){
    	  var that = this;
    	  wx.showLoading({
    	    title: '加载中',
    	  })
    	  wx.request({
  			url: app.taskapi + '/Miniapi/withdrawal_list',
    	    method: 'post',
    	    data: {
    	      token: main.get_storage('merchants_token'),
  		      page: that.data.page
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
  				if(res.data.data.list.length == 0){
  					wx.showToast({
  						title: '已经加载全部啦！',
  						icon: 'none',
  						duration: 3000
  					})
  				}
  				that.setData({
  				  withdrawallist: that.data.withdrawallist.concat(res.data.data.list),
  				})
    	  	  console.log(that.data.withdrawallist)
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
     this.setData({
       page: 1,
       withdrawallist:[],
     })
     that.getwithdrawallist();
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
    console.log("上拉加载")
    var that = this;
    that.setData({
      page: that.data.page + 1
    })
    that.getwithdrawallist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})