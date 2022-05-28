var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    a_id:'',
	page: 1,
	addressinfo:[],
	orderlist:[],
	testinfo:'',
	openstatus:0,
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
  			addressinfo: res.data.data.addressinfo,
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
  bindinfoText: function(e) {
	  console.log(e.detail.value)
  	this.setData({
  	  testinfo: e.detail.value
  	})
   },
  getOrderslist:function(){
    	  var that = this;
    	  wx.showLoading({
    	    title: '加载中',
    	  })
    	  wx.request({
  			url: app.taskapi + '/Miniapi/merchants_list',
    	    method: 'post',
    	    data: {
    	      token: main.get_storage('token'),
  		      page: that.data.page,
			  a_id: main.get_storage('a_id'),
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
				  openstatus: res.data.data.openstatus,
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
	getsendone(e){
		var that = this;
		console.log(e.currentTarget.dataset.id)
	    main.set_storage('meid', e.currentTarget.dataset.id);
		setTimeout(function() {
		  wx.reLaunch({
		    url: '/pages/orderque/orderque',
		  })
		}, 500);
	},
	getOrderslistseach:function(){
	  	  var that = this;
	  	  wx.showLoading({
	  	    title: '加载中',
	  	  })
	  	  wx.request({
				url: app.taskapi + '/Miniapi/merchants_list_seach',
	  	    method: 'post',
	  	    data: {
	  	      token: main.get_storage('token'),
			      page: that.data.page,
				  testinfo: that.data.testinfo,
				  a_id: main.get_storage('a_id'),
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
					  orderlist: res.data.data.list,
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
	this.setData({
	  a_id:main.get_storage('a_id'),
	  orderlist:[],
	})
  	if(main.get_storage('a_id') != ''){
  		that.get_address_info();
  	}
	that.getOrderslist();
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