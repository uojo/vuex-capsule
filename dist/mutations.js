'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _Types$M_LIST_LOADING;

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _types = require('./types');

var Types = _interopRequireWildcard(_types);

var _lodash = require('lodash');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var objAssign = function objAssign(dd, sd) {
		if (dd) {
				Object.assign(dd, sd);
		} else {
				console.warn('目标对象非法');
		}
};

exports.default = (_Types$M_LIST_LOADING = {}, _defineProperty(_Types$M_LIST_LOADING, Types.M_LIST_LOADING, function (state, path) {
		var rlt = {
				itemsStep: 'loading',
				items: []
		};
		var dd = eval('state.' + path);
		objAssign(dd, rlt);
}), _defineProperty(_Types$M_LIST_LOADING, Types.M_LIST_RECEIVED, function (state, _ref) {
		var path = _ref.path,
		    response = _ref.response,
		    setBefore = _ref.setBefore,
		    setAfter = _ref.setAfter;
		var items = response.items,
		    pageBean = response.pageBean;

		var rlt = {
				itemsStep: 'onload',
				items: items,
				pageBean: pageBean
		};

		if (setBefore) {
				rlt = setBefore(rlt, response);
		}

		var dd = eval('state.' + path);

		objAssign(dd, rlt);

		setAfter && setAfter(response);
}), _defineProperty(_Types$M_LIST_LOADING, Types.M_LIST_ERROR, function (state, _ref2) {
		var path = _ref2.path,
		    message = _ref2.message;

		var rlt = {
				itemsStep: 'error',
				errorMessage: message
		};
		var dd = eval('state.' + path);
		objAssign(dd, rlt);
}), _defineProperty(_Types$M_LIST_LOADING, Types.M_MOD_LOADING, function (state, stepField) {
		stepField && eval('state.' + stepField + '="loading"');
}), _defineProperty(_Types$M_LIST_LOADING, Types.M_MOD_RECEIVED, function (state, _ref3) {
		var path = _ref3.path,
		    stepField = _ref3.stepField,
		    res = _ref3.res,
		    setBefore = _ref3.setBefore;

		stepField && eval('state.' + stepField + '="onload"');
		var dd = eval('state.' + path);

		setBefore && (res = setBefore(res));


		res && objAssign(dd, res);
}), _defineProperty(_Types$M_LIST_LOADING, Types.M_MOD_ERROR, function (state, _ref4) {
		var stepField = _ref4.stepField,
		    errorField = _ref4.errorField,
		    message = _ref4.message;


		stepField && eval('state.' + stepField + '="error"');
		errorField && eval('state.' + errorField + '=message');
}), _defineProperty(_Types$M_LIST_LOADING, Types.M_MOD_RESET, function (state, _ref5) {
		var path = _ref5.path,
		    data = _ref5.data;

		console.warn("M_MOD_RESET");
		var dd = eval('state.' + path);
		var rlt = Object.assign({}, dd);

		for (var key in rlt) {
				rlt[key] = '';
		}

		objAssign(dd, Object.assign(rlt, data));
}), _defineProperty(_Types$M_LIST_LOADING, Types.M_MOD_SET, function (state, tasks) {

		if (!(0, _lodash.isArray)(tasks) && (0, _lodash.isPlainObject)(tasks)) {
				tasks = [tasks];
		}
		console.warn("M_MOD_SET", tasks);
		tasks.map(function (task) {
				var path = task.path,
				    operate = task.operate,
				    value = task.value,
				    response = task.response,
				    matchValue = task.matchValue,
				    matchField = task.matchField,
				    matchCallback = task.matchCallback,
				    depend = task.depend;


				if (!path) return;

				var goon = void 0;
				depend && (goon = depend());
				if (!goon === false) return;

				var dd = eval('state.' + path);
				var rlt = void 0;

				if (typeof value === 'function') {
						value = value(dd, response);
				}

				if (operate === 'match.set') {
						dd.map(function (el) {
								console.log(el, el[matchField], matchValue);
								if (el[matchField] === matchValue && matchCallback) {
										return matchCallback(el);
								} else {
										return el;
								}
						});
				} else if (operate === 'match.del') {
						rlt = eval('state.' + path).filter(function (el, i) {
								console.log(el);
								if (el[matchField] !== matchValue) {
										return el;
								}
						});

						eval('state.' + path + '=rlt');
				} else if (value) {

						if (operate === 'push') {
								eval('state.' + path + '.push(value)');
						} else if (operate === 'set') {
								eval('state.' + path + '=value');
						}
				}
		});
}), _defineProperty(_Types$M_LIST_LOADING, Types.M_SUBMIT_STEP, function (state, _ref6) {
		var stepField = _ref6.stepField,
		    errorField = _ref6.errorField,
		    message = _ref6.message,
		    value = _ref6.value;

		stepField && eval('state.' + stepField + '=value');
		errorField && message && eval('state.' + errorField + '=message');
}), _Types$M_LIST_LOADING);