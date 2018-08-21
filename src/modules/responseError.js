export default (type, url, res) => {
  if (res === undefined) {
    return `response is undefined, url:${url}`
  }
  // 错误
  if (!res.success && res.message !== undefined) {
    return res.message
  }

  // 数据
  let message = ''
  if (type === 'collection') {
    let {results} = res
    if (results === undefined) {
      message = `response.results is undefined, url:${url}`
    } else {
      let {items, pageBean} = results
      if (items === undefined) {
        message = `response.results.items is undefined, url:${url}`
      }
      /* if (pageBean === undefined) {
        message = `response.results.pageBean is undefined, url:${url}`
      } */
    }
  } else if (type === 'create') {
    let {results} = res
    if (results === undefined) {
      message = `response.results is undefined, url:${url}`
    } else {
      let {id} = results
      if (id === undefined) {
        message = `response.results.id is undefined, url:${url}`
      }
    }
  } else if (type === 'single') {
    let {results} = res
    if (results === undefined) {
      message = `response.results is undefined, url:${url}`
    }
  }

  return message
}
