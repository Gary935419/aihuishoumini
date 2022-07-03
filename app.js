// app.js
App({
	taskapi: 'https://ahs.dltqwy.com/index.php/api', //正式接口测试
	taskapiimg: 'https://ahs.dltqwy.com/', 
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
	  meid: '',
	  a_id: '',
	  ct_ids:'',
	  userInfo: [],
	  merchantsInfo:[],
	  qishouInfo:[],
	  openid: '',
	  sessionKey: '',
	  token: '',
	  merchants_sessionKey: '',
	  merchants_token: '',
	  qishou_sessionKey: '',
	  qishou_token: ''
  }
})
