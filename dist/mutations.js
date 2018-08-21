var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint no-eval: 0 */
import * as Types from './types';
import { isPlainObject, isArray } from 'lodash';
import utils from './utils';
// import actions from './actions'
import { getStatePath } from './modules/entity';
import { allStep } from './modules/stepMap';
import correctStatePath from './modules/correctStatePath';
// import log from './modules/log'

var statePathError = function statePathError(path) {
  console.warn('state \u8DEF\u5F84\u9519\u8BEF: ' + path);
};

var evalStatePath = function evalStatePath(_ref) {
  var state = _ref.state,
      path = _ref.path,
      shell = _ref.shell,
      value = _ref.value;

  // log(path, value)
  path = correctStatePath(path);

  if (shell) {
    // 对 path 结果执行方法
    try {
      eval('state.' + path + '.' + shell);
    } catch (e) {
      statePathError(path);
    }
  } else if (value) {
    // 赋值
    try {
      eval('state.' + path + '=value');
    } catch (e) {
      statePathError(path);
    }
  } else {
    // 取值
    return eval('state.' + path);
  }
};

var mapMatchError = function mapMatchError(items, path, matchVal) {
  if (items.length > 0) {
    console.warn('\u96C6\u5408 ' + path + ' \u4E2D\u672A\u5339\u914D\u5230 id \u4E3A ' + matchVal + ' \u7684\u8BB0\u5F55');
  } else {
    console.warn('\u96C6\u5408 ' + path + ' \u4E3A\u7A7A\uFF01');
  }
};

// 设置字段 step
var setStatePathStep = function setStatePathStep(_ref2) {
  var state = _ref2.state,
      stateOperateTagPath = _ref2.stateOperateTagPath,
      stateOperateTagValue = _ref2.stateOperateTagValue,
      stepFieldPath = _ref2.stepFieldPath,
      _ref2$stepFieldValue = _ref2.stepFieldValue,
      stepFieldValue = _ref2$stepFieldValue === undefined ? '' : _ref2$stepFieldValue,
      errorFieldPath = _ref2.errorFieldPath,
      _ref2$message = _ref2.message,
      message = _ref2$message === undefined ? '' : _ref2$message;

  // log({stepFieldPath, stepFieldValue, errorFieldPath, message})
  // 设置操作标记
  evalStatePath({ state: state, path: stateOperateTagPath, value: stateOperateTagValue });
  if (message) {
    evalStatePath({ state: state, path: stepFieldPath, value: 'error' });
    evalStatePath({ state: state, path: errorFieldPath, value: message });
  } else {
    evalStatePath({ state: state, path: stepFieldPath, value: stepFieldValue });
  }
};

export default (function (_ref3) {
  var _handler;

  var apiMap = _ref3.apiMap,
      entityInfo = _ref3.entityInfo;

  var handler = (_handler = {}, _defineProperty(_handler, Types.STEP_SET_DONE, function (state, payload) {
    setStatePathStep(_extends({ state: state }, payload));
  }), _defineProperty(_handler, Types.M_LIST_LOADING, function (state, _ref4) {
    var path = _ref4.path,
        append = _ref4.append;

    // log(state, path)
    var rlt = {};
    if (!append) {
      rlt.items = [];
      rlt.itemsIndex = [];
    }
    var dd = evalStatePath({ state: state, path: path });
    utils.fn.objAssign(dd, rlt);
    // log(dd,rlt)
  }), _defineProperty(_handler, Types.M_LIST_RECEIVED, function (state, _ref5) {
    var path = _ref5.path,
        response = _ref5.response,
        payload = _ref5.payload,
        setBefore = _ref5.setBefore,
        setAfter = _ref5.setAfter,
        indexFieldName = _ref5.indexFieldName,
        append = _ref5.append;
    var _response$results = response.results,
        items = _response$results.items,
        pageBean = _response$results.pageBean;

    var rlt = {
      items: items,
      pageBean: pageBean
      // log(rlt);

    };if (setBefore) {
      rlt = setBefore(rlt, response, payload);
    }
    var dd = evalStatePath({ state: state, path: path });
    if (append && indexFieldName) {
      var itemsObj = {};
      items.map(function (n) {
        itemsObj[n[indexFieldName]] = n;
      });
      // log({itemsObj})

      // 遍历原数据
      var newItems = [];
      dd.items.map(function (n) {
        var td = itemsObj[n[indexFieldName]];
        // log(n, td)
        if (td) {
          // 与本地数据重复
          newItems.push(utils.fn.objAssign(n, td));
          delete itemsObj[n[indexFieldName]];
        } else {
          newItems.push(n);
        }
      });

      for (var k in itemsObj) {
        newItems.push(itemsObj[k]);
      }
      rlt.items = newItems;
    }

    // log(dd)
    utils.fn.objAssign(dd, rlt);

    setAfter && setAfter(response, payload);
  }), _defineProperty(_handler, Types.M_LIST_ERROR, function (state, _ref6) {
    var path = _ref6.path,
        message = _ref6.message;

    // Object.assign(state, payload)
    var rlt = {
      step: 'error',
      errorMessage: message
    };
    var dd = evalStatePath({ state: state, path: path });
    utils.fn.objAssign(dd, rlt);
  }), _defineProperty(_handler, Types.M_MOD_RECEIVED, function (state, payload) {
    var path = payload.path,
        response = payload.response,
        setBefore = payload.setBefore;


    setBefore && (response = setBefore(response));

    var dd = path ? evalStatePath({ state: state, path: path }) : null;
    // log(dd, response)

    if (dd && response) {
      utils.fn.objAssign(dd, response.results);
    }
  }), _defineProperty(_handler, Types.M_MOD_RESET, function (state, _ref7) {
    var path = _ref7.path,
        _ref7$data = _ref7.data,
        data = _ref7$data === undefined ? {} : _ref7$data;

    if (!path) return;
    var dd = evalStatePath({ state: state, path: path });
    var rlt = Object.assign({}, dd);
    utils.fn.mapDeep(rlt, function (val, key, pt) {
      if (val instanceof Array) {
        pt[key] = [];
        return false;
      }
      pt[key] = '';
    });
    // log(rlt)
    evalStatePath({ state: state, path: path, value: rlt });
  }), _defineProperty(_handler, Types.M_MOD_SET, function (state, tasks) {
    if (!isArray(tasks) && isPlainObject(tasks)) {
      tasks = [tasks];
    }
    // console.warn('M_MOD_SET', tasks)
    tasks.map(function (task) {
      var path = task.path,
          operate = task.operate,
          value = task.value,
          response = task.response,
          payload = task.payload,
          matchValue = task.matchValue,
          matchField = task.matchField,
          matchCallback = task.matchCallback,
          depend = task.depend;

      if (!path) return;
      // log(path)
      var goon = void 0;
      depend && (goon = depend());
      if (!goon === false) return;
      var dd = evalStatePath({ state: state, path: path });
      if (typeof value === 'function') {
        value = value(dd, response, payload);
      }
      // log(task, value)
      if (operate === 'match.set') {
        var matched = false;
        dd = dd.map(function (el) {
          // log(el, el[matchField], matchValue)
          if (el[matchField] === matchValue) {
            matched = true;
            if (matchCallback) {
              return matchCallback(el, response, payload);
            }
          } else {
            return el;
          }
        });
        if (!matched) {
          mapMatchError(dd, path, matchValue);
        }
        evalStatePath({ state: state, path: path, value: dd });
      } else if (operate === 'match.del') {
        var oldData = evalStatePath({ state: state, path: path });

        var newData = oldData.filter(function (el, i) {
          // log(el)
          if (el[matchField] !== matchValue) {
            return el;
          }
        });
        if (oldData.length === newData.length) {
          mapMatchError(dd, path, matchValue);
        }
        evalStatePath({ state: state, path: path, value: newData });
      } else if (typeof value !== 'undefined') {
        if (operate === 'push') {
          evalStatePath({ state: state, path: path, shell: 'push(value)', value: value });
        } else if (operate === 'splice') {
          evalStatePath({ state: state, path: path, shell: 'splice(0,0,value)', value: value });
        } else if (operate === 'set') {
          evalStatePath({ state: state, path: path, value: value });
        }
      }
    });
  }), _defineProperty(_handler, Types.M_SEND_ERROR, function (state, payload) {
    setStatePathStep(_extends({
      state: state
    }, payload, {
      stepFieldValue: 'error'
    }));
  }), _handler);

  // 添加别名
  var setStepMutation = function setStepMutation(payload) {
    var form = payload.form,
        name = payload.name,
        operate = payload.operate,
        stepField = payload.stepField;
    // log(payload)

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = allStep[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var stepValue = _step.value;

        var tname = form + '/' + name + '/' + operate + '/' + stepField + '/' + stepValue;
        handler[tname] = handler[Types.STEP_SET_DONE];
      }

      // 补充
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (form === 'single' && operate === 'read') {
      setStepMutation(_extends({}, payload, {
        operate: 'reset'
      }));
    }
  };

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = entityInfo[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var entity = _step2.value;

      // log(entity)
      var name = entity.name;
      var operate = entity.operate;
      var form = entity.type;
      var statePath = getStatePath(entity.name, entity.attribute, entity.operate);
      var stateBasePath = [form].concat(statePath.basePath);
      var stateOperatePath = [form].concat(statePath.operatePath);
      // log(stateBasePath, stateOperatePath)
      if (form === 'collection') {
        // 列表实体
        var _arr = ['index', 'create', 'delete', 'update'];
        for (var _i = 0; _i < _arr.length; _i++) {
          var _op = _arr[_i];
          var _prefixMutationName = stateBasePath.concat(_op);

          if (_op === 'index') {
            handler[_prefixMutationName.concat('progress').join('/')] = handler[Types.M_LIST_LOADING];
            handler[_prefixMutationName.concat('received').join('/')] = handler[Types.M_LIST_RECEIVED];
            handler[_prefixMutationName.concat('error').join('/')] = handler[Types.M_LIST_ERROR];
          } else {
            // create,update,delete
            handler[_prefixMutationName.concat(['send', 'error']).join('/')] = handler[Types.M_SEND_ERROR];
            handler[_prefixMutationName.concat(['done']).join('/')] = handler[Types.M_MOD_SET];
          }
          // step
          setStepMutation({
            form: form,
            name: name,
            operate: _op,
            stepField: 'step'
          });
        }
      } else if (form === 'single') {
        // 单一实体
        // log(stateOperatePath)
        if (['index', 'read'].includes(operate)) {
          // index,read
          handler[stateOperatePath.concat('received').join('/')] = handler[Types.M_MOD_RECEIVED];
        } else {
          // create,update,delete
          handler[stateOperatePath.concat(['send', 'error']).join('/')] = handler[Types.M_SEND_ERROR];
        }

        // step
        setStepMutation({
          form: form,
          name: name,
          operate: operate,
          stepField: 'step'
        });

        // 追加
        handler[stateOperatePath.concat('done').join('/')] = handler[Types.M_MOD_SET];
        if (operate === 'read') {
          handler[stateBasePath.concat(['reset', 'done']).join('/')] = handler[Types.M_MOD_RESET];
        }
      }
    }

    // log(handler)
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return handler;
});