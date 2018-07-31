# vuex-capsule

依赖 Vuex2，简化 vuex 在项目中的应用编码，抽象 vuex 中常用逻辑，定义了通用的 mutations、actions。

## 安装
```javascript
npm i --save vuex-capsule
```

## 准备

### 接口的定义
使用的接口规范必须按照如下结构返回，可参考[接口规则](https://github.com/uojo/Interface-Specfication)：
```javaScript
// 单一实体
{
  "success":true,
  "results":{
    "id":1,
    "name":"apple"
  }
}
// 集合实体
{
  "success":true,
  "results":{
    "items":[{"id":1,"name":"apple"}]
  }
}
// 错误时
{
  "success":false,
  "message":"error messages ..."
}
```
关键在于字段 `success` 和 `message`，如果接口不能提供，那么请通过传入的 `request` 方法自行转化。


## 部署
因为基于 Vuex，所以需要在您的项目中导入包内预置数据

### Request
包内需要使用请求方法，所以请传入，示例如下。

utils/request.js
```javascript
import axios from 'axios'

export default {
  req: function (method, url = '', data = {}, success = null, error = null) {
    let payload = method === 'get' ? {params: data} : data

    axios[method](url, payload)
      .then(response => {
        // 指定接口结构
        let res = Object.assign({
          success: true,
          results: {}
        }, response)
        // 执行回调
        success(res)
      })
      .catch(error => {
        // 指定接口结构
        let err = Object.assign({
          success: false,
          message: ''
        }, error)
        // 执行回调
        error(err)
      })
  }
}
```
以上代码可修改，关键点在于传入参数的限定。

### Store
将初始化的 store 参数传入。

utils/request.js
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import vuexCapsule from 'vuex-capsule'
import sysRequest from 'utils/request'

Vue.use(Vuex)

// 常规 store 配置参数
let options = {
  modules:{
    // 示例代码
    entityA:{
      state:{
        index: {
          ...vuexCapsule.createEntity('list')
        },
        create: {
          ...vuexCapsule.createEntity('single')
        },
        delete: {
          ...vuexCapsule.createEntity('single')
        },
        update: {
          ...vuexCapsule.createEntity('single')
        },
        read: {
          ...vuexCapsule.createEntity('single')
        }
      }
    },
    entityB:{
      state:{
        index: {
          ...vuexCapsule.createEntity('single')
        }
      }
    }
  },
  state,
  getters,
  mutations,
  actions
} 

// 接口是否使用 restful 规则
let apiRestful = true

const store = new Vuex.Store(vuexCapsule.init({
  "storeOptions": options,
  "request": sysRequest ,

  // 面向实体操作时必传参数
  "apiMap": apiRestful? {
    "entityA": '/data/a' // 增删改查均使用同一个 url
  }:{
    "entityA": {
      "index":'/data/a', // 默认返回数据
      "create":'/data/a/create', // 增
      "delete":'/data/a/delete', // 删
      "update":'/data/a/update', // 改
      "read":'/data/a/read', // 查
    }
  },
  apiRestful
}))

vuexCapsule.setStore(store)

export default store
```

## 使用
经过代码的初始设置后，日常对于实体的操作代码如下所示。
```javascript
import {handleEntity} from 'vuex-capsule'

// 获取集合实体数据，operate = index
handleEntity({type: 'collection', name: 'entityA'})

// 获取单一实体数据，type=single, operate = index
handleEntity({name: 'entityB'})
```
name 的值与 state 内的名称一致，数据修改也将写入到 state.{entityName}.{operate} ,详细使用可参看测试代码。

### 参数说明

#### createEntity(type, data)
预制实体数据结构

type [String] , 可选值：collection、single

data [Object] , 自定义实体字段结构。

```javascript
//单一实体
let singleData = createEntity("single",{"data":{"a":1,"b":2}})
expect(singleData).to.equal({
  "errorMessage": "",
  "data": {"a":1, "b":2},
  "operate": "", // 可选值：index、create、delete、update、read
  "source": "capsule", // 固定值
  "type": "", // 可选值：collection、single
  "step": "", // 可选值：progress、done、error
})

// 集合实体
let collectionData = createEntity("collection")
expect(collectionData).to.equal({
  "items": [],
  "pageBean": {totalCount: 0, pageSize: 10, pageNo: 1},
  "errorMessage": '',
  "itemsStep": '', // 操作状态
  "operate": '' // 可选值：index、create、delete、update
})
```


#### handleEntity(options)
对 `state` 的实体进行操作

options [Object]

|字段|必填|类型|默认值|说明|
|---|---|---|---|---|
|name|true|string|-|实体名称，与 `state` 内定义名称一致
|type|false|string|single| 可选值：collection、single
|operate|false|string|index| 可选值：index、create、delete、update、read
|payload|false|object|-|请求时携带的数据对象
> 实体依据 operate 自动对请求时的 url、method 进行定义。


### 预置 Actions
即使不使用面向实体的操作，例如初始化时不传入 `apiMap`、`apiRestful`，以及不使用 `handleEntity` 方法。只要初始化成功后，store 将会预定义一些 `action` 如下。

以下示例注释说明规则： `+` 必填，`?` 可选

```javascript
dispatch("entitySync", {
  path:"", //+
  api:"", //+
  payload:{}, //?
  setBefore(res){ //?
    console.log(res)
    return res;
  },
  stepField:"" //?
})

dispatch("collectionSync", {
  path:"", //+
  api:"", //+
  payload:{}, //?
  append:false, //? 集合数据是否累加
  indexFieldName:"id", //? 集合数据中唯一的“索引”字段名称
  setBefore(state,response,payload){ //?
    console.log(state,response)
    return state;
  },
  setAfter(response,payload){ //?
    console.log(response,payload)
  }
})

dispatch("entitySend", {
  api:"", //+
  payload:{}, //?
  back:false, //?
  redirectUrl:"", //?
  stepField:"", //?
  messageField:"", //?
  requestSuccess:(res)=>{}, //? 发送ajax后，结果成功后执行的钩子
  requestError:(err)=>{}, //? 发送ajax后，结果失败后执行的钩子
  requestBeforeActions:[
    {
      async:true,
      name:"",
      payload:null,
      callback(actionResponse,payload){}
    }
  ], //? 在标记请求开始之后，执行请求之前，需要执行 actions 队列
  requestAfterActions:[
    {
      async:true,
      name:"",
      payload:null,
      callback(actionResponse,payload){}
    }
  ], //? 在执行请求之后，callback 之前，需要执行 actions 队列
  callback:{}, //? 参看 Types.M_MOD_SET 的参数
  method:"post" //? 默认值 post，支持的类型与 http.js 提供的 method 字段一致
})

// 实体数据重置
dispatch("entityReset", {
  path:"", //+
  data:{} //?
})

// 值可以是数组或对象
dispatch("entitySet", {
  path:"a.b.items", //+
  operate:"match.set|match.del|set|push", //?
  depend:()=>{}, //? 返回 false 终止执行该任务

  // 当 operate 等于 set|push 时，如下 value 必填
  value:"", //+
  value(state,response,payload){ //?
    console.log(state,response,payload);
    return state;
  },

  // 当 operate 等于  match.set|match.del 时，以下字段必填
  matchField:"", //+
  matchValue:"", //+
  matchCallback:(matchOne, response, payload)=>{ //?
    console.log(matchOne, response, payload)
    return matchOne;
  }
});
```

## ChangeLog
### 2.0.0
- 代码重构，围绕单一实体、集合实体简化使用与配置。
### 1.1.1
- mods.js 新增 createEntity 方法，用于生成默认实体结构
### 1.1.0
- 删除 package.json 内 module 字段
### 1.0.3
- fix M_MOD_SET 的 match.set 操作无效问题 
### 1.0.1
- 优化文档
### 1.0.0
- 优化代码，确保流程异步执行、回调参数补全以及bug修复
### 0.9.0
- 修改 package.json ，添加 files、module 字段
### 0.8.1
- fix bug
### 0.8.0
- A_LIST_REQUEST 新增参数：append，indexFieldName
### 0.7.2
- fix mapDeep 方法
### 0.7.1
- fix objAssign 方法
### 0.7.0
- A_SEND_REQUEST 新增参数：requestSuccess，requestError
- 修复 M_MOD_RESET ，当值为数组时，设置为 [], 其它设置为空字符串
### 0.6.0
- M_MOD_SET 中的 matchCallback 新增参数 response
### 0.5.1
- 修复 M_MOD_SET ，当值为 false 时
### 0.5.0
- 新增对 path 字段有效性判断
- 修复 method 字段
### 0.4.0
- 将常量名称 A_SUBMIT_REQUEST 变更为 A_SEND_REQUEST
- A_SEND_REQUEST 新增参数 method
- createActions 方法接收的参数字段变更
### 0.3.0
- 修复 A_SUBMIT_REQUEST 在请求错误时的处理
### 0.2.0
- 新增 mods 字段，放预定义数据模型
### 0.1.3
- 清理注释
### 0.1.2
- fix babel 编译
### 0.1.1
- 增加 babel 编译
### 0.1.0
- 第一版