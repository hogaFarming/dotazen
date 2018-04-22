//app.js
const gameData = require('./common/game.js')

App({
  onLaunch () {
    // 本地检索用户数据
    let accountInfo = wx.getStorageSync('account_info');
    if (accountInfo) {
      this.setAccountInfo(accountInfo);
    }
  },
  /**
   * 登出，清除本地用户数据
   * 跳转到search页面
   */
  logout() {
    wx.removeStorageSync('account_info')
    wx.navigateTo({
      url: '../search/search',
    })
  },
  /**
   * 设置用户数据
   */
  setAccountInfo(accountInfo) {
    wx.setStorageSync('account_info', accountInfo)
    this.globalData.accountInfo = accountInfo
  },
  globalData: {
    accountInfo: null
  },
  gameData: gameData
})