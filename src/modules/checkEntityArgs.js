import {getStatePath} from './entity'
import entityApi from './entityApi'
import statePathError from './statePathError'
// import log from './log'
/**
   * 判断参数合法性
   * @param {string} name 实体名称
   */
export default ({state, form}, {name = '', attribute = '', operate = 'index', payload}, {apiMap, apiRestful}) => {
  let message = ''
  if (!name) {
    message = '实体名称不能为空'
  } else if (!apiMap) {
    message = 'apiMap 错误'
  } else {
    const statePath = getStatePath(name, attribute, operate)
    // log(statePath)
    const stateBasePath = statePath.basePath
    // eq ~:[name,attribute]
    let stateOperatePath, stateOperateBasePath, stateOperateDataPath
    // eq ~:[name,attribute,operate]
    if (form === 'collection') {
      stateOperatePath = statePath.operatePath
      // eq [~,{index|create|delete|update}]
      stateOperateBasePath = stateBasePath.concat(['index'])
      // eq collection:[~,index]
      stateOperateDataPath = stateOperateBasePath.concat(['items'])
      // eq collection:[~,index,items];
    } else {
      stateOperatePath = statePath.operatePath
      // eq [~,{reset|create|delete|update|read}]
      stateOperateBasePath = (operate === 'reset' ? stateBasePath.concat('read') : stateOperatePath)
      // eq [~,{create|delete|update|read}]
      stateOperateDataPath = stateOperateBasePath.concat('data')
      // eq [~,operate,data]
    }
    // log({stateOperateBasePath})
    // log({form, statePath, stateBasePath, stateOperatePath, stateOperateBasePath, stateOperateDataPath})
    let tempResult
    tempResult = statePathError(state, stateBasePath)
    if (tempResult) {
      // 实体 state 操作的基本 path
      message = `[base] ${tempResult.message}`
    } else {
      const stateBasePath = statePath.basePath
      let checkStatePath
      // 检查 operatePath
      if (form === 'single') {
        tempResult = statePathError(state, stateOperateBasePath)
        if (tempResult) {
          message = `[operate] ${tempResult.message}`
          return {message}
        }
      }

      // 检查 operateDataPath
      tempResult = statePathError(state, stateOperateDataPath)
      if (tempResult) {
        message = `[operate.data] ${tempResult.message}`
        return {message}
      }

      // 检查 stepPath
      checkStatePath = form === 'collection' ? stateBasePath.concat(['index', 'step']) : stateOperateBasePath.concat('step')
      tempResult = statePathError(state, checkStatePath)
      if (tempResult) {
        message = tempResult.message
        return {message}
      }

      // 获取实体的 api
      let api = entityApi({name, operate, attribute, payload, form, apiMap, apiRestful})
      // 检查实体的 api
      if (!api.url) {
        if (form === 'collection' || (form === 'single' && !['update', 'reset'].includes(operate))) {
          message = `实体 "${JSON.stringify({name, attribute, operate})}" 的 API 不能为空`
          return {message}
        }
      }

      let data = {name, attribute, operate, payload, api, stateBasePath, stateOperatePath, stateOperateBasePath, stateOperateDataPath}
      return {data}
    }
    // log({statePath})
  }

  return {message}
}
