var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     region: ["四川省", "广元市", "苍溪县"],
     countryList1: ['否','是'],
     countryIndex1: 0,
     previewImageArr: [],
	 address:'',
	 latitude:'',
	 longitude:'',
	 merchantsInfo:[],
	 contactname:'',
	 metel:'',
	 mename:'',
	 imgs: [],
	 upload_picture_list: [],
	 isDe11:'block',
	 isDe22:'none'
  },
  bindaddressText: function(e) {
	  console.log(e.detail.value)
  	this.setData({
  	  address: e.detail.value
  	})
   },
   bindcontactnameText: function(e) {
	   console.log(e.detail.value)
   	this.setData({
   	  contactname: e.detail.value
   	})
    },
	bindmetelText: function(e) {
		console.log(e.detail.value)
		this.setData({
		  metel: e.detail.value
		})
	 },
	 bindmenameText: function(e) {
		 console.log(e.detail.value)
	 	this.setData({
	 	  mename: e.detail.value
	 	})
	  },
   
  // 选择省市区函数
  changeRegin(e){
    this.setData({ region: e.detail.value });
  },
  changeCountry1(e){
    this.setData({ countryIndex1: e.detail.value});
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
        		that.setData({
        		  address:res.address+res.name,
        		  latitude:res.latitude,
        		  longitude:res.longitude,
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
	  get_member_info: function() {
	      var that = this;
	      wx.showLoading({
	        title: '加载中',
	      })
	      wx.request({
	        url: app.taskapi + '/Miniapi/merchantsinfo',
	        method: 'post',
	        data: {
	          token: main.get_storage('merchants_token'),
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
	  	        merchantsInfo: res.data.data.merchants
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
		
		//选择图片方法
		uploadpic: function (e) {
		  let that = this //获取上下文
		  let upload_picture_list = that.data.upload_picture_list
		  //选择图片
		  wx.chooseImage({
		    count: 1, // 默认9，这里显示一次选择相册的图片数量 
		    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
		    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		    success: function (res) { // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
			  
		      let tempFiles = res.tempFiles
		      //把选择的图片 添加到集合里
		      for (let i in tempFiles) {
		        tempFiles[i]['upload_percent'] = 0
		        tempFiles[i]['path_server'] = ''
		        upload_picture_list.push(tempFiles[i])
		      }
		      //显示
		      that.setData({
		        upload_picture_list: upload_picture_list,
				isDe11:'none',
				isDe22:'block'
		      });
				that.uploadimages();
		    },
		  });
		},
		//点击上传图片
		uploadimages() {
		  let page = this
		  let upload_picture_list = page.data.upload_picture_list
			var jsonLength = 0;
			for (var i in upload_picture_list) {
				jsonLength++;
			}
		  //循环把图片上传到服务器 并显示进度       
		  for (let j in upload_picture_list) {
		    if (upload_picture_list[j]['upload_percent'] == 0) {
		      //上传图片后端地址
		      upload_file_server('https://ahs.dltqwy.com/index.php/api/Uploads/pushFIle', page, upload_picture_list, j,jsonLength)
		    }
		  }
		},
		// 点击删除图片
		deleteImg(e) {
		  let upload_picture_list = this.data.upload_picture_list;
		  let index = e.currentTarget.dataset.index;
		  upload_picture_list.splice(index, 1);
		  this.setData({
		    upload_picture_list: upload_picture_list,
			isDe11:'block',
			isDe22:'none'
		  });
		},
		// 预览图片
		previewImg(e) {
		  //获取当前图片的下标
		  let index = e.currentTarget.dataset.index;
		  //所有图片
		  let imgs = this.data.imgs;
			console.log(imgs);
		  wx.previewImage({
		    //当前显示图片
		    current: imgs[index],
		    //所有图片
		    urls: imgs
		  })
		},
		
		merchants_modify: function() {
		  var that = this;
		  wx.showLoading({
		    title: '加载中',
		  })
		  wx.request({
		    url: app.taskapi + '/Miniapi/merchants_modify',
		    method: 'post',
		    data: {
		        token: main.get_storage('merchants_token'),
				is_business: that.data.countryIndex1,
				meaddress:that.data.address,
				latitude:that.data.latitude,
				longitude:that.data.longitude,
				contactname:that.data.contactname,
				metel:that.data.metel,
				mename:that.data.mename,
				meimg:that.data.meimg,
				upload_picture_list: JSON.stringify(that.data.upload_picture_list),
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
				          url: '/pages/member/member',
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

/**
 * 上传图片方法
 */
function upload_file_server(url, that, upload_picture_list, j,jsonLength) {
  //上传返回值
  const upload_task = wx.uploadFile({
    // 模拟https
    url: url, //需要用HTTPS，同时在微信公众平台后台添加服务器地址  
    filePath: upload_picture_list[j]['path'], //上传的文件本地地址    
    name: 'file',
    formData: {
      'num': j,
	  'md5':'4EF82E3603825745124695977A46E8C2'
    },
    //附近数据，这里为路径     
    success: function(res) {
      var data = JSON.parse(res.data);
	   console.log(data);
	   console.log(data.data.src);
      // //字符串转化为JSON  
      if (data.code == '200') {
        var filename = data.src //存储地址 显示
        upload_picture_list[j]['path_server'] = filename
      } else {
        upload_picture_list[j]['path_server'] = filename
      }
      that.setData({
        upload_picture_list:upload_picture_list,
		meimg:data.data.src
      });
    }
  })
  //上传 进度方法
  upload_task.onProgressUpdate((res) => {
    upload_picture_list[j]['upload_percent'] = res.progress
    that.setData({
      upload_picture_list: upload_picture_list
    });
  });
}