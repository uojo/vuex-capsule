var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// import log from './log'
// 检查是否有定义，未定义取默认
export default (function (_ref, useNew, newOne, oldOne) {
  var mutationsKeys = _ref.mutationsKeys;

  // log(mutationsKeys)
  var trlt = {};
  var rlt = useNew ? newOne : oldOne;
  // 支持数组
  rlt = Array.isArray(rlt) ? rlt.join('/') : rlt;
  // 校验是否被定义
  if ((typeof rlt === 'undefined' ? 'undefined' : _typeof(rlt)) === 'object') {
    for (var k in rlt) {
      var val = rlt[k];
      if (Array.isArray(val)) {
        val = val.join('/');
      }
      if (!mutationsKeys.includes(val)) {
        console.warn('[alias] mutation use old', val);
        trlt[k] = oldOne[k];
      } else {
        trlt[k] = val;
      }
    }
  } else if (typeof rlt === 'string') {
    trlt = !mutationsKeys.includes(rlt) ? oldOne : rlt;
  }

  // log('>', trlt)
  return trlt;
});