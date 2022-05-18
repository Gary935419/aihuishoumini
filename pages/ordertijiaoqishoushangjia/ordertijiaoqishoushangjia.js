var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  omid:'',
	  orderlist:[],
	  weight: 0,
	  ogid: 0
  },
  changeInputValue: function(e) {
  	this.setData({
  	  weight: e.detail.value,
	  omid: e.currentTarget.dataset.id
  	})
	// this.getupdategoodsorder();
   },

   getupdatesumgoodsorder:function(){
     	  var that = this;
     	  wx.showLoading({
     	    title: '加载中',
     	  })
     	  wx.request({
   			url: app.taskapi + '/Miniapi/sum_orders_goods_update_qishou',
     	    method: 'post',
     	    data: {
     	      token: main.get_storage('qishou_token'),
   		      weight: that.data.weight,
			  omid: that.data.omid
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
     	        setTimeout(function() {
     	          wx.redirectTo({
     	            url: '/pages/orderlistqishou/orderlistqishou',
     	          })
     	        }, 500);
     	      } else {
     	  		  wx.hideLoading();
     	  		  wx.showToast({
     	  		  			title: res.data.errmsg,
     	  		  			icon: 'none',
     	  		  			duration: 3000
     	  		  })
     	  		  setTimeout(function() {
     	  		    wx.redirectTo({
     	  		      url: '/pages/orderlistqishou/orderlistqishou',
     	  		    })
     	  		  }, 500);
     	      }
     	    }
     	  })
     },
	 
   getupdategoodsorder:function(){
     	  var that = this;
     	  wx.showLoading({
     	    title: '加载中',
     	  })
     	  wx.request({
   			url: app.taskapi + '/Miniapi/orders_goods_update',
     	    method: 'post',
     	    data: {
     	      token: main.get_storage('merchants_token'),
   		      weight: that.data.weight,
   		      ogid: that.data.ogid,
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
     this.setData({
  		 omid: options.omid
     })
  },
  getOrderslist:function(){
    	  var that = this;
    	  wx.showLoading({
    	    title: '加载中',
    	  })
    	  wx.request({
			url: app.taskapi + '/Miniapi/orders_goods_list_new_one',
    	    method: 'post',
    	    data: {
    	      token: main.get_storage('qishou_token'),
  		      page: that.data.page,
  		      omid: that.data.omid,
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
  onShow: function () {
     var that = this;
     this.setData({
       page: 1,
       orderlist:[],
     })
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