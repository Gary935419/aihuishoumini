const app = getApp();
const config = app.globalData;
var main = require("../../main.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:0,
    menuButtonObject:'',
    statusNavBarHeight:'',
    navBarHeight:'',
    top:'',
    height:'',
	account:'',
	password:'',
	merchantsInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 得到右上角菜单的位置尺寸
   this.data.top=wx.getMenuButtonBoundingClientRect().top
   this.data.height=wx.getMenuButtonBoundingClientRect().height,
   // 获取状态栏高度
   this.data.statusBarHeight= wx.getSystemInfoSync().statusBarHeight,
   // 计算导航栏的高度
   // 此高度基于右上角菜单在导航栏位置垂直居中计算得到
   this.data.navBarHeight =this.data.height + (this.data.top - this.data.statusBarHeight) * 2,
   this.setData({
   // 计算状态栏与导航栏的总高度
     top:wx.getMenuButtonBoundingClientRect().top,
     height:wx.getMenuButtonBoundingClientRect().height,
     width:wx.getMenuButtonBoundingClientRect().width,
     right:wx.getSystemInfoSync().screenWidth- wx.getMenuButtonBoundingClientRect().right,
     statusNavBarHeight : this.data.statusBarHeight +this.data.navBarHeight
    }) 
    console.log(wx.getMenuButtonBoundingClientRect());
  },
  bindaccountText: function(e) {
  	console.log(e.detail.value)
    this.setData({
      account: e.detail.value
    })
  },
  bindpasswordText: function(e) {
  	console.log(e.detail.value)
    this.setData({
      password: e.detail.value
    })
  },
   //返回上一页
  goback() {
    wx.navigateBack({
      delta: 1,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
  		//用户按了允许授权按钮
  		if (res.userInfo) {
  		  var that = this;
  		  wx.showLoading({
  		    title: '正在登录',
  		  })
  		  config.merchantsInfo = res.userInfo;
  		  this.setData({
  		    merchantsInfo: res.userInfo,
  		  })
  		  //获取用户信息
  		  that.getuserinfo();
  		} else {
  		  //用户按了拒绝按钮
  		  wx.showModal({
  		    title: '温馨提示',
  		    content: '拒绝授权，将无法享受小程序的部分功能，请授权之后再进入呦!',
  		    showCancel: false,
  		    confirmText: '返回授权',
  			confirmColor: '#111111',//确定文字的颜色
  			success: res => {
  			    wx.hideLoading();
  			    console.log(res);
  			    that.setData({
  			        merchantsInfo: res.data.result
  			    })
  			},
  			fail: err => {
  			    console.log(err);
  			}
  		  })
  		}
      }
    })
  },
  /**
   * 获取用户信息
   */
  getuserinfo: function() {
    var that = this;
    //调用微信登录接口
    wx.login({
      success: function(loginCode) {
        //调用request请求api转换登录凭证 获取poenid
        wx.request({
          url: app.taskapi + '/Login/register_merchants',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          data: {
            loginCode: loginCode.code,
            nickname: config.merchantsInfo.nickName,
            avatarurl: config.merchantsInfo.avatarUrl,
            gender: config.merchantsInfo.gender,
  			 account: that.data.account,
  			 password: that.data.password,
			 user_type:0
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
              main.set_storage('merchants_token', res.data.data.token);
  			  if(res.data.data.session_key != ''){
  			  	   main.set_storage('merchants_sessionKey', res.data.data.session_key);
  			  }
              //获取个人账户信息
              that.get_member_info();
            } else {
            wx.hideLoading();
  			wx.showToast({
  				title: res.data.errmsg,
  				icon: 'none',
  				duration: 3000
  			})
            }
          },
  		  fail: err => {
  		      console.log(err);
  		  }
        })
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
	  		   wx.showToast({
	  		     title: '登陆成功',
	  		     icon: 'success',
	  		     duration: 10000
	  		   })
	  		   setTimeout(function() {
				   wx.navigateTo({
				     url: '/pages/orderlist/orderlist',
				   })
	  		   }, 2000)
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
  get_member_infonew: function() {
    var that = this;
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
	  		   wx.showToast({
	  		     title: '登陆成功',
	  		     icon: 'success',
	  		     duration: 10000
	  		   })
	  		   setTimeout(function() {
				   wx.navigateTo({
				     url: '/pages/orderlist/orderlist',
				   })
	  		   }, 2000)
	    }
	  }
    })
  },
  checklogin:function(){
    	  var that = this;
		  if(main.get_storage('merchants_token') != ''){
			  wx.navigateTo({
			    url: '/pages/orderlist/orderlist',
			  })
		  }
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
     that.get_member_infonew();
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