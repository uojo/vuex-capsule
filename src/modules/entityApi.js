const getEntityID = (obj) => {
  if (obj._id) {
    return obj._id
  } else if (obj.id) {
    return obj.id
  }
}

export default ({name, attribute = '', operate = '', payload, form = '', apiMap, apiRestful}) => {
  // log(apiMap)
  // log({name, attribute, operate, payload})
  let url = ''
  let info = apiMap[name]
  if (!info) {
    return {url}
  }

  if (apiRestful) {
    url = info
  } else {
    try {
      if (attribute) {
        url = info[attribute][operate]
      } else {
        url = info[operate]
      }
    } catch (e) {
      console.warn(`${JSON.stringify({name, attribute, operate})} > request.url is undefined`)
      return {url}
    }
  }

  // 集合中某条记录的属性列表
  if (apiRestful && attribute) {
    if (payload) {
      let pid = payload._pid
      if (pid) {
        url += '/' + pid
      }
    }

    url += '/' + attribute
  }

  // log('url.base >', url)
  if (operate === 'index') {
    return {url, method: 'get'}
  }

  // 判断是否需要参数 ID
  let requireId = false
  if (apiRestful) {
    if (form === 'collection') {
      if (/delete|update/.test(operate)) {
        requireId = true
      }
    } else if (form === 'single') {
      if (/read|delete|update/.test(operate)) {
        requireId = true
      }
    }
  }

  if (requireId) {
    if (!payload) {
      console.warn(`实体 ${name} 的操作缺少 payload`)
      return {url}
    } else if (!getEntityID(payload)) {
      console.warn(`实体 ${name} 缺少唯一标识符 id`)
      return {url}
    }
  }

  let method = ''
  if (apiRestful) {
    let methodMap = {
      'create': 'post',
      'delete': 'delete',
      'update': 'put',
      'read': 'get'
    }
    method = (form !== 'other') ? methodMap[operate] : 'get'
    // 对url在加工
    if (['delete', 'update', 'read'].includes(operate)) {
      if (requireId) {
        url += '/' + getEntityID(payload)
      }
    }
  } else {
    method = operate === 'read' ? 'get' : 'post'
  }

  // log('api >', form, url, method)
  if (operate !== 'reset' && !url) {
    console.warn(`${JSON.stringify({name, attribute, operate})} > request.url is undefined`)
  }
  return {url, method}
}
