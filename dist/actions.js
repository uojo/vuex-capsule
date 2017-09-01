'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _types = require('./types');

var Types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var _handle;

	var http = _ref.http;

	var handle = (_handle = {}, (0, _defineProperty3.default)(_handle, Types.A_LIST_REQUEST, function (_ref2, _ref3) {
		var commit = _ref2.commit,
		    state = _ref2.state,
		    dispatch = _ref2.dispatch;
		var path = _ref3.path,
		    api = _ref3.api,
		    payload = _ref3.payload,
		    setBefore = _ref3.setBefore,
		    setAfter = _ref3.setAfter;

		commit(Types.M_LIST_LOADING, path);
		http.req('get', api, payload, function (response) {
			commit(Types.M_LIST_RECEIVED, {
				path: path,
				response: response,
				setBefore: setBefore,
				setAfter: setAfter
			});
		}, function (_ref4) {
			var message = _ref4.message;

			commit(Types.M_LIST_ERROR, { path: path, message: message });
		});
	}), (0, _defineProperty3.default)(_handle, Types.A_MOD_REQUEST, function (_ref5, _ref6) {
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
		http.req('get', api, payload, function (res) {
			commit(Types.M_MOD_RECEIVED, {
				path: path,
				stepField: stepField,
				res: res,
				setBefore: setBefore
			});
		}, function (_ref7) {
			var message = _ref7.message;

			commit(Types.M_MOD_ERROR, { stepField: stepField, errorField: errorField, message: message });
		});
	}), (0, _defineProperty3.default)(_handle, Types.A_SUBMIT_REQUEST, function () {
		var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref9) {
			var commit = _ref9.commit,
			    state = _ref9.state,
			    dispatch = _ref9.dispatch;
			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var api, _data$payload, payload, redirectUrl, back, _data$requestBeforeAc, requestBeforeActions, _data$requestAfterAct, requestAfterActions, callback, _data$stepField, stepField, _data$errorField, errorField, i, _loop, rlts;

			return _regenerator2.default.wrap(function _callee2$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							api = data.api, _data$payload = data.payload, payload = _data$payload === undefined ? {} : _data$payload, redirectUrl = data.redirectUrl, back = data.back, _data$requestBeforeAc = data.requestBeforeActions, requestBeforeActions = _data$requestBeforeAc === undefined ? [] : _data$requestBeforeAc, _data$requestAfterAct = data.requestAfterActions, requestAfterActions = _data$requestAfterAct === undefined ? [] : _data$requestAfterAct, callback = data.callback, _data$stepField = data.stepField, stepField = _data$stepField === undefined ? "" : _data$stepField, _data$errorField = data.errorField, errorField = _data$errorField === undefined ? "" : _data$errorField;


							stepField && commit(Types.M_SUBMIT_STEP, { stepField: stepField, value: "loading" });

							if (!requestBeforeActions.length) {
								_context4.next = 9;
								break;
							}

							i = 0;
							_loop = _regenerator2.default.mark(function _loop() {
								var el, trlt, tfn;
								return _regenerator2.default.wrap(function _loop$(_context) {
									while (1) {
										switch (_context.prev = _context.next) {
											case 0:
												el = (0, _assign2.default)({
													name: "",
													payload: null,
													async: true,
													callback: null
												}, requestBeforeActions[i]), trlt = void 0;

												tfn = function tfn() {
													return dispatch(el.name, typeof el.payload === 'function' ? el.payload() : el.payload);
												};

												if (!el.async) {
													_context.next = 6;
													break;
												}

												tfn();
												_context.next = 9;
												break;

											case 6:
												_context.next = 8;
												return tfn();

											case 8:
												trlt = _context.sent;

											case 9:

												el.callback && el.callback(trlt, payload);
												i++;

											case 11:
											case 'end':
												return _context.stop();
										}
									}
								}, _loop, undefined);
							});

						case 5:
							if (!(i < requestBeforeActions.length)) {
								_context4.next = 9;
								break;
							}

							return _context4.delegateYield(_loop(), 't0', 7);

						case 7:
							_context4.next = 5;
							break;

						case 9:
							rlts = void 0;
							_context4.next = 12;
							return http.req('post', api, payload, function (res) {
								var success = res.success,
								    message = res.message;

								rlts = res;


								if (success) {
									stepField && commit(Types.M_SUBMIT_STEP, { stepField: stepField, value: "submitted" });
								} else {
									stepField && commit(Types.M_SUBMIT_STEP, { stepField: stepField, errorField: errorField, message: message, value: "error" });
									return;
								}

								if (requestAfterActions.length) {
									(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
										var i, _loop2;

										return _regenerator2.default.wrap(function _callee$(_context3) {
											while (1) {
												switch (_context3.prev = _context3.next) {
													case 0:
														i = 0;
														_loop2 = _regenerator2.default.mark(function _loop2() {
															var el, trlt, tfn;
															return _regenerator2.default.wrap(function _loop2$(_context2) {
																while (1) {
																	switch (_context2.prev = _context2.next) {
																		case 0:
																			el = (0, _assign2.default)({
																				name: "",
																				payload: null,
																				async: true,
																				callback: null
																			}, requestAfterActions[i]), trlt = void 0;

																			tfn = function tfn() {
																				return dispatch(el.name, typeof el.payload === 'function' ? el.payload() : el.payload);
																			};

																			if (!el.async) {
																				_context2.next = 6;
																				break;
																			}

																			tfn();
																			_context2.next = 9;
																			break;

																		case 6:
																			_context2.next = 8;
																			return tfn();

																		case 8:
																			trlt = _context2.sent;

																		case 9:

																			el.callback && el.callback(trlt, payload);
																			i++;

																		case 11:
																		case 'end':
																			return _context2.stop();
																	}
																}
															}, _loop2, undefined);
														});

													case 2:
														if (!(i < requestAfterActions.length)) {
															_context3.next = 6;
															break;
														}

														return _context3.delegateYield(_loop2(), 't0', 4);

													case 4:
														_context3.next = 2;
														break;

													case 6:
													case 'end':
														return _context3.stop();
												}
											}
										}, _callee, undefined);
									}))();
								}

								if (callback) {
									if ((typeof callback === 'undefined' ? 'undefined' : (0, _typeof3.default)(callback)) === 'object') {
										callback.response = res;
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
							});

						case 12:
							return _context4.abrupt('return', rlts);

						case 13:
						case 'end':
							return _context4.stop();
					}
				}
			}, _callee2, undefined);
		}));

		return function (_x) {
			return _ref8.apply(this, arguments);
		};
	}()), _handle);
	return handle;
};