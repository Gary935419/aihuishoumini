var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    co_id: 0,
	classonelist:[],
	classtwolist:[],
	clidarrs:[]
  },
  changeTabbar(e){
	  var that = this;
      this.setData({ 
		  co_id: e.currentTarget.dataset.id,
		  classtwolist: []
	  }),
	  that.getclasstwolist();
   },
   // 删除方法
     remove: function(array, val) {
       for (var i = 0; i < array.length; i++) {
         if (array[i] == val) {
           array.splice(i, 1);
         }
       }
       return -1;
     },
   checkboxChange: function(e) {
	   let clidarr = this.data.clidarrs
	   if(clidarr.indexOf(e.currentTarget.dataset.id) > -1){
		   var array = clidarr;  //你的数组数据
		   var val = e.currentTarget.dataset.id;  //你要移除的元素标识，例如下标之类的
		   this.remove(array, val);   //调用方法传参
		   this.setData({
		        clidarrs :array
		   })
	   }else{
		   clidarr.push(e.currentTarget.dataset.id)
		   this.setData({
		        clidarrs :clidarr
		   })
	   }

	  main.set_storage('ct_ids', clidarr);
	  this.getclasstwolist()
    },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
		 co_id: options.id
     })
  },

getclassonelist:function(){
    	 var that = this;
    	 wx.showLoading({
    	   title: '加载中',
    	 })
    	 wx.request({
    	   url: app.taskapi + '/Miniapi/class_one_list_type',
    	   method: 'post',
    	   data: {
    	   	co_id:that.data.co_id
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
    	    				  classonelist: res.data.data.list,
							  co_id: that.data.co_id>0?that.data.co_id:res.data.data.list[0].co_id,
    	    				})
							that.getclasstwolist();
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
	
	getclasstwolist:function(){
	    	 var that = this;
	    	 wx.showLoading({
	    	   title: '加载中',
	    	 })
	    	 wx.request({
	    	   url: app.taskapi + '/Miniapi/class_two_list_type',
	    	   method: 'post',
	    	   data: {
				   co_id:that.data.co_id,
				   clidarr:that.data.clidarrs
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
	    	    				  classtwolist:res.data.data.list,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     var that = this;
	 main.set_storage('ct_ids', main.get_storage('ct_ids'));
     that.getclassonelist();
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