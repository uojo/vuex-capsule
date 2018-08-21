/* eslint no-eval: 0 */
// import log from './log'
export default (function (state, path) {
  // log(state, path)
  // 兼容数组类型
  path = Array.isArray(path) ? path.join('.') : path;
  var rlt = false;
  try {
    eval('state.' + path);
  } catch (e) {
    // log(e)
    rlt = e;
  }
  if (!rlt) {
    if (eval('typeof state.' + path + ' === \'undefined\'')) {
      // log(path, eval(`typeof state.${path}`))
      rlt = new Error('state.' + path + ' is not defined');
    }
  }

  return rlt;
});