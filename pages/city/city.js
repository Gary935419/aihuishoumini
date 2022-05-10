// pages/citylocat/citylocat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    yincang: true,
    yincang1: true,
    hidden: false,
    chooseCity: '您还未选择机场！',
    isShowLayer: false,
    chooseIndex: 0,
    len: [],
    code: null,
    codeY: 'A',
    codeHeight: null,
    cityHeight: null,
    scrollTop: 0,
    cityList: [
      { code: 'A'},
      { code: 'B' },
      { code: 'C' },
      { code: 'D' },
      { code: 'E' },
      { code: 'F' },
      { code: 'G' },
      { code: 'H' },
      { code: 'I' },
      { code: 'J' },
      { code: 'K' },
      { code: 'L' },
      { code: 'M' },
      { code: 'N' },
      { code: 'O' },
      { code: 'P' },
      { code: 'Q' },
      { code: 'R' },
      { code: 'S' },
      { code: 'T' },
      { code: 'U' },
      { code: 'V' }, 
      { code: 'W' },
      { code: 'X' },
      { code: 'Y' },
      { code: 'Z' },
    ],
    list:[
      {
        code: 'A',
        cityList:[
          { url: '../../images/car-logo.png', text:'奥迪'},
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' }
        ]
      },
      {
        code: 'B',
        cityList: [
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' }
        ]
      },
      {
        code: 'C',
        cityList: [
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' }
        ]
      },
      {
        code: 'D',
        cityList: [
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' }
        ]
      },
      {
        code: 'E',
        cityList: [
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' }
        ]
      },
      {
        code: 'F',
        cityList: [
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' }
        ]
      },
      {
        code: 'G',
        cityList: [
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' }
        ]
      },
      {
        code: 'H',
        cityList: [
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' }
        ]
      },
      {
        code: 'I',
        cityList: [
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' }
        ]
      },
      {
        code: 'J',
        cityList: [
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' }
        ]
      },
      {
        code: 'K',
        cityList: [
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' },
          { url: '../../images/car-logo.png', text: '奥迪' }
        ]
      },
    ]
  },
  getCurrentCode(e) {
    console.log(e)
    this.setData({
      codeY: e.currentTarget.dataset.code,
      chooseIndex: e.target.dataset.index,
      isShowLayer: true
    })
  },
  jumpTo: function (e) {
    // 获取标签元素上自定义的 data-opt 属性的值
    console.log(e)
    var that = this
    let target = e.target.dataset.opt;
    that.setData({
      toView: target
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowHeight = wx.getSystemInfoSync().windowHeight;
    var arr = [];
    this.setData({
      cityHeight: windowHeight,
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