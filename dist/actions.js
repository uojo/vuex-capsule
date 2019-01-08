var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _this = this;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import * as Types from './types';
// import log from './modules/log'
import checkEntityArgs from './modules/checkEntityArgs';
import responseError from './modules/responseError';
// import statePathError from './modules/statePathError'
import createMutationAlias from './modules/createMutationAlias';
import { allStep } from './modules/stepMap';
import correctStatePath from './modules/correctStatePath';

// console.log(Types)
var isPromise = function isPromise(obj) {
  return obj instanceof Promise;
};
var echoError = function echoError(message) {
  return Promise.reject(new Error(message));
};
// const resolveError = message => Promise.resolve({message})
export default (function (options) {
  var _handle;

  var request = options.request;

  var mutationAlias = createMutationAlias(options);
  // log(request)

  var handle = (_handle = {}, _defineProperty(_handle, Types.STEP_SET, function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2, _ref3) {
      var commit = _ref2.commit,
          state = _ref2.state,
          dispatch = _ref2.dispatch;
      var form = _ref3.form,
          operate = _ref3.operate,
          type = _ref3.type,
          stateOperateBasePath = _ref3.stateOperateBasePath,
          stepFieldName = _ref3.stepFieldName,
          errorFieldName = _ref3.errorFieldName,
          message = _ref3.message,
          entityInfo = _ref3.entityInfo;
      var stepFieldValue, stepFieldPath, errorFieldPath, stateOperateTagPath, stateOperateTagValue, mutationTypes;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // log(type)
              // eq {rest|error|progress|done}
              // log({operate, entityInfo, message})
              stepFieldValue = '';

              if (message) {
                stepFieldValue = 'error';
              } else if (allStep.includes(type)) {
                stepFieldValue = type;
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
              stepFieldPath = stateOperateBasePath.concat(stepFieldName).join('.');
              errorFieldPath = stateOperateBasePath.concat(errorFieldName).join('.');
              stateOperateTagPath = stateOperateBasePath.concat('operate').join('.');
              stateOperateTagValue = operate;
              mutationTypes = form + '/' + entityInfo.data.name + '/' + operate + '/' + stepFieldName + '/' + stepFieldValue;
              // log(mutationTypes)

              commit(mutationTypes, { stateOperateTagPath: stateOperateTagPath, stateOperateTagValue: stateOperateTagValue, stepFieldPath: stepFieldPath, stepFieldValue: stepFieldValue, errorFieldPath: errorFieldPath, message: message });

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }()), _defineProperty(_handle, 'collectionOperate', function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref5, actionPayload) {
      var commit = _ref5.commit,
          state = _ref5.state,
          dispatch = _ref5.dispatch;

      var _actionPayload$operat, operate, payload, entityInfo, _entityInfo$data, api, stateOperateBasePath, stateOperateDataPath, requestResult, stepFieldName, errorFieldName, changeStep, mutationMap;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // operate: index,create,delete,update
              // let mainResult
              _actionPayload$operat = actionPayload.operate, operate = _actionPayload$operat === undefined ? 'index' : _actionPayload$operat, payload = actionPayload.payload;
              entityInfo = checkEntityArgs({ state: state, form: 'collection' }, actionPayload, options);
              // log(entityInfo)
              // 检查实体必要元素

              if (!entityInfo.message) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt('return', echoError(entityInfo.message));

            case 4:
              _entityInfo$data = entityInfo.data, api = _entityInfo$data.api, stateOperateBasePath = _entityInfo$data.stateOperateBasePath, stateOperateDataPath = _entityInfo$data.stateOperateDataPath;
              // log({ api, stateOperateBasePath })

              requestResult = void 0;
              stepFieldName = 'step';
              errorFieldName = 'errorMessage';

              changeStep = function changeStep(type, message) {
                return dispatch(Types.STEP_SET, {
                  form: 'collection',
                  type: type,
                  operate: operate,
                  stateOperateBasePath: stateOperateBasePath,
                  stepFieldName: stepFieldName,
                  errorFieldName: errorFieldName,
                  message: message,
                  entityInfo: entityInfo });
              };

              mutationMap = mutationAlias({ form: 'collection', operate: operate, entityInfo: entityInfo });
              // log(mutationMap)

              // 开始

              changeStep('reset');

              if (!(operate === 'index')) {
                _context2.next = 18;
                break;
              }

              // 获取列表数据
              // 设置状态
              changeStep('progress');
              _context2.next = 15;
              return dispatch('collectionSync', {
                api: api.url,
                path: stateOperateBasePath, // [entity,index]
                payload: payload,
                mutationMap: mutationMap
              });

            case 15:
              requestResult = _context2.sent;
              _context2.next = 35;
              break;

            case 18:
              // 对列表中的实体进行操作:增删改查
              // 设置状态
              changeStep('progress');

              if (!(operate === 'create')) {
                _context2.next = 25;
                break;
              }

              _context2.next = 22;
              return dispatch('entitySend', {
                api: api.url,
                method: api.method,
                payload: payload,
                mutationMap: mutationMap,
                callback: {
                  path: stateOperateDataPath, // [entity,index,items]
                  operate: 'splice',
                  value: function value(dd, response, payload) {
                    // log(response, payload)
                    if (responseError('create', api.url, response)) return false;
                    return _extends({ id: response.results.id }, payload);
                  }
                }
              });

            case 22:
              requestResult = _context2.sent;
              _context2.next = 35;
              break;

            case 25:
              if (!(operate === 'update')) {
                _context2.next = 31;
                break;
              }

              _context2.next = 28;
              return dispatch('entitySend', {
                api: api.url,
                method: api.method,
                payload: payload,
                mutationMap: mutationMap,
                callback: {
                  path: stateOperateDataPath,
                  operate: 'match.set',
                  matchField: 'id',
                  matchValue: payload.id,
                  matchCallback: function matchCallback(el, response, payload) {
                    return Object.assign({}, el, payload);
                  }
                }
              });

            case 28:
              requestResult = _context2.sent;
              _context2.next = 35;
              break;

            case 31:
              if (!(operate === 'delete')) {
                _context2.next = 35;
                break;
              }

              _context2.next = 34;
              return dispatch('entitySend', {
                api: api.url,
                method: api.method,
                payload: payload,
                mutationMap: mutationMap,
                callback: {
                  path: stateOperateDataPath,
                  operate: 'match.del',
                  matchField: 'id',
                  matchValue: payload.id
                }
              });

            case 34:
              requestResult = _context2.sent;

            case 35:
              // log(operate, requestResult)
              if (requestResult.message) {
                changeStep('error', requestResult.message);
              } else {
                changeStep('done');
              }
              return _context2.abrupt('return', requestResult);

            case 37:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function collectionOperate(_x3, _x4) {
      return _ref4.apply(this, arguments);
    };
  }()), _defineProperty(_handle, 'entityOperate', function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref7, actionPayload) {
      var commit = _ref7.commit,
          state = _ref7.state,
          dispatch = _ref7.dispatch;

      var mainResult, operate, payload, entityInfo, _entityInfo$data2, stateOperateBasePath, stateOperateDataPath, api, mutationMap, changeStep;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              // operate: index,create,delete,update,read,reset
              mainResult = { message: '' };

              actionPayload.operate = actionPayload.operate || 'index';
              operate = actionPayload.operate, payload = actionPayload.payload;
              entityInfo = checkEntityArgs({ state: state, form: 'single' }, actionPayload, options);
              // console.log(entityInfo)

              if (!entityInfo.message) {
                _context3.next = 6;
                break;
              }

              return _context3.abrupt('return', echoError(entityInfo.message));

            case 6:
              // 获取实体信息
              _entityInfo$data2 = entityInfo.data, stateOperateBasePath = _entityInfo$data2.stateOperateBasePath, stateOperateDataPath = _entityInfo$data2.stateOperateDataPath, api = _entityInfo$data2.api;
              mutationMap = mutationAlias({ form: 'single', operate: operate, entityInfo: entityInfo });

              changeStep = function changeStep(type, message) {
                return dispatch(Types.STEP_SET, {
                  form: 'single',
                  type: type,
                  operate: operate,
                  stateOperateBasePath: stateOperateBasePath,
                  stepFieldName: 'step',
                  errorFieldName: 'errorMessage',
                  message: message,
                  entityInfo: entityInfo });
              };

              changeStep('progress');
              // 不同类型不同处理

              if (!(operate === 'reset')) {
                _context3.next = 14;
                break;
              }

              // 将本地 state.{entity}.read.data 重置
              commit(mutationMap.restDone, {
                path: stateOperateDataPath.join('.')
              });
              _context3.next = 22;
              break;

            case 14:
              if (!api.url) {
                _context3.next = 21;
                break;
              }

              _context3.next = 17;
              return dispatch(['read', 'index'].includes(operate) ? 'entitySync' : 'entitySend', {
                api: api.url,
                method: api.method,
                path: stateOperateDataPath,
                payload: payload,
                mutationMap: mutationMap
              });

            case 17:
              mainResult = _context3.sent;

              if (mainResult.message) {
                changeStep('error', mainResult.message);
              }
              // log(mainResult)
              _context3.next = 22;
              break;

            case 21:
              // 操作本地数据
              if (operate === 'update' && payload) {
                commit(mutationMap.localUpdateDone, {
                  path: stateOperateDataPath,
                  operate: 'set',
                  value: function value(dd) {
                    // log(dd, payload)
                    return Object.assign(dd, payload);
                  }
                });
              } else {
                // 不支持本地操作的

              }

            case 22:
              changeStep('done');
              return _context3.abrupt('return', Promise.resolve(mainResult));

            case 24:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function entityOperate(_x5, _x6) {
      return _ref6.apply(this, arguments);
    };
  }()), _defineProperty(_handle, 'collectionSync', function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_ref9, _ref10) {
      var commit = _ref9.commit,
          state = _ref9.state,
          dispatch = _ref9.dispatch;
      var mutationMap = _ref10.mutationMap,
          path = _ref10.path,
          api = _ref10.api,
          payload = _ref10.payload,
          _ref10$indexFieldName = _ref10.indexFieldName,
          indexFieldName = _ref10$indexFieldName === undefined ? 'id' : _ref10$indexFieldName,
          _ref10$append = _ref10.append,
          append = _ref10$append === undefined ? false : _ref10$append,
          setBefore = _ref10.setBefore,
          setAfter = _ref10.setAfter;
      var mainResult;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // log({mutationName,path,api,payload,append})
              // log(state)
              // log(mutationMap)
              path = correctStatePath(path);
              mainResult = {
                message: '',
                response: null

                // 重置 state.items 数据
              };
              commit(mutationMap.progress, { path: path, append: append });
              // 发送数据请求
              return _context4.abrupt('return', new Promise(function (resolve, reject) {
                var completeCallback = function completeCallback(response) {
                  var success = response.success,
                      message = response.message;

                  mainResult.response = response;
                  // 验证数据结构
                  var responseErrorMsg = responseError('collection', api, response);
                  // log(responseErrorMsg)
                  if (responseErrorMsg) {
                    mainResult.message = responseErrorMsg;
                  } else {
                    if (success) {
                      commit(mutationMap.received, {
                        path: path,
                        response: response,
                        payload: payload,
                        setBefore: setBefore,
                        setAfter: setAfter,
                        indexFieldName: indexFieldName,
                        append: append
                      });
                    } else {
                      mainResult.message = message;
                    }
                    resolve(mainResult);
                  }
                };
                var requestResult = request('get', api, payload);
                if (isPromise(requestResult)) {
                  requestResult.then(function (e) {
                    completeCallback(e);
                  }, function (e) {
                    completeCallback(e);
                  });
                } else {
                  mainResult.message = 'request is not instanceof Promise';
                  resolve(mainResult);
                }
              }));

            case 4:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this);
    }));

    return function collectionSync(_x7, _x8) {
      return _ref8.apply(this, arguments);
    };
  }()), _defineProperty(_handle, 'entitySync', function entitySync(_ref11, _ref12) {
    var commit = _ref11.commit,
        state = _ref11.state,
        dispatch = _ref11.dispatch;
    var mutationMap = _ref12.mutationMap,
        _ref12$method = _ref12.method,
        method = _ref12$method === undefined ? 'get' : _ref12$method,
        api = _ref12.api,
        payload = _ref12.payload,
        _ref12$path = _ref12.path,
        path = _ref12$path === undefined ? '' : _ref12$path,
        setBefore = _ref12.setBefore;

    // log(api, path, payload)
    path = correctStatePath(path);
    var mainResult = {
      message: '',
      response: null
    };
    return new Promise(function (resolve, reject) {
      var reqArgs = [method, api, payload];
      // 处理 request 的返回
      var completeCallback = function completeCallback(response) {
        // response 结构的合法性校验
        var responseErrorMsg = responseError('single', api, response);
        if (responseErrorMsg) {
          mainResult.message = responseErrorMsg;
        } else {
          mainResult.response = response;
          var message = response.message;

          if (message) {
            mainResult.message = response.message;
          } else {
            commit(mutationMap.received, { path: path, response: response, setBefore: setBefore });
          }
        }
        resolve(mainResult);
      };
      var requestResult = request.apply(_this, reqArgs);
      // log(requestResult)
      if (isPromise(requestResult)) {
        requestResult.then(function (e) {
          completeCallback(e);
        }, function (e) {
          completeCallback(e);
        });
      } else {
        mainResult.message = 'request is not instanceof Promise';
        resolve(mainResult);
      }
    });
  }), _defineProperty(_handle, 'entitySend', function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_ref14) {
      var commit = _ref14.commit,
          state = _ref14.state,
          dispatch = _ref14.dispatch;
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var mutationMap, api, _data$payload, payload, redirectUrl, back, _data$requestBeforeAc, requestBeforeActions, _data$requestAfterAct, requestAfterActions, requestSuccess, requestError, callback, _data$method, method, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, it, el, tp, awaitRlt, mainResult;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              mutationMap = data.mutationMap, api = data.api, _data$payload = data.payload, payload = _data$payload === undefined ? {} : _data$payload, redirectUrl = data.redirectUrl, back = data.back, _data$requestBeforeAc = data.requestBeforeActions, requestBeforeActions = _data$requestBeforeAc === undefined ? [] : _data$requestBeforeAc, _data$requestAfterAct = data.requestAfterActions, requestAfterActions = _data$requestAfterAct === undefined ? [] : _data$requestAfterAct, requestSuccess = data.requestSuccess, requestError = data.requestError, callback = data.callback, _data$method = data.method, method = _data$method === undefined ? 'post' : _data$method;
              // log({method, data, payload})
              // log(mutationMap)
              // 前置 actions 执行

              if (!requestBeforeActions.length) {
                _context7.next = 36;
                break;
              }

              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context7.prev = 5;
              _iterator = requestBeforeActions[Symbol.iterator]();

            case 7:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context7.next = 22;
                break;
              }

              it = _step.value;
              el = Object.assign({
                name: '',
                payload: {},
                async: true,
                callback: null
              }, it);
              tp = typeof el.payload === 'function' ? el.payload() : el.payload;

              if (!el.async) {
                _context7.next = 15;
                break;
              }

              // 异步
              dispatch(el.name, tp);
              _context7.next = 19;
              break;

            case 15:
              _context7.next = 17;
              return dispatch(el.name, tp);

            case 17:
              awaitRlt = _context7.sent;

              if (awaitRlt && !awaitRlt.then) {
                el.callback && el.callback(awaitRlt, payload);
              }

            case 19:
              _iteratorNormalCompletion = true;
              _context7.next = 7;
              break;

            case 22:
              _context7.next = 28;
              break;

            case 24:
              _context7.prev = 24;
              _context7.t0 = _context7['catch'](5);
              _didIteratorError = true;
              _iteratorError = _context7.t0;

            case 28:
              _context7.prev = 28;
              _context7.prev = 29;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 31:
              _context7.prev = 31;

              if (!_didIteratorError) {
                _context7.next = 34;
                break;
              }

              throw _iteratorError;

            case 34:
              return _context7.finish(31);

            case 35:
              return _context7.finish(28);

            case 36:
              mainResult = {
                message: '',
                response: null
              };
              return _context7.abrupt('return', new Promise(function () {
                var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(resolve, reject) {
                  var reqArgs, completeCallback, requestResult;
                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          reqArgs = [method, api, payload, null, function (err) {
                            requestError && requestError(err);

                            mainResult.message = err.message;
                            resolve(mainResult);
                          }];

                          completeCallback = function () {
                            var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(response) {
                              var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _it, _el, _tp, _awaitRlt;

                              return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                while (1) {
                                  switch (_context5.prev = _context5.next) {
                                    case 0:
                                      if (!response) {
                                        _context5.next = 41;
                                        break;
                                      }

                                      requestSuccess && requestSuccess(response);

                                      // log(requestAfterActions)

                                      if (!requestAfterActions.length) {
                                        _context5.next = 37;
                                        break;
                                      }

                                      _iteratorNormalCompletion2 = true;
                                      _didIteratorError2 = false;
                                      _iteratorError2 = undefined;
                                      _context5.prev = 6;
                                      _iterator2 = requestAfterActions[Symbol.iterator]();

                                    case 8:
                                      if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                        _context5.next = 23;
                                        break;
                                      }

                                      _it = _step2.value;
                                      _el = Object.assign({
                                        name: '',
                                        payload: null,
                                        async: true,
                                        callback: null
                                      }, _it);
                                      _tp = typeof _el.payload === 'function' ? _el.payload() : _el.payload;

                                      if (!_el.async) {
                                        _context5.next = 16;
                                        break;
                                      }

                                      dispatch(_el.name, _tp);
                                      _context5.next = 20;
                                      break;

                                    case 16:
                                      _context5.next = 18;
                                      return dispatch(_el.name, _tp);

                                    case 18:
                                      _awaitRlt = _context5.sent;

                                      if (_awaitRlt && !_awaitRlt.then) {
                                        _el.callback && _el.callback(_awaitRlt, payload);
                                      }

                                    case 20:
                                      _iteratorNormalCompletion2 = true;
                                      _context5.next = 8;
                                      break;

                                    case 23:
                                      _context5.next = 29;
                                      break;

                                    case 25:
                                      _context5.prev = 25;
                                      _context5.t0 = _context5['catch'](6);
                                      _didIteratorError2 = true;
                                      _iteratorError2 = _context5.t0;

                                    case 29:
                                      _context5.prev = 29;
                                      _context5.prev = 30;

                                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                      }

                                    case 32:
                                      _context5.prev = 32;

                                      if (!_didIteratorError2) {
                                        _context5.next = 35;
                                        break;
                                      }

                                      throw _iteratorError2;

                                    case 35:
                                      return _context5.finish(32);

                                    case 36:
                                      return _context5.finish(29);

                                    case 37:

                                      // 执行回调
                                      if (callback) {
                                        if ((typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) === 'object') {
                                          callback.response = response;
                                          callback.payload = payload;
                                          commit(mutationMap.done, callback);
                                        }
                                      }

                                      back && setTimeout(function () {
                                        if (typeof back === 'string') {
                                          window.location.hash = back;
                                        } else {
                                          window.history.go(-1);
                                        }
                                      }, 500);
                                      redirectUrl && (window.location.hash = redirectUrl);
                                      mainResult.response = response;

                                    case 41:
                                      resolve(mainResult);

                                    case 42:
                                    case 'end':
                                      return _context5.stop();
                                  }
                                }
                              }, _callee5, _this, [[6, 25, 29, 37], [30,, 32, 36]]);
                            }));

                            return function completeCallback(_x13) {
                              return _ref16.apply(this, arguments);
                            };
                          }();

                          requestResult = request.apply(_this, reqArgs);
                          // log(requestResult)

                          if (isPromise(requestResult)) {
                            requestResult.then(function (e) {
                              completeCallback(e);
                            }, function (e) {
                              completeCallback(e);
                            });
                          } else {
                            mainResult.message = 'request is not instanceof Promise';
                            resolve(mainResult);
                          }

                        case 4:
                        case 'end':
                          return _context6.stop();
                      }
                    }
                  }, _callee6, _this);
                }));

                return function (_x11, _x12) {
                  return _ref15.apply(this, arguments);
                };
              }()));

            case 38:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, _this, [[5, 24, 28, 36], [29,, 31, 35]]);
    }));

    return function entitySend(_x9) {
      return _ref13.apply(this, arguments);
    };
  }()), _defineProperty(_handle, 'entitySet', function entitySet(_ref17, payload) {
    var commit = _ref17.commit;

    commit(Types.M_MOD_SET, payload);
  }), _defineProperty(_handle, 'entityReset', function entityReset(_ref18, payload) {
    var commit = _ref18.commit;

    commit(Types.M_MOD_RESET, payload);
  }), _handle);

  return handle;
});