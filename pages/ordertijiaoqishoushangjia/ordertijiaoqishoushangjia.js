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
	  ogid: 0,
	  meid:'',
	  date: '',
  },
  changeInputValue: function(e) {
  	this.setData({
  	  weight: e.detail.value,
	  omid: e.currentTarget.dataset.id
  	})
	this.getupdategoodsorder();
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
			  date: that.data.date,
			  meid: that.data.meid
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
     	          wx.reLaunch({
     	            url: '/pages/memberqishou/memberqishou',
     	          })
     	        }, 500);
     	      } else {
     	  		  wx.hideLoading();
     	  		  wx.showToast({
						title: res.data.errmsg,
						icon: 'none',
						duration: 3000
     	  		  })
     	      }
     	    }
     	  })
     },
	 
   getupdategoodsorder:function(){
     	  var that = this;
     	  wx.request({
   			url: app.taskapi + '/Miniapi/orders_goods_update_qishou',
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
     	      }
     	    }
     	  })
     },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	console.log(options.meid)
	console.log(options.date)
	this.setData({
	  meid: options.meid,
	  date: options.date,
	})
 },
  getOrderslist:function(){
    	  var that = this;
    	  wx.showLoading({
    	    title: '加载中',
    	  })
    	  wx.request({
			url: app.taskapi + '/Miniapi/orders_goods_list_new_all',
    	    method: 'post',
    	    data: {
    	      token: main.get_storage('qishou_token'),
  		      page: that.data.page,
  		      meid: that.data.meid,
			  date: that.data.date,
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
				  date: res.data.data.date,
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