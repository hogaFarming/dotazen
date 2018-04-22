//index.js
//获取应用实例
const Promise = require('../../vendors/es6-promise/es6-promise.min.js')
const request = require('../../common/wx-request.js')
const { API_HOST } = require('../../common/config.js')
const { formatUnixTime, secondsToMinutes } = require('../../common/utils.js')
const app = getApp()

Page({
  data: {
    accountInfo: null,
    playerData: null,
    playerWl: null,
    recentMatches: null
  },
  /**
   * 加载过程 先检查有无用户数据
   * 有则请求玩家数据
   * 没有就跳转到search页面
   */
  onLoad() {
    let accountInfo = app.globalData.accountInfo;
    if (accountInfo) {
      this.setData({
        accountInfo: accountInfo
      })
      this.queryPlayerDataAndWl()
      this.queryRecentMatches()
    } else {
      wx.redirectTo({
        url: '../search/search',
      })
    }
  },
  logout() {
    app.logout()
  },
  /**
   * 获取玩家数据
   */
  queryPlayerDataAndWl() {
    let queryPlayerData = function () {
      return request({
        url: `${API_HOST}/api/players/${account_id}`
      })
    }
    let queryWl = function () {
      return request({
        url: `${API_HOST}/api/players/${account_id}/wl`
      })
    }
    let { account_id } = this.data.accountInfo
    Promise.all([
      queryPlayerData(),
      queryWl()
    ]).then(results => {
      let [{ data: playerData }, { data: wl }] = results
      console.log(results)
      let winRate = (wl.win / (wl.win + wl.lose) * 100).toFixed(2) + '%'
      this.setData({
        playerData: playerData,
        playerWl: { ...wl, winRate }
      })
    })
  },
  /**
   * 获取最近比赛
   */
  queryRecentMatches() {
    request({
      url: `${API_HOST}/api/players/${this.data.accountInfo.account_id}/recentMatches`
    }).then(result => {
      this.setData({
        recentMatches: result.data.map(item => this.formatMatchItem(item))
      })
    })
  },
  /**
   * 格式化match数据，供视图显示
   */
  formatMatchItem(matchData) {
    let hero = this.findHeroById(matchData.hero_id)
    let heroImg = `https://api.opendota.com/apps/dota2/images/heroes/${hero.name.replace('npc_dota_hero_', '')}_sb.png`
    let heroName = hero.localized_name
    let skill = app.gameData.SKILL[matchData.skill]
    let gameMode = app.gameData.GAME_MODE[matchData.game_mode].loc_name
    let lobbyType = app.gameData.LOBBY_TYPE[matchData.lobby_type].loc_name
    let isRadiant = matchData.player_slot <= 127
    return {
      ...matchData,
      hero_img: heroImg,
      hero_name: heroName,
      skill_fmt: skill,
      game_mode_fmt: gameMode,
      lobby_type_fmt: lobbyType,
      duration_fmt: secondsToMinutes(matchData.duration),
      is_radiant: isRadiant,
      start_time_fmt: formatUnixTime(matchData.start_time),
      is_winner: (isRadiant && matchData.radiant_win) || (!isRadiant && !matchData.radiant_win)
    }
  },
  findHeroById(heroId) {
    const { HEROES } = app.gameData
    let hero = HEROES.find(item => item.id === heroId)
    return hero || null
  }
})
