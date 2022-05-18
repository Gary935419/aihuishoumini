var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
	shujusum:[],
	ostate:0,
	page: 1,
	orderlist:[],
	oid:''
  },
  //选项卡
  changeTabbar(e){
	var that = this;
	that.setData({
	  page: 1,
	  ostate: e.currentTarget.dataset.id,
	  orderlist:[]
	})
	that.getOrderslist();
  },
 
  warnModalTrue(e){
    var self = this;
	this.setData({ 
	  oid: e.currentTarget.dataset.id,
	}),
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
  			        wx.navigateTo({
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  console.log(options.ostate)
     this.setData({
		 ostate: options.ostate,
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
  
  getOrderslist:function(){
    	  var that = this;
    	  wx.showLoading({
    	    title: '加载中',
    	  })
    	  wx.request({
			url: app.taskapi + '/Miniapi/orders_list',
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
     that.getOrderslist();
     that.infoshujuxinxi();
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
    that.getOrderslist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})