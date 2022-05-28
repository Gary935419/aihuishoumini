var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 省市区三级联动初始化
    region: ["辽宁省", "大连市", "高新园区"],
	address: '',
	latitude: '',
	longitude: '',
	name: '',
	mobile: '',
	status: false,
  },
  // 选择省市区函数
  changeRegin(e){
    this.setData({ region: e.detail.value });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options.address)
	 console.log(options.latitude)
	 console.log(options.longitude)
     this.setData({
		 address: options.address,
		 latitude: options.latitude,
		 longitude: options.longitude,
     })
  },
  changeSwitch1(e){
	  console.log(e.detail.value)
		this.setData({
		   status: e.detail.value
		})
    },
bindaddressText: function(e) {
	this.setData({
	  address: e.detail.value
	})
 },
 bindnameText: function(e) {
 	this.setData({
 	  name: e.detail.value
 	})
  },
  bindmobileText: function(e) {
  	this.setData({
  	  mobile: e.detail.value
  	})
   },
   addaddress:function(){
     	  var that = this;
     	  wx.showLoading({
     	    title: '加载中',
     	  })
     	  wx.request({
   			url: app.taskapi + '/Miniapi/member_address_add',
     	    method: 'post',
     	    data: {
     	      token: main.get_storage('token'),
   		      address: that.data.address,
			  latitude: that.data.latitude,
			  longitude: that.data.longitude,
			  name: that.data.name,
			  mobile: that.data.mobile,
			  status: that.data.status,
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
   			          url: '/pages/address/address',
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