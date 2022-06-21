var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    previewImageArr: [],
    // 性别
    countryList: ['男','女'],
    countryIndex: 0,
    date: '1995-01-01',
	userinfo:[],
    // 证件类型：
    countryList1: ['请选择','身份证'],
    countryIndex1: 0,
	truename:'',
	mobile:'',
	email:'',
  },
  // 性别
  changeCountry(e){
    this.setData({ countryIndex: e.detail.value});
  },
  //日期
  changeDate(e){
    this.setData({ date:e.detail.value});
  },
  // 证件类型：
  changeCountry1(e){
    this.setData({ countryIndex1: e.detail.value});
  },
  //头像相册
  previewImage(e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照选取'],
      itemColor: "#f7982a",
      success: function (res) {
        console.log(res)
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.uploader('album')
          } else if (res.tapIndex == 1) {
            that.uploader('camera')
          }
        }
      }
    })
  },
  
  uploader: function (e) {
    var find = e
    var that = this;
    let maxSize = 5 * 1024 * 1024;
    var maxLength = 1;
    let flag = true;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [find], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        for (let i = 0; i < res.tempFiles.length; i++) {
          if (res.tempFiles[i].size > maxSize) {
            flag = false;
            wx.showModal({
              content: '图片太大，不允许上传',
              showCancel: false,
              success: function (res) {
                console.log('res')
              }
            });
          }
        }

        if (res.tempFiles.length > maxLength) {
          wx.showModal({
            content: '最多能上传' + maxLength + '张图片',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('确定');
              }
            }
          })
        }

        console.log(res.tempFilePaths)
        if (flag == true && res.tempFiles.length <= maxLength) {
          var imagesList = that.data.imagesList.concat(res.tempFilePaths)
          if (imagesList.length > 1) {
            wx.showModal({
              content: '最多能上传1张图片',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('确定');
                }
              }
            })
          } else {
            that.setData({
              imagesList: imagesList
            })
          }


        }
      },

      fail: function (res) {
        console.log(res);
      }
    })
  },
bindtruenameText: function(e) {
	this.setData({
	  truename: e.detail.value
	})
 },
 bindmobileText: function(e) {
	this.setData({
	  mobile: e.detail.value
	})
  },
  bindemailText: function(e) {
	this.setData({
	  email: e.detail.value
	})
   },
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
  			userinfo: res.data.data.member,
			countryIndex: res.data.data.member.sex,
			date:res.data.data.member.birthday,
			mobile: res.data.data.member.mobile,
			email: res.data.data.member.email,
			truename: res.data.data.member.truename,
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
  
  getmemberinfo: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Miniapi/memberinfo_modify',
      method: 'post',
      data: {
        token: main.get_storage('token'),
		sex: that.data.countryIndex,
		mobile: that.data.mobile,
		email: that.data.email,
		truename: that.data.truename,
		birthday: that.data.date,
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
  			duration: 3000
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
  	//判断是否已经授权
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