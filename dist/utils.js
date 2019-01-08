var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var handle = {
  fn: {
    objAssign: function objAssign() {
      var len = arguments.length;
      if (len < 1) {
        return false;
      }
      if (len === 1) {
        return arguments[0];
      }

      function isObj(val) {
        return val && val.constructor === Object;
      }
      var queues = [];
      for (var i = 0; i < arguments.length; i++) {
        if (isObj(arguments[i])) {
          queues.push(arguments[i]);
        }
      }
      var dest = queues[0];

      function _as(dd, sd) {
        for (var key in sd) {
          // console.log(key,sd[key])
          var val;
          if (isObj(sd[key])) {
            if (dd.hasOwnProperty(key)) {
              if (isObj(dd[key])) {
                val = _as(dd[key], sd[key]);
              } else {
                val = sd[key];
              }
            } else {
              val = _as({}, sd[key]);
            }
          } else {
            val = sd[key];
          }
          // console.log(key,val)
          dd[key] = val;
        }
        // console.log(dd)
        return dd;
      }

      // 从第二个开始
      for (var _i = 1; _i < len; _i++) {
        var sd = queues[_i];
        _as(dest, sd);
      }
      return dest;
    },
    objAssign1: function objAssign1(dd, sd) {
      // console.log(dd,sd)
      if (dd) {
        Object.assign(dd, sd);
        // deepAssign(dd,sd)
      } else {
        console.warn('目标对象非法');
      }
      // console.log(dd)
      return dd;
    },
    mapDeep: function mapDeep(data, callback) {
      var _map = function _map(da) {
        for (var key in da) {
          var td = da[key];
          // console.log(typeof td,td)
          if (callback(td, key, da) !== false && (typeof td === 'undefined' ? 'undefined' : _typeof(td)) === 'object') {
            _map(td);
          }
        }
      };
      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
        _map(data);
      }
      return data;
    }
  }
};

export default handle;