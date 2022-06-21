var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateTimeArray1: null,
    dateTime1: null,
	ct_ids:[],
	meid:'',
	a_id:'',
	merchantsinfo:[],
	addressinfo:[],
	classtwoinfo:[],
	otype:0,
	note:'',
	isGrant:true,
	items: [],
	userInfo:[],
	setarr:[]
  },
  getUserProfile(e) {
	  var that = this;
	  console.log(config.userInfo);
	  if (config.userInfo.length != 0) {
	  	that.sendorder();
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
  radioChange: function(e) {
	  if(e.detail.value == 1){
		  this.setData({
		    otype: e.detail.value,
			isGrant: false
		  });
	  }else{
		  this.setData({
		    otype: e.detail.value,
		    isGrant: true
		  });
	  }
  },
  //删除
  warnModalTrue(){
    var self = this;
    wx.showModal({
      title: '是否删除？',
      content: '',
      confirmColor: '#007aff',
      cancelColor: '#007aff',
      confirmText:'是',
      cancelText: '否',
      success: function (res) {
        if (res.confirm) {
          self.setData({ msg: '微信小程序很好使用！' });
        } else if (res.cancel) {
          self.setData({ msg: '谢谢你的建议，微信小程序需继续优化！' });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
console.log(dateArr)
    this.setData({
      dateTimeArray1: dateArr
    });
  },
  
  get_merchants_info: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Miniapi/merchantsinfonew',
      method: 'post',
      data: {
        token: main.get_storage('token'),
		meid:that.data.meid,
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
  			merchantsinfo: res.data.data.merchants
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
  get_address_info: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Miniapi/addressinfo',
      method: 'post',
      data: {
        token: main.get_storage('token'),
  		a_id:that.data.a_id,
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
  			addressinfo: res.data.data.addressinfo
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
  bindnoteText: function(e) {
	  console.log(e.detail.value)
  	this.setData({
  	  note: e.detail.value
  	})
   },
  get_classtwo_info: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Miniapi/classtwoinfo',
      method: 'post',
      data: {
        token: main.get_storage('token'),
  		ct_ids:JSON.stringify(main.get_storage('ct_ids')),
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
  			classtwoinfo: res.data.data.list
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
  sendorder:function(){
    	  var that = this;
    	  wx.showLoading({
    	    title: '加载中',
    	  })
		  var arr1 = that.data.dateTimeArray1;
		  var arr2 = that.data.dateTime1;
		  var delivery_date = arr1[1][arr2[1]]+'-'+arr1[2][arr2[2]];
		  var delivery_time = arr1[3][arr2[3]]+':00';
    	  wx.request({
  			url: app.taskapi + '/Miniapi/order_insert',
    	    method: 'post',
    	    data: {
    	      token: main.get_storage('token'),
  		      note: that.data.note,
			  delivery_time: delivery_time,
			  delivery_date: delivery_date,
			  uname: that.data.addressinfo.name,
			  utel: that.data.addressinfo.mobile,
			  muser: that.data.merchantsinfo.mename,
			  maddress: that.data.merchantsinfo.meaddress,
			  meid: that.data.meid,
			  otype: that.data.otype,
			  ct_ids:JSON.stringify(main.get_storage('ct_ids')),
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
					main.remove_storage('ct_ids');
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
	console.log(main.get_storage('ct_ids'));
	that.get_member_info();
	this.setData({
	  meid: main.get_storage('meid'),
	  a_id:main.get_storage('a_id'),
	  ct_ids:main.get_storage('ct_ids'),
	})
	if(main.get_storage('meid') != ''){
		that.get_merchants_info();
	}
  	if(main.get_storage('a_id') != ''){
  		that.get_address_info();
  	}
	if(main.get_storage('ct_ids') != ''){
		that.get_classtwo_info();
	}
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