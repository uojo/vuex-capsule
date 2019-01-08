import createActions from './actions'
import createMutations from './mutations'
import * as types from './types'
import {createEntity} from './modules/entity'

const createActionsMutations = (options) => {
  let mutations = createMutations(options)
  options.mutationsKeys = Object.keys(mutations)
  return {
    actions: createActions(options),
    mutations: mutations
  }
}
const parseState = (state, source) => {
  // console.log(state)
  let operates = ['index', 'read', 'update', 'create', 'delete']
  let rlt = []

  const mapOperate = (data) => {
    // console.log(data)
    // console.log(Object.keys(data))
    /*
    // root.state >
    data:{
      entity:{
        read:{data:'',source:''},
        update:{data:'',source:''}
      }
    }
    // root.modules >
    data:{
      entity:{
        state:{
          attr1:{
            read:{data:'',source:''},
            update:{data:'',source:''}
          },
          attr2:{a:1,b:2},
          index:{items:'',source:''}
        }
      }
    }
    */
    // 遍历实体
    for (let ename in data) {
      // console.log(ename, '<<<')
      let edata = data[ename]
      if (source === 'modules') {
        // module?
        edata = edata.state
      }

      for (let key in edata) {
        let val = edata[key]
        // console.log(key, val)
        if (operates.includes(key)) {
          // 是操作字段
          if (val.source === 'capsule') {
            rlt.push({name: ename, operate: key, type: val.type})
          }
        } else {
          // 实体属性
          if (val.source === 'capsule') {
            // 保留字段
            rlt.push({name: ename, attribute: key, operate: (val.type === 'collection' ? 'index' : ''), type: val.type})
          } else {
            // 遍历属性的值
            for (let attrOp in val) {
              if (operates.includes(attrOp)) {
                let attrVal = val[attrOp]
                if (attrVal.source === 'capsule') {
                  // console.log('attribute', key)
                  rlt.push({name: ename, attribute: key, operate: attrOp, type: attrVal.type})
                }
              }
            }
          }
        }
      }
    }
  }

  mapOperate(state)
  // console.log(rlt, '>>>')

  return rlt
}

let store = null

const handleEntity = function (ops) {
  // console.log(handle.store, ops)
  if (!store) {
    console.warn('store is null')
    return
  }
  let fname = ops.type === 'collection' ? 'collectionOperate' : 'entityOperate'
  // console.log(fname, ops)
  return store.dispatch(fname, ops)
}

let handle = {
  types,
  createMutations,
  createActions,
  createEntity,
  init: function ({storeOptions, request, apiMap, apiRestful}) {
    // console.log(storeOptions)
    let entityInfo = []
    if (storeOptions.state) {
      entityInfo = entityInfo.concat(entityInfo.concat(parseState(storeOptions.state)))
    }

    if (storeOptions.modules) {
      entityInfo = entityInfo.concat(entityInfo.concat(parseState(storeOptions.modules, 'modules')))
    }
    // console.log({entityInfo})

    const vc = createActionsMutations({
      request,
      apiMap,
      apiRestful,
      entityInfo
    })

    storeOptions.mutations = {
      ...storeOptions.mutations,
      ...vc.mutations
    }

    storeOptions.actions = {
      ...storeOptions.actions,
      ...vc.actions
    }

    return storeOptions
  },
  setStore: function (e) {
    store = e
  },
  handleEntity
}

export default handle

exports.handleEntity = handleEntity
