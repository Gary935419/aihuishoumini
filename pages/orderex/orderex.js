var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oid:'',
    orderdetails:[],
	isCancel:0,
  },
  warnModalTrue(){
    var self = this;
    wx.showModal({
      title: '确认取消订单?',
      content: '',
      confirmColor: '#00000',
      cancelColor: '#00000',
      confirmText:'是',
      cancelText: '否',
      success: function (res) {
        if (res.confirm) {
           self.cancelorder();
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options.oid)
	 console.log(options.isCancel)
     this.setData({
		 oid: options.oid,
		 isCancel: options.isCancel,
     })
  },

  getOrdersdetails:function(){
    	  var that = this;
    	  wx.showLoading({
    	    title: '加载中',
    	  })
    	  wx.request({
  			url: app.taskapi + '/Miniapi/orders_details',
    	    method: 'post',
    	    data: {
    	      token: main.get_storage('token'),
  		      oid: that.data.oid,
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
  				  orderdetails: res.data.data.orderdetails,
  				})
    	  	  console.log(res.data.data.orderdetails)
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
	
	cancelorder:function(){
	  	  var that = this;
	  	  wx.showLoading({
	  	    title: '加载中',
	  	  })
	  	  wx.request({
				url: app.taskapi + '/Miniapi/order_modify_ostate',
	  	    method: 'post',
	  	    data: {
	  	      token: main.get_storage('token'),
			  oid: that.data.oid,
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
				        wx.reLaunch({
				          url: '/pages/order/order',
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     var that = this;
     that.getOrdersdetails();
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

  onShareAppMessage: function (options) {//分享
      return {
          title: '爱收帮',
          path: `/pages/index/index`,
          success: function (res) {
              wx.showToast({
                  title: '分享成功',
              })
              // 转发成功
          },
          fail: function (res) {
              wx.showToast({
                  title: '分享失败',
              })
              // 转发失败
          },
      }
   },
   onShareTimeline: function (res) {
   		return {
   		    title: '爱收帮',
   		    path: `/pages/index/index`,
   		    success: function (res) {
   		        wx.showToast({
   		            title: '分享成功',
   		        })
   		        // 转发成功
   		    },
   		    fail: function (res) {
   		        wx.showToast({
   		            title: '分享失败',
   		        })
   		        // 转发失败
   		    },
   		}
   	}
})