'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _Types$M_LIST_LOADING;

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _types = require('./types');

var Types = _interopRequireWildcard(_types);

var _lodash = require('lodash');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = {
	fn: {
		mapDeep: function mapDeep(data, callback) {
			if ((typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data)) === 'object') {
				var _map = function _map(da) {
					for (var key in da) {
						var td = da[key];

						if (callback(td, key, da) != false && (typeof td === 'undefined' ? 'undefined' : (0, _typeof3.default)(td)) === 'object') {
							_map(td);
						}
					}
				};

				_map(data);
			}
			return data;
		},
		objAssign: function objAssign(dd, sd) {
			if (dd) {
				(0, _assign2.default)(dd, sd);
			} else {
				console.warn('目标对象非法');
			}
			return dd;
		}
	}
};

exports.default = (_Types$M_LIST_LOADING = {}, (0, _defineProperty3.default)(_Types$M_LIST_LOADING, Types.M_LIST_LOADING, function (state, _ref) {
	var path = _ref.path,
	    append = _ref.append;

	var rlt = {
		itemsStep: 'loading'
	};
	if (!append) {
		rlt.items = [];
		rlt.itemsIndex = [];
	}
	var dd = eval('state.' + path);
	utils.fn.objAssign(dd, rlt);
}), (0, _defineProperty3.default)(_Types$M_LIST_LOADING, Types.M_LIST_RECEIVED, function (state, _ref2) {
	var path = _ref2.path,
	    response = _ref2.response,
	    setBefore = _ref2.setBefore,
	    setAfter = _ref2.setAfter,
	    indexFieldName = _ref2.indexFieldName,
	    append = _ref2.append;
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

	if (append) {
		var itemsObj = {};
		items.map(function (n) {
			itemsObj[n[indexFieldName]] = n;
		});
		console.log("res.itemsObj", itemsObj);

		var newItems = [];
		dd.items.map(function (n) {
			var td = itemsObj[n[indexFieldName]];
			console.log(n[indexFieldName], td);
			if (td) {
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
		console.log(path, newItems);
	}

	utils.fn.objAssign(dd, rlt);

	setAfter && setAfter(response);
}), (0, _defineProperty3.default)(_Types$M_LIST_LOADING, Types.M_LIST_ERROR, function (state, _ref3) {
	var path = _ref3.path,
	    message = _ref3.message;

	var rlt = {
		itemsStep: 'error',
		errorMessage: message
	};
	var dd = eval('state.' + path);
	utils.fn.objAssign(dd, rlt);
}), (0, _defineProperty3.default)(_Types$M_LIST_LOADING, Types.M_MOD_LOADING, function (state, stepField) {
	stepField && eval('state.' + stepField + '="loading"');
}), (0, _defineProperty3.default)(_Types$M_LIST_LOADING, Types.M_MOD_RECEIVED, function (state, _ref4) {
	var path = _ref4.path,
	    stepField = _ref4.stepField,
	    res = _ref4.res,
	    setBefore = _ref4.setBefore;

	stepField && eval('state.' + stepField + '="onload"');

	setBefore && (res = setBefore(res));

	var dd = path ? eval('state.' + path) : null;


	if (dd && res) {
		utils.fn.objAssign(dd, res);
	}
}), (0, _defineProperty3.default)(_Types$M_LIST_LOADING, Types.M_MOD_ERROR, function (state, _ref5) {
	var stepField = _ref5.stepField,
	    errorField = _ref5.errorField,
	    message = _ref5.message;


	stepField && eval('state.' + stepField + '="error"');
	errorField && eval('state.' + errorField + '=message');
}), (0, _defineProperty3.default)(_Types$M_LIST_LOADING, Types.M_MOD_RESET, function (state, _ref6) {
	var path = _ref6.path,
	    data = _ref6.data;

	if (!path) return;
	var dd = eval('state.' + path);
	var rlt = (0, _assign2.default)({}, dd);

	utils.fn.mapDeep(rlt, function (val, key, pt) {
		if (val instanceof Array) {
			pt[key] = [];
			return false;
		}
		pt[key] = '';
	});

	utils.fn.objAssign(dd, (0, _assign2.default)(rlt, data));
}), (0, _defineProperty3.default)(_Types$M_LIST_LOADING, Types.M_MOD_SET, function (state, tasks) {

	if (!(0, _lodash.isArray)(tasks) && (0, _lodash.isPlainObject)(tasks)) {
		tasks = [tasks];
	}

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
				if (el[matchField] === matchValue && matchCallback) {
					return matchCallback(el, response);
				} else {
					return el;
				}
			});
		} else if (operate === 'match.del') {
			rlt = eval('state.' + path).filter(function (el, i) {
				if (el[matchField] !== matchValue) {
					return el;
				}
			});

			eval('state.' + path + '=rlt');
		} else if (typeof value != "undefined") {

			if (operate === 'push') {
				eval('state.' + path + '.push(value)');
			} else if (operate === 'set') {
				eval('state.' + path + '=value');
			}
		}
	});
}), (0, _defineProperty3.default)(_Types$M_LIST_LOADING, Types.M_SEND_STEP, function (state, _ref7) {
	var stepField = _ref7.stepField,
	    errorField = _ref7.errorField,
	    message = _ref7.message,
	    value = _ref7.value;

	stepField && eval('state.' + stepField + '=value');
	errorField && message && eval('state.' + errorField + '=message');
}), _Types$M_LIST_LOADING);