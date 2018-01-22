'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _types = require('./types');

var Types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var _handle;

	var request = _ref.request;

	var handle = (_handle = {}, (0, _defineProperty3.default)(_handle, Types.A_LIST_REQUEST, function () {
		var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref3, _ref4) {
			var commit = _ref3.commit,
			    state = _ref3.state,
			    dispatch = _ref3.dispatch;
			var path = _ref4.path,
			    api = _ref4.api,
			    payload = _ref4.payload,
			    _ref4$indexFieldName = _ref4.indexFieldName,
			    indexFieldName = _ref4$indexFieldName === undefined ? 'id' : _ref4$indexFieldName,
			    _ref4$append = _ref4.append,
			    append = _ref4$append === undefined ? false : _ref4$append,
			    setBefore = _ref4.setBefore,
			    setAfter = _ref4.setAfter;
			var complete_cb, res_promise;
			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							commit(Types.M_LIST_LOADING, { path: path, append: append });

							complete_cb = function complete_cb(response) {
								var success = response.success,
								    message = response.message;

								if (success) {
									commit(Types.M_LIST_RECEIVED, {
										path: path,
										response: response, payload: payload,
										setBefore: setBefore,
										setAfter: setAfter,
										indexFieldName: indexFieldName,
										append: append
									});
								} else {
									commit(Types.M_LIST_ERROR, { path: path, message: message });
								}
							};

							res_promise = void 0;

							try {
								res_promise = request('get', api, payload);
								res_promise.then(function (e) {
									complete_cb(e);
								}, function (e) {
									complete_cb(e);
								});
							} catch (e) {
								console.error(e);
							}
							return _context.abrupt('return', res_promise);

						case 5:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined);
		}));

		return function (_x, _x2) {
			return _ref2.apply(this, arguments);
		};
	}()), (0, _defineProperty3.default)(_handle, Types.A_MOD_REQUEST, function (_ref5, _ref6) {
		var commit = _ref5.commit,
		    state = _ref5.state,
		    dispatch = _ref5.dispatch;
		var api = _ref6.api,
		    _ref6$path = _ref6.path,
		    path = _ref6$path === undefined ? "" : _ref6$path,
		    _ref6$stepField = _ref6.stepField,
		    stepField = _ref6$stepField === undefined ? "" : _ref6$stepField,
		    _ref6$errorField = _ref6.errorField,
		    errorField = _ref6$errorField === undefined ? "" : _ref6$errorField,
		    payload = _ref6.payload,
		    setBefore = _ref6.setBefore;

		commit(Types.M_MOD_LOADING, stepField);
		request('get', api, payload, function (response) {
			commit(Types.M_MOD_RECEIVED, {
				path: path,
				stepField: stepField,
				response: response,
				setBefore: setBefore
			});
		}, function (_ref7) {
			var message = _ref7.message;

			commit(Types.M_MOD_ERROR, { stepField: stepField, errorField: errorField, message: message });
		});
	}), (0, _defineProperty3.default)(_handle, Types.A_SEND_REQUEST, function () {
		var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref9) {
			var commit = _ref9.commit,
			    state = _ref9.state,
			    dispatch = _ref9.dispatch;
			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var api, _data$payload, payload, redirectUrl, back, _data$requestBeforeAc, requestBeforeActions, _data$requestAfterAct, requestAfterActions, requestSuccess, requestError, callback, _data$stepField, stepField, _data$errorField, errorField, _data$method, method, i, el, rlt_await, _payload2;

			return _regenerator2.default.wrap(function _callee4$(_context5) {
				while (1) {
					switch (_context5.prev = _context5.next) {
						case 0:
							api = data.api, _data$payload = data.payload, payload = _data$payload === undefined ? {} : _data$payload, redirectUrl = data.redirectUrl, back = data.back, _data$requestBeforeAc = data.requestBeforeActions, requestBeforeActions = _data$requestBeforeAc === undefined ? [] : _data$requestBeforeAc, _data$requestAfterAct = data.requestAfterActions, requestAfterActions = _data$requestAfterAct === undefined ? [] : _data$requestAfterAct, requestSuccess = data.requestSuccess, requestError = data.requestError, callback = data.callback, _data$stepField = data.stepField, stepField = _data$stepField === undefined ? "" : _data$stepField, _data$errorField = data.errorField, errorField = _data$errorField === undefined ? "" : _data$errorField, _data$method = data.method, method = _data$method === undefined ? "post" : _data$method;


							stepField && commit(Types.M_SEND_STEP, { stepField: stepField, value: "loading" });

							if (!requestBeforeActions.length) {
								_context5.next = 18;
								break;
							}

							i = 0;

						case 4:
							if (!(i < requestBeforeActions.length)) {
								_context5.next = 18;
								break;
							}

							el = (0, _assign2.default)({
								name: "",
								payload: {},
								async: true,
								callback: null
							}, requestBeforeActions[i]), rlt_await = void 0;
							_payload2 = typeof el.payload === 'function' ? el.payload() : el.payload;

							if (!el.async) {
								_context5.next = 11;
								break;
							}

							dispatch(el.name, _payload2);
							_context5.next = 15;
							break;

						case 11:
							_context5.next = 13;
							return dispatch(el.name, _payload2);

						case 13:
							rlt_await = _context5.sent;

							if (rlt_await && !rlt_await.then) {
								el.callback && el.callback(rlt_await, payload);
							}

						case 15:
							i++;
							_context5.next = 4;
							break;

						case 18:
							return _context5.abrupt('return', new _promise2.default(function () {
								var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(reslove, reject) {
									var reqArgs, res_promise, complete_cb;
									return _regenerator2.default.wrap(function _callee3$(_context4) {
										while (1) {
											switch (_context4.prev = _context4.next) {
												case 0:
													reqArgs = [method, api, payload, null, function (err) {
														requestError && requestError(err);

														var message = err.message;
														stepField && commit(Types.M_SEND_STEP, { stepField: stepField, errorField: errorField, message: message, value: "error" });
													}];
													res_promise = request.apply(undefined, reqArgs);

													complete_cb = function complete_cb(response) {
														if (response) {
															requestSuccess && requestSuccess(response);

															stepField && commit(Types.M_SEND_STEP, { stepField: stepField, value: "onload" });

															if (requestAfterActions.length) {
																(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
																	var i, _loop;

																	return _regenerator2.default.wrap(function _callee2$(_context3) {
																		while (1) {
																			switch (_context3.prev = _context3.next) {
																				case 0:
																					i = 0;
																					_loop = _regenerator2.default.mark(function _loop() {
																						var el, rlt_await, tfn;
																						return _regenerator2.default.wrap(function _loop$(_context2) {
																							while (1) {
																								switch (_context2.prev = _context2.next) {
																									case 0:
																										el = (0, _assign2.default)({
																											name: "",
																											payload: null,
																											async: true,
																											callback: null
																										}, requestAfterActions[i]), rlt_await = void 0;

																										tfn = function tfn() {
																											return dispatch(el.name, typeof el.payload === 'function' ? el.payload() : el.payload);
																										};

																										if (!el.async) {
																											_context2.next = 6;
																											break;
																										}

																										tfn();
																										_context2.next = 10;
																										break;

																									case 6:
																										_context2.next = 8;
																										return dispatch(el.name, _payload);

																									case 8:
																										rlt_await = _context2.sent;

																										if (rlt_await && !rlt_await.then) {
																											el.callback && el.callback(rlt_await, payload);
																										}

																									case 10:
																										i++;

																									case 11:
																									case 'end':
																										return _context2.stop();
																								}
																							}
																						}, _loop, undefined);
																					});

																				case 2:
																					if (!(i < requestAfterActions.length)) {
																						_context3.next = 6;
																						break;
																					}

																					return _context3.delegateYield(_loop(), 't0', 4);

																				case 4:
																					_context3.next = 2;
																					break;

																				case 6:
																				case 'end':
																					return _context3.stop();
																			}
																		}
																	}, _callee2, undefined);
																}))();
															}

															if (callback) {
																if ((typeof callback === 'undefined' ? 'undefined' : (0, _typeof3.default)(callback)) === 'object') {
																	callback.response = response;
																	callback.payload = payload;
																	commit(Types.M_MOD_SET, callback);
																}
															}

															back && setTimeout(function () {
																if (typeof back === 'string') {
																	location.hash = back;
																} else {
																	window.history.go(-1);
																}
															}, 500);
															redirectUrl && (window.location.hash = redirectUrl);
														}
														reslove(response);
													};

													res_promise.then(function (e) {
														complete_cb(e);
													}, function (e) {
														complete_cb(e);
													});

												case 4:
												case 'end':
													return _context4.stop();
											}
										}
									}, _callee3, undefined);
								}));

								return function (_x5, _x6) {
									return _ref10.apply(this, arguments);
								};
							}()));

						case 19:
						case 'end':
							return _context5.stop();
					}
				}
			}, _callee4, undefined);
		}));

		return function (_x3) {
			return _ref8.apply(this, arguments);
		};
	}()), _handle);
	return handle;
};