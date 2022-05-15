var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({
  data: {
    statusBarHeight:0,
    menuButtonObject:'',
    statusNavBarHeight:'',
    navBarHeight:'',
    top:'',
    height:'',
    bannerlist:[],
    classonelist:[],
    width1: wx.getSystemInfoSync().windowWidth-22,//图片宽度  
    height1: wx.getSystemInfoSync().windowWidth * 8 / 25,//图片高度
    text: "",
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 0,
    size:14,
	setarr:[],
    interval: 20 // 时间间隔
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  gosendorder() {
    wx.navigateTo({
      url: '../project/project'
    })
  },
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
 warncostatenoTrue:function(){
   	  var that = this;
   	  wx.showToast({
		title: "暂未开通",
		icon: 'none',
		duration: 3000
   	  })
   },
 getBannerlist:function(){
   	  var that = this;
   	  wx.showLoading({
   	    title: '加载中',
   	  })
   	  wx.request({
 			url: app.taskapi + '/Miniapi/banner_list',
   	    method: 'post',
   	    data: {},
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
 				  bannerlist: res.data.data.list,
				  text: res.data.data.noticemsg,
 				})
   	  	  console.log(res.data.data.list)
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
   
   getClassonelist:function(){
     	  var that = this;
     	  wx.showLoading({
     	    title: '加载中',
     	  })
     	  wx.request({
   			url: app.taskapi + '/Miniapi/class_one_list',
     	    method: 'post',
     	    data: {},
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
   				  classonelist: res.data.data.list,
   				})
     	  	  console.log(res.data.data.list)
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
	 
 onShow: function () {
  var that = this;
  var length = that.data.text.length * that.data.size;//文字长度
  var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
  //console.log(length,windowWidth);
  that.setData({
   length: length,
   windowWidth: windowWidth
  });
  that.scrolltxt();// 第一个字消失后立即从右边出现
  that.getBannerlist();
  that.getClassonelist();
  that.get_set_info();
  main.remove_storage('ct_ids');
  },
   
  scrolltxt: function () {
  var that = this;
  var length = that.data.length;//滚动文字的宽度
  var windowWidth = that.data.windowWidth;//屏幕宽度
  if (length > windowWidth){
   var interval = setInterval(function () {
   var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
   var crentleft = that.data.marqueeDistance;
   if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
    that.setData({
    marqueeDistance: crentleft + that.data.marqueePace
    })
   }
   else {
    //console.log("替换");
    that.setData({
    marqueeDistance: 0 // 直接重新滚动
    });
    clearInterval(interval);
    that.scrolltxt();
   }
   }, that.data.interval);
  }
  else{
   that.setData({ marquee_margin:"1000"});//只显示一条不滚动右边间距加大，防止重复显示
  } 
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
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
