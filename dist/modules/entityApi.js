var getEntityID = function getEntityID(obj) {
  if (obj._id) {
    return obj._id;
  } else if (obj.id) {
    return obj.id;
  }
};

export default (function (_ref) {
  var name = _ref.name,
      _ref$attribute = _ref.attribute,
      attribute = _ref$attribute === undefined ? '' : _ref$attribute,
      _ref$operate = _ref.operate,
      operate = _ref$operate === undefined ? '' : _ref$operate,
      payload = _ref.payload,
      _ref$form = _ref.form,
      form = _ref$form === undefined ? '' : _ref$form,
      apiMap = _ref.apiMap,
      apiRestful = _ref.apiRestful;

  // log(apiMap)
  // log({name, attribute, operate, payload})
  var url = '';
  var info = apiMap[name];
  if (!info) {
    return { url: url };
  }

  if (apiRestful) {
    url = info;
  } else {
    try {
      if (attribute) {
        url = info[attribute][operate];
      } else {
        url = info[operate];
      }
    } catch (e) {
      console.warn(JSON.stringify({ name: name, attribute: attribute, operate: operate }) + ' > request.url is undefined');
      return { url: url };
    }
  }

  // 集合中某条记录的属性列表
  if (apiRestful && attribute) {
    if (payload) {
      var pid = payload._pid;
      if (pid) {
        url += '/' + pid;
      }
    }

    url += '/' + attribute;
  }

  // log('url.base >', url)
  if (operate === 'index') {
    return { url: url, method: 'get' };
  }

  // 判断是否需要参数 ID
  var requireId = false;
  if (apiRestful) {
    if (form === 'collection') {
      if (/delete|update/.test(operate)) {
        requireId = true;
      }
    } else if (form === 'single') {
      if (/read|delete|update/.test(operate)) {
        requireId = true;
      }
    }
  }

  if (requireId) {
    if (!payload) {
      console.warn('\u5B9E\u4F53 ' + name + ' \u7684\u64CD\u4F5C\u7F3A\u5C11 payload');
      return { url: url };
    } else if (!getEntityID(payload)) {
      console.warn('\u5B9E\u4F53 ' + name + ' \u7F3A\u5C11\u552F\u4E00\u6807\u8BC6\u7B26 id');
      return { url: url };
    }
  }

  var method = '';
  if (apiRestful) {
    var methodMap = {
      'create': 'post',
      'delete': 'delete',
      'update': 'put',
      'read': 'get'
    };
    method = form !== 'other' ? methodMap[operate] : 'get';
    // 对url在加工
    if (['delete', 'update', 'read'].includes(operate)) {
      if (requireId) {
        url += '/' + getEntityID(payload);
      }
    }
  } else {
    method = operate === 'read' ? 'get' : 'post';
  }

  // log('api >', form, url, method)
  if (operate !== 'reset' && !url) {
    console.warn(JSON.stringify({ name: name, attribute: attribute, operate: operate }) + ' > request.url is undefined');
  }
  return { url: url, method: method };
});