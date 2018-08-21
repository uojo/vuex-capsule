var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import createActions from './actions';
import createMutations from './mutations';
import * as types from './types';
import { createEntity } from './modules/entity';

var createActionsMutations = function createActionsMutations(options) {
  var mutations = createMutations(options);
  options.mutationsKeys = Object.keys(mutations);
  return {
    actions: createActions(options),
    mutations: mutations
  };
};
var parseState = function parseState(state, source) {
  // console.log(state)
  var operates = ['index', 'read', 'update', 'create', 'delete'];
  var rlt = [];

  var mapOperate = function mapOperate(data) {
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
    for (var ename in data) {
      // console.log(ename, '<<<')
      var edata = data[ename];
      if (source === 'modules') {
        // module?
        edata = edata.state;
      }

      for (var key in edata) {
        var val = edata[key];
        // console.log(key, val)
        if (operates.includes(key)) {
          // 是操作字段
          if (val.source === 'capsule') {
            rlt.push({ name: ename, operate: key, type: val.type });
          }
        } else {
          // 实体属性
          if (val.source === 'capsule') {
            // 保留字段
            rlt.push({ name: ename, attribute: key, operate: val.type === 'collection' ? 'index' : '', type: val.type });
          } else {
            // 遍历属性的值
            for (var attrOp in val) {
              if (operates.includes(attrOp)) {
                var attrVal = val[attrOp];
                if (attrVal.source === 'capsule') {
                  // console.log('attribute', key)
                  rlt.push({ name: ename, attribute: key, operate: attrOp, type: attrVal.type });
                }
              }
            }
          }
        }
      }
    }
  };

  mapOperate(state);
  // console.log(rlt, '>>>')

  return rlt;
};

var store = null;

var handleEntity = function handleEntity(ops) {
  // console.log(handle.store, ops)
  if (!store) {
    console.warn('store is null');
    return;
  }
  var fname = ops.type === 'collection' ? 'collectionOperate' : 'entityOperate';
  // console.log(fname, ops)
  return store.dispatch(fname, ops);
};

var handle = {
  types: types,
  createMutations: createMutations,
  createActions: createActions,
  createEntity: createEntity,
  init: function init(_ref) {
    var storeOptions = _ref.storeOptions,
        request = _ref.request,
        apiMap = _ref.apiMap,
        apiRestful = _ref.apiRestful;

    // console.log(storeOptions)
    var entityInfo = [];
    if (storeOptions.state) {
      entityInfo = entityInfo.concat(entityInfo.concat(parseState(storeOptions.state)));
    }

    if (storeOptions.modules) {
      entityInfo = entityInfo.concat(entityInfo.concat(parseState(storeOptions.modules, 'modules')));
    }
    // console.log({entityInfo})

    var vc = createActionsMutations({
      request: request,
      apiMap: apiMap,
      apiRestful: apiRestful,
      entityInfo: entityInfo
    });

    storeOptions.mutations = _extends({}, storeOptions.mutations, vc.mutations);

    storeOptions.actions = _extends({}, storeOptions.actions, vc.actions);

    return storeOptions;
  },
  setStore: function setStore(e) {
    store = e;
  },
  handleEntity: handleEntity
};

export default handle;

exports.handleEntity = handleEntity;