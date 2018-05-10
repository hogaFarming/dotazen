//search.js
//获取应用实例
const request = require('../../common/wx-request.js')
const { API_HOST } = require('../../common/config.js')
const app = getApp()

Page({
  data: {
    loading: false,
    searchText: '',
    resultList: []
  },
  onLoad() {
  },
  bindSearchInput(e) {
    this.setData({ searchText: e.detail.value })
  },
  bindSearchConfirm(e) {
    this.postSearch()
  },
  bindSearchBtnTap(e) {
    this.postSearch()
  },
  bindResultItemTap(e) {
    let { id, avatar } = e.currentTarget.dataset
    app.setAccountInfo({
      account_id: id,
      full_avatar: avatar
    })
    wx.navigateTo({
      url: '../index/index'
    })
  },
  /**
   * 根据输入框值搜索，并更新resultList
   */
  postSearch() {
    let searchText = this.data.searchText
    if (!searchText) return
    console.log(`搜索玩家:${searchText}`)
    this.setData({ loading: true });
    request({
      url: `${API_HOST}/api/search`,
      data: { q: searchText },
      method: 'GET',
      dataType: 'json'
    }).then((result) => {
      console.log(result);
      let formattedList = result.data.map(item => ({
        ...item,
        last_match_time_print: item.last_match_time ? item.last_match_time.slice(0, 10) : '无'
      })).slice(0, 20)
      this.setData({ resultList: formattedList })
      this.setData({ loading: false })
    })
  }
})
