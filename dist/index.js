'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _mutations = require('./mutations');

var _mutations2 = _interopRequireDefault(_mutations);

var _types = require('./types');

var types = _interopRequireWildcard(_types);

var _mods = require('./mods');

var mods = _interopRequireWildcard(_mods);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handle = {
	mutations: _mutations2.default,
	types: types,
	createActions: _actions2.default,
	mods: mods
};

exports.default = handle;