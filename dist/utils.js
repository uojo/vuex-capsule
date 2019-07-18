'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handle = {
  fn: {
    objAssign: function objAssign() {
      var len = arguments.length;
      if (len < 1) {
        return false;
      }
      if (len == 1) {
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

          dd[key] = val;
        }

        return dd;
      }

      for (var i = 1; i < len; i++) {
        var sd = queues[i];
        _as(dest, sd);
      }
      return dest;
    },
    objAssign1: function objAssign1(dd, sd) {
      if (dd) {
        (0, _assign2.default)(dd, sd);
      } else {
        console.warn('目标对象非法');
      }

      return dd;
    },
    'mapDeep': function mapDeep(data, callback) {
      if ((typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data)) === 'object') {
        var _map = function _map(da) {
          for (var key in da) {
            var td = da[key];

            if (callback(td, key, da) != false && (typeof td === 'undefined' ? 'undefined' : (0, _typeof3.default)(td)) === 'object') {
              _map(td);
            }
          }
        };

        _map(data);
      }
      return data;
    }
  }
};

exports.default = handle;