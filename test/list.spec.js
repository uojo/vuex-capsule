import sinon from 'sinon'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import vuexCapsule from '../src/'
// import data from './data'
// import log from './log'

const localVue = createLocalVue()
localVue.use(Vuex)
const Types = vuexCapsule.types

describe('vuex action', () => {
  const apiMap = {apple: 'xxx'}

  let store, apple, request

  beforeEach(() => {
    request = sinon.stub()
    apple = {
      state: {
        // 保留字段
        index: {
          ...vuexCapsule.createEntity('list')
        },
        // 自定义属性
        taste: {
          index: {
            ...vuexCapsule.createEntity('list')
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

  const normalScene = ({operate, attribute, done}) => {
    let stateBase = attribute ? apple.state[attribute] : apple.state
    // 模拟初始数据
    let item
    if (['update', 'delete'].includes(operate)) {
      item = {id: 2, name: 'tom'}
      stateBase.index.items.push(item)
    }

    // 定义返回
    let responseMap = {
      index: require('./files/index.json'),
      create: {'success': true, 'results': {'id': 2}},
      delete: {'success': true},
      update: {'success': true}
    }
    let res = responseMap[operate]
    request.returns(Promise.resolve(res))

    // 验证初始数据
    let itemsInitLength = ['update', 'delete'].includes(operate) ? 1 : 0
    expect(stateBase.index.items.length).toEqual(itemsInitLength)
    // 初始状态
    expect(stateBase.index.step).toEqual('')

    let payloadMap = {
      index: {},
      create: {'name': 'tom'},
      delete: {'id': 2},
      update: {'id': 2, name: 'jone'}
    }
    let payload = payloadMap[operate]

    store.dispatch(Types.ENTITY_LIST, {name: 'apple', operate, attribute, payload}).then((e) => {
      if (operate === 'index') {
      // 列表数据
        expect(stateBase.index.items).toEqual(res.results.items)
        // 分页数据
        expect(stateBase.index.pageBean).toEqual(res.results.pageBean)
      } else if (operate === 'create') {
        // 预期新记录
        let addOne = Object.assign({}, res.results, payload)
        // 原集合中包含新记录
        expect(stateBase.index.items).toContainEqual(addOne)
      } else if (operate === 'delete') {
        expect(stateBase.index.items).not.toContainEqual(item)
      } else if (operate === 'update') {
        // 集合数据中不存在新记录
        expect(stateBase.index.items).not.toContainEqual(item)
        // 集合数据中包含已更新的数据
        expect(stateBase.index.items).toContainEqual(payload)
      }

      // 状态
      expect(stateBase.index.step).toEqual('done')
      done()
    })
    // 正在处理
    expect(stateBase.index.step).toEqual('progress')
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
    expect(request.lastCall.args).toEqual(expect.arrayContaining([method, url, payload]))
  }

  // entity

  it('dispatch ENTITY_LIST entity index', (done) => {
    let operate = 'index'
    normalScene({operate, done})
  })

  it('dispatch ENTITY_LIST entity create', (done) => {
    let operate = 'create'
    normalScene({operate, done})
  })

  it('dispatch ENTITY_LIST entity delete', (done) => {
    let operate = 'delete'
    normalScene({operate, done})
  })

  it('dispatch ENTITY_LIST entity update', (done) => {
    let operate = 'update'
    normalScene({operate, done})
  })
  // entity/attribute

  it('dispatch ENTITY_LIST entity/attribute index', (done) => {
    let operate = 'index'
    normalScene({operate, attribute: 'taste', done})
  })

  it('dispatch ENTITY_LIST entity/attribute create', (done) => {
    let operate = 'create'
    normalScene({operate, attribute: 'taste', done})
  })

  it('dispatch ENTITY_LIST entity/attribute delete', (done) => {
    let operate = 'delete'
    normalScene({operate, attribute: 'taste', done})
  })

  it('dispatch ENTITY_LIST entity/attribute update', (done) => {
    let operate = 'update'
    normalScene({operate, attribute: 'taste', done})
  })
})
