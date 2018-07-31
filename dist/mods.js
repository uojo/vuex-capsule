'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
var list = exports.list = {
  items: [],
  pageBean: { totalCount: 0, pageSize: 10, pageNo: 1 },
  errorMessage: '',
  itemsStep: ''
}

var createEntity = exports.createEntity = function createEntity () {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'single'
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

  var rlt = void 0
  if (/single|other/.test(type)) {
    rlt = {
      errorMessage: '',
      step: ''
    }
    rlt.data = options.data || {}
  } else if (type === 'list') {
    rlt = {
      items: [],
      pageBean: { totalCount: 0, pageSize: 10, pageNo: 1 },
      errorMessage: '',
      itemsStep: ''
    }
  }

  rlt.type = type
  rlt.source = 'capsule'

  return rlt
}
