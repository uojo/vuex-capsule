import { getStatePath } from './entity';
import entityApi from './entityApi';
import statePathError from './statePathError';
// import log from './log'
/**
   * 判断参数合法性
   * @param {string} name 实体名称
   */
export default (function (_ref, _ref2, _ref3) {
  var state = _ref.state,
      form = _ref.form;
  var _ref2$name = _ref2.name,
      name = _ref2$name === undefined ? '' : _ref2$name,
      _ref2$attribute = _ref2.attribute,
      attribute = _ref2$attribute === undefined ? '' : _ref2$attribute,
      _ref2$operate = _ref2.operate,
      operate = _ref2$operate === undefined ? 'index' : _ref2$operate,
      payload = _ref2.payload;
  var apiMap = _ref3.apiMap,
      apiRestful = _ref3.apiRestful;

  var message = '';
  if (!name) {
    message = '实体名称不能为空';
  } else if (!apiMap) {
    message = 'apiMap 错误';
  } else {
    var statePath = getStatePath(name, attribute, operate);
    // log(statePath)
    var stateBasePath = statePath.basePath;
    // eq ~:[name,attribute]
    var stateOperatePath = void 0,
        stateOperateBasePath = void 0,
        stateOperateDataPath = void 0;
    // eq ~:[name,attribute,operate]
    if (form === 'collection') {
      stateOperatePath = statePath.operatePath;
      // eq [~,{index|create|delete|update}]
      stateOperateBasePath = stateBasePath.concat(['index']);
      // eq collection:[~,index]
      stateOperateDataPath = stateOperateBasePath.concat(['items']);
      // eq collection:[~,index,items];
    } else {
      stateOperatePath = statePath.operatePath;
      // eq [~,{reset|create|delete|update|read}]
      stateOperateBasePath = operate === 'reset' ? stateBasePath.concat('read') : stateOperatePath;
      // eq [~,{create|delete|update|read}]
      stateOperateDataPath = stateOperateBasePath.concat('data');
      // eq [~,operate,data]
    }
    // log({stateOperateBasePath})
    // log({form, statePath, stateBasePath, stateOperatePath, stateOperateBasePath, stateOperateDataPath})
    var tempResult = void 0;
    tempResult = statePathError(state, stateBasePath);
    if (tempResult) {
      // 实体 state 操作的基本 path
      message = '[base] ' + tempResult.message;
    } else {
      var _stateBasePath = statePath.basePath;
      var checkStatePath = void 0;
      // 检查 operatePath
      if (form === 'single') {
        tempResult = statePathError(state, stateOperateBasePath);
        if (tempResult) {
          message = '[operate] ' + tempResult.message;
          return { message: message };
        }
      }

      // 检查 operateDataPath
      tempResult = statePathError(state, stateOperateDataPath);
      if (tempResult) {
        message = '[operate.data] ' + tempResult.message;
        return { message: message };
      }

      // 检查 stepPath
      checkStatePath = form === 'collection' ? _stateBasePath.concat(['index', 'step']) : stateOperateBasePath.concat('step');
      tempResult = statePathError(state, checkStatePath);
      if (tempResult) {
        message = tempResult.message;
        return { message: message };
      }

      // 获取实体的 api
      var api = entityApi({ name: name, operate: operate, attribute: attribute, payload: payload, form: form, apiMap: apiMap, apiRestful: apiRestful });
      // 检查实体的 api
      if (!api.url) {
        if (form === 'collection' || form === 'single' && !['update', 'reset'].includes(operate)) {
          message = '\u5B9E\u4F53 "' + JSON.stringify({ name: name, attribute: attribute, operate: operate }) + '" \u7684 API \u4E0D\u80FD\u4E3A\u7A7A';
          return { message: message };
        }
      }

      var data = { name: name, attribute: attribute, operate: operate, payload: payload, api: api, stateBasePath: _stateBasePath, stateOperatePath: stateOperatePath, stateOperateBasePath: stateOperateBasePath, stateOperateDataPath: stateOperateDataPath };
      return { data: data };
    }
    // log({statePath})
  }

  return { message: message };
});