// 建议使用 createEntity ，待删除
export const list = {
	items:[],
	pageBean:{totalCount:0,pageSize:10,pageNo:1},
	errorMessage:"",
	itemsStep:"",
}

export const createEntity = (type = 'single', options = {}) => {
  let rlt
  if (/single|other/.test(type)) {
    rlt = {
      errorMessage: '',
      step: ''
    }
    rlt.data = options.data || {}
  } else if (type === 'list') {
    rlt = {
      items: [],
      pageBean: {totalCount: 0, pageSize: 10, pageNo: 1},
      errorMessage: '',
      itemsStep: ''
    }
  }

  rlt.type = type
  rlt.source = 'capsule'

  return rlt
}