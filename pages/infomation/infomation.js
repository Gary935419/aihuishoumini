var app = getApp();
var main = require("../../main.js");
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
	sid:'',
	setarr:[],
    goodsdetails: [],
  },

get_set_info: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Miniapi/get_set_info',
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
		  if(that.data.sid == 1){
			  that.setData({
			     url: res.data.data.setarr.aboutus,
			  })
		  }else{
			  that.setData({
			     url: res.data.data.setarr.recruiting,
			  })
		  }
          that.setData({
  			setarr: res.data.data.setarr,
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
   * 获取搜索商品详情
   */
  get_news_details:function(){
  	  var that = this;
  	  wx.showLoading({
  	    title: '加载中',
  	  })
  	  wx.request({
  	    url: app.taskapi + '/Miniapi/goodsdetailssetting',
  	    method: 'post',
  	    data: { 
  		  sid: that.data.sid,
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
  	  	  	  goodsdetails: res.data.data.goodsdetails,
  	  	  	}),
			//商品描述富文本编辑器
			WxParse.wxParse('article', 'html', that.data.goodsdetails.contents, that, 5);
  	      } else {
			wx.hideLoading();
			wx.showToast({
			  title: '加载错误',
			  icon: 'loading',
			  duration: 10000
			})
  	      }
  	    }
  	  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      that.setData({
        sid: options.id,
      });
      that.get_news_details();
	  that.get_set_info();
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