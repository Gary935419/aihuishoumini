var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
	orderlist:[],
	userInfo:[],
	a_id:''
  },
  getUserProfile(e) {
  	  var that = this;
  	  console.log(config.userInfo);
  	  if (config.userInfo.length != 0) {
  	  	wx.reLaunch({
  	  	  url: '/pages/address/address',
  	  	})
  	  } else{
  	  	// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  	  	wx.getUserProfile({
  	  	  desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  	  	  success: (res) => {
  	  	    console.log(res)
  	  	  		//用户按了允许授权按钮
  	  	  		if (res.userInfo) {
  	  	  		  wx.showLoading({
  	  	  		    title: '正在登录',
  	  	  		  })
  	  	  		  config.userInfo = res.userInfo;
  	  	  		  this.setData({
  	  	  		    userInfo: res.userInfo
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
  	  }
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
  	              wx.showToast({
  	                title: '授权成功',
  	                icon: 'loading',
  	                duration: 3000
  	              })
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
   // 点击选择事件
     radioChange: function(e) {
	   console.log(e.currentTarget.dataset.id)
       this.setData({
        a_id: e.currentTarget.dataset.id,
       });
	    main.set_storage('a_id', e.currentTarget.dataset.id);
     },
warnModalTrue(e){
    var self = this;
	self.setData({
	  a_id: e.currentTarget.dataset.id,
	})
	console.log(e.currentTarget.dataset.id)
    wx.showModal({
      title: '确认删除地址?',
      content: '',
      confirmColor: '#00000',
      cancelColor: '#00000',
      confirmText:'是',
      cancelText: '否',
      success: function (res) {
        if (res.confirm) {
           self.deleteaddress();
        }
      }
    })
  },
  deleteaddress:function(){
    	  var that = this;
    	  wx.showLoading({
    	    title: '加载中',
    	  })
    	  wx.request({
  			url: app.taskapi + '/Miniapi/member_address_del',
    	    method: 'post',
    	    data: {
    	      token: main.get_storage('token'),
  		      a_id: that.data.a_id,
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
	getlocation:function(){
		  //先判断用户是否授权获取地理位置
		  let that = this;
		   wx.getSetting({
		        success(res) {
		          if (res.authSetting['scope.userLocation'] == false) {//如果没有授权地理位置
		            wx.openSetting({
		              success(res) {
		                res.authSetting = {//打开授权位置页面，让用户自己开启
		                  "scope.userLocation": true
		                }
		              }
		            })
		          } else {//用户开启授权后可直接获取地理位置
		            wx.authorize({
		              scope: 'scope.userLocation',
		              success() {
		                //获取位置后相关操作
		                that.getLocation();
		              }
		            })
		          }
		        }
		      })
	  },
	     getLocation: function () {
	      let that = this;
	      wx.chooseLocation({
	        success: function (res) {
			console.log(res)
			if(res.errMsg == 'chooseLocation:ok'){
				wx.reLaunch({
				  url: '/pages/addaddress/addaddress?address='+res.address+res.name+'&latitude='+res.latitude+'&longitude='+res.longitude,
				})
			}else{
				wx.showToast({
					title: '授权失败！',
					icon: 'none',
					duration: 3000
				})
			}
	          // 返回的res:name(地理名称）、address（详细地址，包括省市区相关信息，可根据需要进行拆分）、latitude（纬度）、longitude（经度）
	        },
	      })
	    },
getaddresslist:function(){
    	  var that = this;
    	  wx.showLoading({
    	    title: '加载中',
    	  })
    	  wx.request({
			url: app.taskapi + '/Miniapi/member_address_list',
    	    method: 'post',
    	    data: {
    	      token: main.get_storage('token'),
  		      page: that.data.page,
  		      ostate: that.data.ostate,
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
				  orderlist: that.data.orderlist.concat(res.data.data.list),
				})
    	  	  console.log(that.data.orderlist)
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
	getaddressmuren:function(){
	    	  var that = this;
	    	  wx.showLoading({
	    	    title: '加载中',
	    	  })
	    	  wx.request({
				url: app.taskapi + '/Miniapi/member_address_muren',
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
					main.set_storage('a_id', res.data.data.a_id);
	    	  	  console.log(res.data.data.a_id)
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
       orderlist:[],
     })
     that.getaddresslist();
	 that.getaddressmuren();
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
	  that.getaddresslist();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})