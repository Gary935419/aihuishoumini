var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
	isGrant: false,
	userinfo: [],
	back_path: 'my',
	shujusum:[],
	setarr:[],
  },
freeTell: function(){
	var that = this;
	wx.makePhoneCall({
	  phoneNumber: that.data.setarr.customer_tel,
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
		  config.userInfo = res.userInfo;
		  this.setData({
		    userInfo: res.userInfo,
		    isGrant: true
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
			        userInfo: res.data.result
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
  warncostatenoTrue:function(){
    	  var that = this;
    	  wx.showToast({
  		title: "正在马不停蹄的开发中~",
  		icon: 'none',
  		duration: 3000
    	  })
    },
	gonews:function(){
	  	  var that = this;
	  	 wx.navigateTo({
	  	   url: '/pages/news/news',
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
          url: app.taskapi + '/Login/register_member',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          data: {
            loginCode: loginCode.code,
            nickname: config.userInfo.nickName,
            avatarurl: config.userInfo.avatarUrl,
            gender: config.userInfo.gender,
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
              main.set_storage('token', res.data.data.token);
  			  if(res.data.data.session_key != ''){
  			  	   main.set_storage('sessionKey', res.data.data.session_key);
  			  }
              //获取个人账户信息
			  that.get_member_info();
			  that.infoshujuxinxi();
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
            isGrant: true,
  			userinfo: res.data.data.member,
          })
		  console.log(123123)
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
  
  infoshujuxinxi: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Miniapi/infoshujuxinxi',
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
	that.get_set_info();
	//判断是否已经授权
	wx.getSetting({
	success: res => {
	  if (res.authSetting['scope.userInfo']) {
		  if(main.get_storage('token')){
			  console.log(111);
			  //获取个人账户信息
			  that.get_member_info();
			  that.infoshujuxinxi();
		  }
	  } else {
		that.setData({
		  isGrant: false,
		  userinfo: [],
		})
	  }
	}
	})
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