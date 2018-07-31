// import log from './log'
// 检查是否有定义，未定义取默认
export default ({mutationsKeys}, useNew, newOne, oldOne) => {
  // log(mutationsKeys)
  let trlt = {}
  let rlt = useNew ? newOne : oldOne
  // 支持数组
  rlt = Array.isArray(rlt) ? rlt.join('/') : rlt
  // 校验是否被定义
  if (typeof rlt === 'object') {
    for (let k in rlt) {
      let val = rlt[k]
      if (Array.isArray(val)) {
        val = val.join('/')
      }
      if (!mutationsKeys.includes(val)) {
        console.warn('[alias] mutation use old', val)
        trlt[k] = oldOne[k]
      } else {
        trlt[k] = val
      }
    }
  } else if (typeof rlt === 'string') {
    trlt = !mutationsKeys.includes(rlt) ? oldOne : rlt
  }

  // log('>', trlt)
  return trlt
}
