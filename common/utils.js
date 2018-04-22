/**
 * 格式化unix时间戳
 * @param unixTime {number}
 * @return result {string} eg.12小时前/3天前/2018-01-03
 */
const formatUnixTime = unixTime => {
  let now = Math.round(new Date() / 1000)
  let diff = now - unixTime
  let diffHours = diff / 3600
  let diffDays = diffHours / 24
  if (diffHours < 24) {
    return Math.ceil(diffHours) + '小时前'
  } else if (diffDays < 7) {
    return Math.ceil(diffDays) + '天前'
  } else {
    let date = new Date(unixTime * 1000)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + '-' + addZero(month) + '-' + addZero(day)
  }
}

/**
 * 将秒数转为 分钟:秒钟 的格式
 * @param seconds {number}
 * @return ms {string} eg. 23:04
 */
const secondsToMinutes = seconds => {
  let minutes = Math.ceil(seconds / 60)
  let rest = seconds % 60
  return minutes + ':' + addZero(rest)
}

/**
 * 给小于10的数字补0
 */
const addZero = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatUnixTime,
  secondsToMinutes
}
