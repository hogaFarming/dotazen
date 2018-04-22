const Promise = require('../vendors/es6-promise/es6-promise.min.js')

/**
 * 替代wx.request方法，返回thenable对象
 */
function request(opts) {
  return new Promise(function(resolve, reject) {
    let _opts = {
      ...opts,
      success(result) {
        resolve(result)
      },
      fail(result) {
        reject(result)
      }
    }
    wx.request(_opts)
  })
}

module.exports = request
