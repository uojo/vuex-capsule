export default (function (type, url, res) {
  if (res === undefined) {
    return 'response is undefined, url:' + url;
  }
  // 错误
  if (!res.success && res.message !== undefined) {
    return res.message;
  }

  // 数据
  var message = '';
  if (type === 'collection') {
    var results = res.results;

    if (results === undefined) {
      message = 'response.results is undefined, url:' + url;
    } else {
      var items = results.items;

      if (items === undefined) {
        message = 'response.results.items is undefined, url:' + url;
      }
      /* if (pageBean === undefined) {
        message = `response.results.pageBean is undefined, url:${url}`
      } */
    }
  } else if (type === 'create') {
    var _results = res.results;

    if (_results === undefined) {
      message = 'response.results is undefined, url:' + url;
    } else {
      var id = _results.id;

      if (id === undefined) {
        message = 'response.results.id is undefined, url:' + url;
      }
    }
  } else if (type === 'single') {
    var _results2 = res.results;

    if (_results2 === undefined) {
      message = 'response.results is undefined, url:' + url;
    }
  }

  return message;
});