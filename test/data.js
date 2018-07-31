import log from './log'

const handle = {
  echo: 'hello',
  fn1: () => {
    return arguments[0]
  },
  callback: (cb) => {
    let i = 0
    log(i)
    i++
    log('callback.cb', cb(i))
    return 'callback'
  },
  fn2: (a, b, cb) => {
    let c = a + b
    return cb(c)
  },
  returnInput: function (e) {
    log('returnInput', e)
    return e
  },
  callbackByOps: function ({s2, s3}) {
    let i = 0
    log(i++) // 1
    i = s2(i++) // 2
    log(i) // 2
    i = s3(i++) // 3
    log(i) // 3
  },
  requestPromise: (payload) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(payload, Date.now())
      }, 1)
    })
  },
  i: 0,
  a: 1,
  b: 2,
  c: 3,
  e: 0
}
export default handle
