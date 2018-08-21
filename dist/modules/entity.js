// import log from './log'
import deepCopy from 'deep-copy';

export var createEntity = function createEntity() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'single';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var rlt = void 0;
  if (/single|other/.test(type)) {
    rlt = {
      errorMessage: '',
      step: '',
      operate: ''
    };
    rlt.data = options.data ? deepCopy(options.data) : {};
  } else if (type === 'collection') {
    rlt = {
      items: [],
      pageBean: { totalCount: 0, pageSize: 10, pageNo: 1 },
      errorMessage: '',
      step: '',
      operate: ''
    };
  }

  rlt.type = type;
  rlt.source = 'capsule';

  return rlt;
};

export var getStatePath = function getStatePath(name, attribute, operate) {
  // log({name, attribute, operate})
  var basePath = [name];
  if (attribute) {
    basePath.push(attribute);
  }
  var operatePath = basePath.concat(operate);
  return { basePath: basePath, operatePath: operatePath };
};