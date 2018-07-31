/* eslint no-eval: 0 */
import * as Types from './types'
import {isPlainObject, isArray} from 'lodash'
import utils from './utils'
// import actions from './actions'
import {getStatePath} from './modules/entity'
import {allStep} from './modules/stepMap'
import correctStatePath from './modules/correctStatePath'
// import log from './modules/log'

const statePathError = (path) => {
  console.warn(`state 路径错误: ${path}`)
}

const evalStatePath = ({state, path, shell, value}) => {
  // log(path, value)
  path = correctStatePath(path)

  if (shell) {
    // 对 path 结果执行方法
    try {
      eval(`state.${path}.${shell}`)
    } catch (e) {
      statePathError(path)
    }
  } else if (value) {
    // 赋值
    try {
      eval(`state.${path}=value`)
    } catch (e) {
      statePathError(path)
    }
  } else {
    // 取值
    return eval(`state.${path}`)
  }
}

const mapMatchError = (items, path, matchVal) => {
  if (items.length > 0) {
    console.warn(`集合 ${path} 中未匹配到 id 为 ${matchVal} 的记录`)
  } else {
    console.warn(`集合 ${path} 为空！`)
  }
}

// 设置字段 step
const setStatePathStep = ({state, stateOperateTagPath, stateOperateTagValue, stepFieldPath, stepFieldValue = '', errorFieldPath, message = ''}) => {
  // log({stepFieldPath, stepFieldValue, errorFieldPath, message})
  // 设置操作标记
  evalStatePath({state, path: stateOperateTagPath, value: stateOperateTagValue})
  if (message) {
    evalStatePath({state, path: stepFieldPath, value: 'error'})
    evalStatePath({state, path: errorFieldPath, value: message})
  } else {
    evalStatePath({state, path: stepFieldPath, value: stepFieldValue})
  }
}

export default ({apiMap, entityInfo}) => {
  let handler = {
  // 通用 -- start
    [Types.STEP_SET_DONE]: (state, payload) => {
      setStatePathStep({state, ...payload})
    },
    [Types.M_LIST_LOADING]: (state, {path, append}) => {
      // log(state, path)
      let rlt = {}
      if (!append) {
        rlt.items = []
        rlt.itemsIndex = []
      }
      let dd = evalStatePath({state, path})
      utils.fn.objAssign(dd, rlt)
      // log(dd,rlt)
    },
    [Types.M_LIST_RECEIVED]: (state, {path, response, payload, setBefore, setAfter, indexFieldName, append}) => {
      let {items, pageBean} = response.results
      let rlt = {
        items,
        pageBean
      }
      // log(rlt);

      if (setBefore) {
        rlt = setBefore(rlt, response, payload)
      }
      let dd = evalStatePath({state, path})
      if (append && indexFieldName) {
        let itemsObj = {}
        items.map(n => {
          itemsObj[n[indexFieldName]] = n
        })
        // log({itemsObj})

        // 遍历原数据
        let newItems = []
        dd.items.map(n => {
          let td = itemsObj[n[indexFieldName]]
          // log(n, td)
          if (td) {
          // 与本地数据重复
            newItems.push(utils.fn.objAssign(n, td))
            delete itemsObj[n[indexFieldName]]
          } else {
            newItems.push(n)
          }
        })

        for (let k in itemsObj) {
          newItems.push(itemsObj[k])
        }
        rlt.items = newItems
      }

      // log(dd)
      utils.fn.objAssign(dd, rlt)

      setAfter && setAfter(response, payload)
    },
    [Types.M_LIST_ERROR]: (state, {path, message}) => {
    // Object.assign(state, payload)
      let rlt = {
        step: 'error',
        errorMessage: message
      }
      let dd = evalStatePath({state, path})
      utils.fn.objAssign(dd, rlt)
    },

    [Types.M_MOD_RECEIVED]: (state, payload) => {
      let {path, response, setBefore} = payload

      setBefore && (response = setBefore(response))

      let dd = path ? evalStatePath({state, path}) : null
      // log(dd, response)

      if (dd && response) {
        utils.fn.objAssign(dd, response.results)
      }
    },

    [Types.M_MOD_RESET]: (state, {path, data = {}}) => {
      if (!path) return
      let dd = evalStatePath({state, path})
      let rlt = Object.assign({}, dd)
      utils.fn.mapDeep(rlt, (val, key, pt) => {
        if (val instanceof Array) {
          pt[key] = []
          return false
        }
        pt[key] = ''
      })
      // log(rlt)
      evalStatePath({state, path, value: rlt})
    },
    [Types.M_MOD_SET]: (state, tasks) => {
      if (!isArray(tasks) && isPlainObject(tasks)) {
        tasks = [tasks]
      }
      // console.warn('M_MOD_SET', tasks)
      tasks.map(task => {
        let {
          path, operate, value, response, payload,
          matchValue, matchField, matchCallback,
          depend
        } = task
        if (!path) return
        // log(path)
        let goon
        depend && (goon = depend())
        if (!goon === false) return
        let dd = evalStatePath({state, path})
        if (typeof value === 'function') {
          value = value(dd, response, payload)
        }
        // log(task, value)
        if (operate === 'match.set') {
          let matched = false
          dd = dd.map(el => {
            // log(el, el[matchField], matchValue)
            if (el[matchField] === matchValue) {
              matched = true
              if (matchCallback) {
                return matchCallback(el, response, payload)
              }
            } else {
              return el
            }
          })
          if (!matched) {
            mapMatchError(dd, path, matchValue)
          }
          evalStatePath({state, path, value: dd})
        } else if (operate === 'match.del') {
          let oldData = evalStatePath({state, path})

          let newData = oldData.filter((el, i) => {
            // log(el)
            if (el[matchField] !== matchValue) {
              return el
            }
          })
          if (oldData.length === newData.length) {
            mapMatchError(dd, path, matchValue)
          }
          evalStatePath({state, path, value: newData})
        } else if (typeof value !== 'undefined') {
          if (operate === 'push') {
            evalStatePath({state, path, shell: 'push(value)', value})
          } else if (operate === 'splice') {
            evalStatePath({state, path, shell: 'splice(0,0,value)', value})
          } else if (operate === 'set') {
            evalStatePath({state, path, value})
          }
        }
      })
    },

    [Types.M_SEND_ERROR]: (state, payload) => {
      setStatePathStep({
        state,
        ...payload,
        stepFieldValue: 'error'
      })
    }
  // 通用 -- end
  }

  // 添加别名
  const setStepMutation = (payload) => {
    let {form, name, operate, stepField} = payload
    // log(payload)
    for (let stepValue of allStep) {
      let tname = `${form}/${name}/${operate}/${stepField}/${stepValue}`
      handler[tname] = handler[Types.STEP_SET_DONE]
    }

    // 补充
    if (form === 'single' && operate === 'read') {
      setStepMutation({
        ...payload,
        operate: 'reset'
      })
    }
  }

  for (let entity of entityInfo) {
    // log(entity)
    let name = entity.name
    let operate = entity.operate
    let form = entity.type
    const statePath = getStatePath(entity.name, entity.attribute, entity.operate)
    const stateBasePath = [form].concat(statePath.basePath)
    const stateOperatePath = [form].concat(statePath.operatePath)
    // log(stateBasePath, stateOperatePath)
    if (form === 'collection') {
      // 列表实体
      for (let _op of ['index', 'create', 'delete', 'update']) {
        let _prefixMutationName = stateBasePath.concat(_op)

        if (_op === 'index') {
          handler[_prefixMutationName.concat('progress').join('/')] = handler[Types.M_LIST_LOADING]
          handler[_prefixMutationName.concat('received').join('/')] = handler[Types.M_LIST_RECEIVED]
          handler[_prefixMutationName.concat('error').join('/')] = handler[Types.M_LIST_ERROR]
        } else {
          // create,update,delete
          handler[_prefixMutationName.concat(['send', 'error']).join('/')] = handler[Types.M_SEND_ERROR]
          handler[_prefixMutationName.concat(['done']).join('/')] = handler[Types.M_MOD_SET]
        }
        // step
        setStepMutation({
          form,
          name,
          operate: _op,
          stepField: 'step'
        })
      }
    } else if (form === 'single') {
      // 单一实体
      // log(stateOperatePath)
      if (['index', 'read'].includes(operate)) {
        // index,read
        handler[stateOperatePath.concat('received').join('/')] = handler[Types.M_MOD_RECEIVED]
      } else {
        // create,update,delete
        handler[stateOperatePath.concat(['send', 'error']).join('/')] = handler[Types.M_SEND_ERROR]
      }

      // step
      setStepMutation({
        form,
        name,
        operate,
        stepField: 'step'
      })

      // 追加
      handler[stateOperatePath.concat('done').join('/')] = handler[Types.M_MOD_SET]
      if (operate === 'read') {
        handler[ stateBasePath.concat(['reset', 'done']).join('/') ] = handler[Types.M_MOD_RESET]
      }
    }
  }

  // log(handler)
  return handler
}
