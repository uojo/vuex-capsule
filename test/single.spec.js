import sinon from 'sinon'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import vuexCapsule from '../src/'
// import data from './data'
// import log from './log'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('vuex action', () => {
  const apiMap = {apple: 'xxx'}

  let store, apple, request

  beforeEach(() => {
    request = sinon.stub()
    apple = {
      state: {
        // 保留字段
        index: {
          ...vuexCapsule.createEntity('single')
        },
        update: {
          ...vuexCapsule.createEntity('single')
        },
        create: {
          ...vuexCapsule.createEntity('single')
        },
        delete: {
          ...vuexCapsule.createEntity('single')
        },
        read: {
          ...vuexCapsule.createEntity('single')
        },
        // 自定义属性
        taste: {
          index: {
            ...vuexCapsule.createEntity('single')
          },
          update: {
            ...vuexCapsule.createEntity('single')
          },
          create: {
            ...vuexCapsule.createEntity('single')
          },
          delete: {
            ...vuexCapsule.createEntity('single')
          },
          read: {
            ...vuexCapsule.createEntity('single')
          }
        }
      }
    }
    let storeOptions = {
      modules: {
        apple
      },
      state: {}
    }

    let ops1 = vuexCapsule.init({
      storeOptions,
      request,
      apiMap,
      apiRestful: true
    })
    store = new Vuex.Store(ops1)
  })

  afterEach(() => {
    request.reset()
  })

  it('state', () => {
    expect(store.state.apple).toBe(apple.state)
  })

  const resetScene = ({operate, attribute = ''}) => {
    let stateBase = attribute ? apple.state[attribute] : apple.state
    let stateOperateBase = stateBase['read']

    // 模拟初始数据
    let initData = {id: 2, name: 'tom'}
    stateOperateBase.data = initData

    // 验证初始数据
    expect(stateOperateBase.data).toEqual(initData)
    // 初始状态
    expect(stateOperateBase.step).toEqual('')
    // 开始新增操作
    store.dispatch('entityOperate', {name: 'apple', attribute, operate})
    expect(stateOperateBase.data).toEqual({id: '', name: ''})
    // 标记操作类型
    expect(stateOperateBase.operate).toEqual(operate)
    // 正在处理
    expect(stateOperateBase.step).toEqual('done')
  }

  const normalScene = ({operate, attribute = '', done}) => {
    let stateBase = attribute ? apple.state[attribute] : apple.state
    let stateOperateBase = stateBase[operate]
    // 定义返回
    let res = {'success': true, 'results': {'id': 2, 'name': 'tom'}}
    request.returns(Promise.resolve(res))
    // 验证初始数据
    expect(stateOperateBase.data).toEqual({})
    // 初始状态
    expect(stateOperateBase.step).toEqual('')
    // 提交数据
    let payload = res.results
    // 开始新增操作
    store.dispatch('entityOperate', {name: 'apple', attribute, operate, payload}).then((e) => {
      // log(e)
      // 数据没有改变
      if (['index', 'read'].includes(operate)) {
        expect(stateOperateBase.data).toEqual(res.results)
      } else {
        expect(stateOperateBase.data).toEqual({})
      }
      // 状态变更，创建成功
      expect(stateOperateBase.step).toEqual('done')
      done()
    })
    // 标记操作类型
    expect(stateOperateBase.operate).toEqual(operate)
    // 正在处理
    expect(stateOperateBase.step).toEqual('progress')
    // request 被执行
    let methodMap = {
      index: 'get',
      create: 'post',
      delete: 'delete',
      update: 'put',
      read: 'get'
      // reset:'',
    }
    let method = methodMap[operate]
    let urlBase = apiMap.apple + (attribute ? `/${attribute}` : '')
    let url = urlBase + (['update', 'delete', 'read'].includes(operate) ? `/${payload.id}` : '')
    // log({method, urlBase, url})
    expect(request.lastCall.args).toEqual(expect.arrayContaining([method, url, payload]))
  }
  // entity

  it('dispatch entity index', (done) => {
    let operate = 'index'
    normalScene({operate, done})
  })

  it('dispatch entity create', (done) => {
    let operate = 'create'
    normalScene({operate, done})
  })

  it('dispatch entity delete', (done) => {
    let operate = 'delete'
    normalScene({operate, done})
  })

  it('dispatch entity update', (done) => {
    let operate = 'update'
    normalScene({operate, done})
  })

  it('dispatch entity read', (done) => {
    let operate = 'read'
    normalScene({operate, done})
  })

  it('dispatch entity reset', () => {
    let operate = 'reset'
    resetScene({operate})
  })

  // entity/attribute

  it('dispatch entity/attribute index', (done) => {
    let operate = 'index'
    normalScene({operate, attribute: 'taste', done})
  })

  it('dispatch entity/attribute create', (done) => {
    let operate = 'create'
    normalScene({operate, attribute: 'taste', done})
  })

  it('dispatch entity/attribute delete', (done) => {
    let operate = 'delete'
    normalScene({operate, attribute: 'taste', done})
  })

  it('dispatch entity/attribute update', (done) => {
    let operate = 'update'
    normalScene({operate, attribute: 'taste', done})
  })

  it('dispatch entity/attribute read', (done) => {
    let operate = 'read'
    normalScene({operate, attribute: 'taste', done})
  })

  it('dispatch entity/attribute reset', () => {
    let operate = 'reset'
    resetScene({operate, attribute: 'taste'})
  })
})
