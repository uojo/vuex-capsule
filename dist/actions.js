'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _types = require('./types');

var Types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var _handle;

  var request = _ref.request;

  var handle = (_handle = {}, (0, _defineProperty3.default)(_handle, Types.A_LIST_REQUEST, function (_ref2, _ref3) {
    var commit = _ref2.commit,
        state = _ref2.state,
        dispatch = _ref2.dispatch;
    var path = _ref3.path,
        api = _ref3.api,
        payload = _ref3.payload,
        _ref3$indexFieldName = _ref3.indexFieldName,
        indexFieldName = _ref3$indexFieldName === undefined ? 'id' : _ref3$indexFieldName,
        _ref3$append = _ref3.append,
        append = _ref3$append === undefined ? false : _ref3$append,
        setBefore = _ref3.setBefore,
        setAfter = _ref3.setAfter;

    return new _promise2.default(function (resolve) {
      commit(Types.M_LIST_LOADING, { path: path, append: append });

      var complete_cb = function complete_cb(response) {
        var success = response.success,
            message = response.message;

        if (success) {
          commit(Types.M_LIST_RECEIVED, {
            path: path,
            response: response,
            payload: payload,
            setBefore: setBefore,
            setAfter: setAfter,
            indexFieldName: indexFieldName,
            append: append
          });
        } else {
          commit(Types.M_LIST_ERROR, { path: path, message: message });
        }
        resolve(response);
      };

      var resPromise = void 0;
      try {
        resPromise = request('get', api, payload);
        resPromise.then(function (e) {
          complete_cb(e);
        }, function (e) {
          complete_cb(e);
        });
      } catch (e) {
        console.error(e);
      }
      return resPromise;
    });
  }), (0, _defineProperty3.default)(_handle, Types.A_MOD_REQUEST, function (_ref4, _ref5) {
    var commit = _ref4.commit,
        state = _ref4.state,
        dispatch = _ref4.dispatch;
    var api = _ref5.api,
        _ref5$path = _ref5.path,
        path = _ref5$path === undefined ? '' : _ref5$path,
        _ref5$stepField = _ref5.stepField,
        stepField = _ref5$stepField === undefined ? '' : _ref5$stepField,
        _ref5$errorField = _ref5.errorField,
        errorField = _ref5$errorField === undefined ? '' : _ref5$errorField,
        payload = _ref5.payload,
        setBefore = _ref5.setBefore;

    return new _promise2.default(function (resolve) {
      commit(Types.M_MOD_LOADING, stepField);
      request('get', api, payload, function (response) {
        commit(Types.M_MOD_RECEIVED, {
          path: path,
          stepField: stepField,
          response: response,
          setBefore: setBefore
        });
        resolve(response);
      }, function (response) {
        var message = response.message;

        commit(Types.M_MOD_ERROR, { stepField: stepField, errorField: errorField, message: message });
        resolve(response);
      });
    });
  }), (0, _defineProperty3.default)(_handle, Types.A_SEND_REQUEST, function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref7) {
      var commit = _ref7.commit,
          state = _ref7.state,
          dispatch = _ref7.dispatch;
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var api, _data$payload, payload, redirectUrl, back, _data$requestBeforeAc, requestBeforeActions, _data$requestAfterAct, requestAfterActions, requestSuccess, requestError, callback, _data$stepField, stepField, _data$errorField, errorField, _data$method, method, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, it, el, tp, awaitRlt;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              api = data.api, _data$payload = data.payload, payload = _data$payload === undefined ? {} : _data$payload, redirectUrl = data.redirectUrl, back = data.back, _data$requestBeforeAc = data.requestBeforeActions, requestBeforeActions = _data$requestBeforeAc === undefined ? [] : _data$requestBeforeAc, _data$requestAfterAct = data.requestAfterActions, requestAfterActions = _data$requestAfterAct === undefined ? [] : _data$requestAfterAct, requestSuccess = data.requestSuccess, requestError = data.requestError, callback = data.callback, _data$stepField = data.stepField, stepField = _data$stepField === undefined ? '' : _data$stepField, _data$errorField = data.errorField, errorField = _data$errorField === undefined ? '' : _data$errorField, _data$method = data.method, method = _data$method === undefined ? 'post' : _data$method;


              stepField && commit(Types.M_SEND_STEP, { stepField: stepField, value: 'loading' });

              if (!requestBeforeActions.length) {
                _context3.next = 37;
                break;
              }

              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context3.prev = 6;
              _iterator = (0, _getIterator3.default)(requestBeforeActions);

            case 8:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context3.next = 23;
                break;
              }

              it = _step.value;
              el = (0, _assign2.default)({
                name: '',
                payload: {},
                async: true,
                callback: null
              }, it);
              tp = typeof el.payload === 'function' ? el.payload() : el.payload;

              if (!el.async) {
                _context3.next = 16;
                break;
              }

              dispatch(el.name, tp);
              _context3.next = 20;
              break;

            case 16:
              _context3.next = 18;
              return dispatch(el.name, tp);

            case 18:
              awaitRlt = _context3.sent;

              if (awaitRlt && !awaitRlt.then) {
                el.callback && el.callback(awaitRlt, payload);
              }

            case 20:
              _iteratorNormalCompletion = true;
              _context3.next = 8;
              break;

            case 23:
              _context3.next = 29;
              break;

            case 25:
              _context3.prev = 25;
              _context3.t0 = _context3['catch'](6);
              _didIteratorError = true;
              _iteratorError = _context3.t0;

            case 29:
              _context3.prev = 29;
              _context3.prev = 30;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 32:
              _context3.prev = 32;

              if (!_didIteratorError) {
                _context3.next = 35;
                break;
              }

              throw _iteratorError;

            case 35:
              return _context3.finish(32);

            case 36:
              return _context3.finish(29);

            case 37:
              return _context3.abrupt('return', new _promise2.default(function () {
                var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve) {
                  var reqArgs, resPromise, complete_cb;
                  return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          reqArgs = [method, api, payload, null, function (err) {
                            requestError && requestError(err);

                            var message = err.message;
                            stepField && commit(Types.M_SEND_STEP, { stepField: stepField, errorField: errorField, message: message, value: 'error' });
                          }];
                          resPromise = request.apply(undefined, reqArgs);

                          complete_cb = function () {
                            var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(response) {
                              var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _it, _el, _tp, _awaitRlt;

                              return _regenerator2.default.wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      if (!response) {
                                        _context.next = 41;
                                        break;
                                      }

                                      requestSuccess && requestSuccess(response);

                                      stepField && commit(Types.M_SEND_STEP, { stepField: stepField, value: 'onload' });

                                      if (!requestAfterActions.length) {
                                        _context.next = 38;
                                        break;
                                      }

                                      _iteratorNormalCompletion2 = true;
                                      _didIteratorError2 = false;
                                      _iteratorError2 = undefined;
                                      _context.prev = 7;
                                      _iterator2 = (0, _getIterator3.default)(requestAfterActions);

                                    case 9:
                                      if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                        _context.next = 24;
                                        break;
                                      }

                                      _it = _step2.value;
                                      _el = (0, _assign2.default)({
                                        name: '',
                                        payload: null,
                                        async: true,
                                        callback: null
                                      }, _it);
                                      _tp = typeof _el.payload === 'function' ? _el.payload() : _el.payload;

                                      if (!_el.async) {
                                        _context.next = 17;
                                        break;
                                      }

                                      dispatch(_el.name, _tp);
                                      _context.next = 21;
                                      break;

                                    case 17:
                                      _context.next = 19;
                                      return dispatch(_el.name, _tp);

                                    case 19:
                                      _awaitRlt = _context.sent;

                                      if (_awaitRlt && !_awaitRlt.then) {
                                        _el.callback && _el.callback(_awaitRlt, payload);
                                      }

                                    case 21:
                                      _iteratorNormalCompletion2 = true;
                                      _context.next = 9;
                                      break;

                                    case 24:
                                      _context.next = 30;
                                      break;

                                    case 26:
                                      _context.prev = 26;
                                      _context.t0 = _context['catch'](7);
                                      _didIteratorError2 = true;
                                      _iteratorError2 = _context.t0;

                                    case 30:
                                      _context.prev = 30;
                                      _context.prev = 31;

                                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                      }

                                    case 33:
                                      _context.prev = 33;

                                      if (!_didIteratorError2) {
                                        _context.next = 36;
                                        break;
                                      }

                                      throw _iteratorError2;

                                    case 36:
                                      return _context.finish(33);

                                    case 37:
                                      return _context.finish(30);

                                    case 38:
                                      if (callback) {
                                        if ((typeof callback === 'undefined' ? 'undefined' : (0, _typeof3.default)(callback)) === 'object') {
                                          callback.response = response;
                                          callback.payload = payload;
                                          commit(Types.M_MOD_SET, callback);
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

                                    case 41:
                                      resolve(response);

                                    case 42:
                                    case 'end':
                                      return _context.stop();
                                  }
                                }
                              }, _callee, undefined, [[7, 26, 30, 38], [31,, 33, 37]]);
                            }));

                            return function complete_cb(_x4) {
                              return _ref9.apply(this, arguments);
                            };
                          }();

                          resPromise.then(function (e) {
                            complete_cb(e);
                          }, function (e) {
                            complete_cb(e);
                          });

                        case 4:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, undefined);
                }));

                return function (_x3) {
                  return _ref8.apply(this, arguments);
                };
              }()));

            case 38:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[6, 25, 29, 37], [30,, 32, 36]]);
    }));

    return function (_x) {
      return _ref6.apply(this, arguments);
    };
  }()), _handle);
  return handle;
};