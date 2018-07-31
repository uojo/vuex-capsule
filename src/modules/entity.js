// import log from './log'
import deepCopy from 'deep-copy'

export const createEntity = (type = 'single', options = {}) => {
  let rlt
  if (/single|other/.test(type)) {
    rlt = {
      errorMessage: '',
      step: '',
      operate: ''
    }
    rlt.data = options.data ? deepCopy(options.data) : {}
  } else if (type === 'collection') {
    rlt = {
      items: [],
      pageBean: {totalCount: 0, pageSize: 10, pageNo: 1},
      errorMessage: '',
      step: '',
      operate: ''
    }
  }

  rlt.type = type
  rlt.source = 'capsule'

  return rlt
}

export const getStatePath = (name, attribute, operate) => {
  // log({name, attribute, operate})
  let basePath = [name]
  if (attribute) {
    basePath.push(attribute)
  }
  let operatePath = basePath.concat(operate)
  return {basePath, operatePath}
}
