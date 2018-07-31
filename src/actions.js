
import * as Types from './types'
// import log from './modules/log'
import checkEntityArgs from './modules/checkEntityArgs'
import responseError from './modules/responseError'
// import statePathError from './modules/statePathError'
import createMutationAlias from './modules/createMutationAlias'
import {allStep} from './modules/stepMap'
import correctStatePath from './modules/correctStatePath'

// console.log(Types)
const isPromise = (obj) => (obj instanceof Promise)
const echoError = message => Promise.reject(new Error(message))
// const resolveError = message => Promise.resolve({message})
export default (options) => {
  const {request} = options
  const mutationAlias = createMutationAlias(options)
  // log(request)

  let handle = {
    [Types.STEP_SET]: async ({commit, state, dispatch}, {form, operate, type, stateOperateBasePath, stepFieldName, errorFieldName, message, entityInfo}) => {
      // log(type)
      // eq {rest|error|progress|done}
      // log({operate, entityInfo, message})
      let stepFieldValue = ''
      if (message) {
        stepFieldValue = 'error'
      } else if (allStep.includes(type)) {
        stepFieldValue = type
        /* if (form === 'collection') {
          if (type === 'reset') {
            stepFieldValue = operatedStepMap['reset']
          } else if (type === 'progress') {
            stepFieldValue = operatingStepMap[operate]
          } else if (type === 'done') {
            stepFieldValue = operatedStepMap[operate]
          }
        } else if (form === 'single') {
          stepFieldValue = type
        } */
      }
      // log({stateOperateBasePath, stepFieldValue})
      let stepFieldPath = stateOperateBasePath.concat(stepFieldName).join('.')
      let errorFieldPath = stateOperateBasePath.concat(errorFieldName).join('.')
      let stateOperateTagPath = stateOperateBasePath.concat('operate').join('.')
      let stateOperateTagValue = operate
      let mutationTypes = `${form}/${entityInfo.data.name}/${operate}/${stepFieldName}/${stepFieldValue}`
      // log(mutationTypes)
      commit(mutationTypes, {stateOperateTagPath, stateOperateTagValue, stepFieldPath, stepFieldValue, errorFieldPath, message})
    },

    // 实体集合
    [Types.ENTITY_LIST]: async ({commit, state, dispatch}, actionPayload) => {
      // operate: index,create,delete,update
      // let mainResult
      let {operate = 'index', payload} = actionPayload
      let entityInfo = checkEntityArgs({state, form: 'collection'}, actionPayload, options)
      // log(entityInfo)
      // 检查实体必要元素
      if (entityInfo.message) {
        return echoError(entityInfo.message)
      }
      let { api, stateOperateBasePath, stateOperateDataPath } = entityInfo.data
      // log({ api, stateOperateBasePath })
      let requestResult
      let stepFieldName = 'step'
      let errorFieldName = 'errorMessage'
      const changeStep = (type, message) => dispatch(Types.STEP_SET, {
        form: 'collection',
        type,
        operate,
        stateOperateBasePath,
        stepFieldName,
        errorFieldName,
        message,
        entityInfo})
      let mutationMap = mutationAlias({form: 'collection', operate, entityInfo})
      // log(mutationMap)

      // 开始
      changeStep('reset')

      if (operate === 'index') {
        // 获取列表数据
        // 设置状态
        changeStep('progress')
        requestResult = await dispatch('collectionSync', {
          api: api.url,
          path: stateOperateBasePath, // [entity,index]
          payload,
          mutationMap
        })
      } else {
        // 对列表中的实体进行操作:增删改查
        // 设置状态
        changeStep('progress')
        if (operate === 'create') {
          requestResult = await dispatch('entitySend', {
            api: api.url,
            method: api.method,
            payload,
            mutationMap,
            callback: {
              path: stateOperateDataPath, // [entity,index,items]
              operate: 'splice',
              value (dd, response, payload) {
                // log(response, payload)
                if (responseError('create', api.url, response)) return false
                return {id: response.results.id, ...payload}
              }
            }
          })
        } else if (operate === 'update') {
          requestResult = await dispatch('entitySend', {
            api: api.url,
            method: api.method,
            payload,
            mutationMap,
            callback: {
              path: stateOperateDataPath,
              operate: 'match.set',
              matchField: 'id',
              matchValue: payload.id,
              matchCallback: (el, response, payload) => {
                return Object.assign({}, el, payload)
              }
            }
          })
        } else if (operate === 'delete') {
          requestResult = await dispatch('entitySend', {
            api: api.url,
            method: api.method,
            payload,
            mutationMap,
            callback: {
              path: stateOperateDataPath,
              operate: 'match.del',
              matchField: 'id',
              matchValue: payload.id
            }
          })
        }
      }
      // log(operate, requestResult)
      if (requestResult.message) {
        changeStep('error', requestResult.message)
      } else {
        changeStep('done')
      }
      return requestResult
    },

    // 单一实体
    [Types.ENTITY]: async ({commit, state, dispatch}, actionPayload) => {
      // operate: index,create,delete,update,read,reset
      let mainResult = { message: '' }
      actionPayload.operate = actionPayload.operate || 'index'
      let {operate, payload} = actionPayload
      let entityInfo = checkEntityArgs({state, form: 'single'}, actionPayload, options)
      // console.log(entityInfo)
      if (entityInfo.message) {
        return echoError(entityInfo.message)
      }
      // 获取实体信息
      let {stateOperateBasePath, stateOperateDataPath, api} = entityInfo.data
      let mutationMap = mutationAlias({form: 'single', operate, entityInfo})

      const changeStep = (type, message) => dispatch(Types.STEP_SET, {
        form: 'single',
        type,
        operate,
        stateOperateBasePath,
        stepFieldName: 'step',
        errorFieldName: 'errorMessage',
        message,
        entityInfo})

      changeStep('progress')
      // 不同类型不同处理
      if (operate === 'reset') {
        // 将本地 state.{entity}.read.data 重置
        commit(mutationMap.restDone, {
          path: stateOperateDataPath.join('.')
        })
      } else {
        // log({operate}, api.url)
        // 操作 state.{entity}.{operate}.data
        if (api.url) {
          // 操作远程数据
          mainResult = await dispatch(['read', 'index'].includes(operate) ? 'entitySync' : 'entitySend', {
            api: api.url,
            method: api.method,
            path: stateOperateDataPath,
            payload,
            mutationMap
          })
          if (mainResult.message) {
            changeStep('error', mainResult.message)
          }
          // log(mainResult)
        } else {
        // 操作本地数据
          if (operate === 'update' && payload) {
            commit(mutationMap.localUpdateDone, {
              path: stateOperateDataPath,
              operate: 'set',
              value (dd) {
                // log(dd, payload)
                return Object.assign(dd, payload)
              }
            })
          } else {
            // 不支持本地操作的

          }
        }
      }
      changeStep('done')
      return Promise.resolve(mainResult)
    },

    // 获取列表数据,method:get
    'collectionSync': async ({commit, state, dispatch}, {mutationMap, path, api, payload, indexFieldName = 'id', append = false, setBefore, setAfter}) => {
      // log({mutationName,path,api,payload,append})
      // log(state)
      // log(mutationMap)
      path = correctStatePath(path)
      let mainResult = {
        message: '',
        response: null
      }

      // 重置 state.items 数据
      commit(mutationMap.progress, {path, append})
      // 发送数据请求
      return new Promise((resolve, reject) => {
        const completeCallback = (response) => {
          const {success, message} = response
          mainResult.response = response
          // 验证数据结构
          let responseErrorMsg = responseError('collection', api, response)
          // log(responseErrorMsg)
          if (responseErrorMsg) {
            mainResult.message = responseErrorMsg
          } else {
            if (success) {
              commit(mutationMap.received, {
                path,
                response,
                payload,
                setBefore,
                setAfter,
                indexFieldName,
                append
              })
            } else {
              mainResult.message = message
            }
            resolve(mainResult)
          }
        }
        let requestResult = request('get', api, payload)
        if (isPromise(requestResult)) {
          requestResult.then(e => {
            completeCallback(e)
          }, e => {
            completeCallback(e)
          })
        } else {
          mainResult.message = 'request is not instanceof Promise'
          resolve(mainResult)
        }
      })
    },

    // 获取数据,method:get
    'entitySync': ({commit, state, dispatch}, {mutationMap, method = 'get', api, payload, path = '', setBefore}) => {
      // log(api, path, payload)
      path = correctStatePath(path)
      let mainResult = {
        message: '',
        response: null
      }
      return new Promise((resolve, reject) => {
        const reqArgs = [method, api, payload]
        // 处理 request 的返回
        const completeCallback = (response) => {
          // response 结构的合法性校验
          let responseErrorMsg = responseError('single', api, response)
          if (responseErrorMsg) {
            mainResult.message = responseErrorMsg
          } else {
            mainResult.response = response
            let {message} = response
            if (message) {
              mainResult.message = response.message
            } else {
              commit(mutationMap.received, {path, response, setBefore})
            }
          }
          resolve(mainResult)
        }
        let requestResult = request.apply(this, reqArgs)
        // log(requestResult)
        if (isPromise(requestResult)) {
          requestResult.then(e => {
            completeCallback(e)
          }, e => {
            completeCallback(e)
          })
        } else {
          mainResult.message = 'request is not instanceof Promise'
          resolve(mainResult)
        }
      })
    },

    // 发送数据,method:delete|put|post
    'entitySend': async ({commit, state, dispatch}, data = {}) => {
      const {mutationMap, api, payload = {}, redirectUrl, back, requestBeforeActions = [], requestAfterActions = [], requestSuccess, requestError, callback, method = 'post'} = data
      // log({method, data, payload})
      // log(mutationMap)
      // 前置 actions 执行
      if (requestBeforeActions.length) {
        let i = 0
        while (i < requestBeforeActions.length) {
          let el = Object.assign({
            name: '',
            payload: {},
            callback: null
          }, requestBeforeActions[i])
          let awaitRlt
          let _payload = (typeof el.payload === 'function') ? el.payload() : el.payload
          if (el.async) {
            dispatch(el.name, _payload)
          } else {
            awaitRlt = await dispatch(el.name, _payload)
            if (awaitRlt && !awaitRlt.then) {
              el.callback && el.callback(awaitRlt, payload)
            }
          }
          i++
        }
      }

      let mainResult = {
        message: '',
        response: null
      }
      return new Promise(async (resolve, reject) => {
        const reqArgs = [method, api, payload, null, err => {
          requestError && requestError(err)

          mainResult.message = err.message
          resolve(mainResult)
        }]

        const completeCallback = (response) => {
          // log(response)
          if (response) {
            requestSuccess && requestSuccess(response)

            // log(requestAfterActions)
            if (requestAfterActions.length) {
              (async () => {
                let i = 0
                while (i < requestAfterActions.length) {
                  let el = Object.assign({
                    name: '',
                    payload: null,
                    callback: null
                  }, requestAfterActions[i])
                  let awaitRlt
                  let _payload = (typeof el.payload === 'function' ? el.payload() : el.payload)
                  let tfn = () => dispatch(el.name, _payload)
                  if (el.async) {
                    tfn()
                  } else {
                    awaitRlt = await dispatch(el.name, _payload)
                    if (awaitRlt && !awaitRlt.then) {
                      el.callback && el.callback(awaitRlt, payload)
                    }
                  }
                  i++
                }
              })()
            }

            // 执行回调
            if (callback) {
              if (typeof callback === 'object') {
                callback.response = response
                callback.payload = payload
                commit(mutationMap.done, callback)
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
            mainResult.response = response
          }
          resolve(mainResult)
        }
        let requestResult = request.apply(this, reqArgs)
        // log(requestResult)
        if (isPromise(requestResult)) {
          requestResult.then(e => {
            completeCallback(e)
          }, e => {
            completeCallback(e)
          })
        } else {
          mainResult.message = 'request is not instanceof Promise'
          resolve(mainResult)
        }
      })
    },

    'entitySet': ({commit}, payload) => {
      commit(Types.M_MOD_SET, payload)
    },

    'entityReset': ({commit}, payload) => {
      commit(Types.M_MOD_RESET, payload)
    }
  }

  return handle
}
