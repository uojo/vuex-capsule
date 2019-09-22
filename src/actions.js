import * as Types from './types'

export default ({request}) => {
  // console.log(request)
  let handle = {
    [Types.A_LIST_REQUEST]: ({commit, state, dispatch}, {path, api, payload, indexFieldName = 'id', append = false, setBefore, setAfter}) => {
      // console.log(path,api,payload,append)
      return new Promise((resolve) => {
        commit(Types.M_LIST_LOADING, {path, append})

        const complete_cb = (response) => {
          const {success, message} = response
          if (success) {
            commit(Types.M_LIST_RECEIVED, {
              path,
              response,
              payload,
              setBefore,
              setAfter,
              indexFieldName,
              append
            })
          } else {
            commit(Types.M_LIST_ERROR, { path, message })
          }
          resolve(response)
        }

        let resPromise
        try {
          resPromise = request('get', api, payload)
          resPromise.then(e => {
            complete_cb(e)
          }, e => {
            complete_cb(e)
          })
        } catch (e) {
          console.error(e)
        }
        return resPromise
      })
    },

    [Types.A_MOD_REQUEST]: ({commit, state, dispatch}, {api, path = '', stepField = '', errorField = '', payload, setBefore}) => {
      return new Promise(resolve => {
        // console.log(api,path,payload)
        commit(Types.M_MOD_LOADING, stepField)
        request('get', api, payload, response => {
          // console.log(response)
          commit(Types.M_MOD_RECEIVED, {
            path,
            stepField,
            response,
            setBefore
          })
          resolve(response)
        }, (response) => {
          let {message} = response
          commit(Types.M_MOD_ERROR, { stepField, errorField, message })
          resolve(response)
        })
      })
    },

    [Types.A_SEND_REQUEST]: async ({commit, state, dispatch}, data = {}) => {
      // console.log("data",data)
      // console.log("method",method)
      const {api, payload = {}, redirectUrl, back, requestBeforeActions = [], requestAfterActions = [], requestSuccess, requestError, callback, stepField = '', errorField = '', method = 'post'} = data

      stepField && commit(Types.M_SEND_STEP, {stepField, value: 'loading'})
      // 遍历执行，await 执行
      if (requestBeforeActions.length) {
        for (let it of requestBeforeActions) {
          let el = Object.assign({
            name: '',
            payload: {},
            async: true,
            callback: null
          }, it)
          let tp = (typeof el.payload === 'function') ? el.payload() : el.payload
          if (el.async) {
            // 异步
            dispatch(el.name, tp)
          } else {
            // 同步
            let awaitRlt = await dispatch(el.name, tp)
            if (awaitRlt && !awaitRlt.then) {
              el.callback && el.callback(awaitRlt, payload)
            }
          }
        }
      }

      return new Promise(async (resolve) => {
        const reqArgs = [method, api, payload, null, err => {
          requestError && requestError(err)

          let message = err.message
          stepField && commit(Types.M_SEND_STEP, {stepField, errorField, message, value: 'error'})
        }]
        // console.log(reqArgs)
        let resPromise = request.apply(this, reqArgs)
        // console.log(resPromise)

        const complete_cb = async (response) => {
          if (response) {
            requestSuccess && requestSuccess(response)
            // console.log(response,success,message)
            stepField && commit(Types.M_SEND_STEP, {stepField, value: 'onload'})

            // console.log(requestAfterActions)
            if (requestAfterActions.length) {
              for (let it of requestAfterActions) {
                let el = Object.assign({
                  name: '',
                  payload: null,
                  async: true,
                  callback: null
                }, it)
                let tp = (typeof el.payload === 'function') ? el.payload() : el.payload
                if (el.async) {
                  dispatch(el.name, tp)
                } else {
                  let awaitRlt = await dispatch(el.name, tp)
                  if (awaitRlt && !awaitRlt.then) {
                    el.callback && el.callback(awaitRlt, payload)
                  }
                }
              }
            }

            // 执行回调
            if (callback) {
              if (typeof callback === 'object') {
                callback.response = response
                callback.payload = payload
                commit(Types.M_MOD_SET, callback)
              }
            }

            back && setTimeout(() => {
              if (typeof back === 'string') {
                window.location.hash = back
              } else {
                window.history.go(-1)
              }
            }, 500)
            redirectUrl && (window.location.hash = redirectUrl)
          }
          resolve(response)
        }

        resPromise.then(e => {
          complete_cb(e)
        }, e => {
          complete_cb(e)
        })
      })
    }
  }
  return handle
}
