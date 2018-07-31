
const handle = {
  fn: {
    objAssign: function () {
      var len = arguments.length
      if (len < 1) { return false }
      if (len === 1) { return arguments[0] }

      function isObj (val) {
        return val && val.constructor === Object
      }
      var queues = []
      for (var i = 0; i < arguments.length; i++) {
        if (isObj(arguments[i])) {
          queues.push(arguments[i])
        }
      }
      var dest = queues[0]

      function _as (dd, sd) {
        for (var key in sd) {
          // console.log(key,sd[key])
          var val
          if (isObj(sd[key])) {
            if (dd.hasOwnProperty(key)) {
              if (isObj(dd[key])) {
                val = _as(dd[key], sd[key])
              } else {
                val = sd[key]
              }
            } else {
              val = _as({}, sd[key])
            }
          } else {
            val = sd[key]
          }
          // console.log(key,val)
          dd[key] = val
        }
        // console.log(dd)
        return dd
      }

      // 从第二个开始
      for (let i = 1; i < len; i++) {
        var sd = queues[i]
        _as(dest, sd)
      }
      return dest
    },
    objAssign1: function (dd, sd) {
      // console.log(dd,sd)
      if (dd) {
        Object.assign(dd, sd)
        // deepAssign(dd,sd)
      } else {
        console.warn('目标对象非法')
      }
      // console.log(dd)
      return dd
    },
    mapDeep: function (data, callback) {
      let _map = function (da) {
        for (var key in da) {
          var td = da[key]
          // console.log(typeof td,td)
          if (callback(td, key, da) !== false && typeof td === 'object') {
            _map(td)
          }
        }
      }
      if (typeof data === 'object') {
        _map(data)
      }
      return data
    }
  }
}

export default handle
