# Vuex-capsule

依赖 Vuex2，简化 vuex 在项目中的应用编码，抽象 vuex 中常用逻辑，定义了通用的 mutations、actions、types。

## 部署
因为基于 Vuex，所以需要在您的项目中导入

### state
在您项目的 state 编码处导入预定义实体
```
import vuexCapsule from 'vuex-capsule'
export default {
  mainList: {
    ...vuexCapsule.mods.list
  }
}
```
`mods.list`：列表实体

### actions
actions.js 导入
```
import vuexCapsule from 'vuex-capsule'
import sysHttp from 'utils/http'

export default {
  ...vuexCapsule.createActions({request: sysHttp.req})
}
```
自定义 utiles/http.js
```
import reqwest from 'reqwest'

function simple(method, url, data, success, error) {
  return new Promise((resole, reject) => {
    reqwest({
      url,
      data,
      method,
      success: function(rsp) {
        // 接口请求成功

      },
      error: function(err) {
        // 请求接口失败

      }
    })
  })
}

export default {
  req: function(method, url = '', data = {}, success = null, error = null) {
    return simple.apply(undefined, arguments)
  }
}
```
以上实现的 `http` 仅为示例，在自己项目内可自定义实现它。


### mutations

```
import vuexCapsule from 'vuex-capsule'

export default {
  ...vuexCapsule.mutations

}
```

### types
与项目内定义的常量集合合并

```
import vuexCapsule from 'vuex-capsule'
let handle = {

}
Object.assign(handle, vuexCapsule.types)
export default handle;
```

## 使用
预定义如下，供调用
> 以下示例内暴露的参数说明规则： `+` 必填，`?` 可选

### Actions
```
dispatch(Types.A_MOD_REQUEST, {
	path:"", //+
	api:"", //+
	payload:{}, //?
	setBefore(res){ //?
		console.log(res)
		return res;
	},
	stepField:"" //?
})

dispatch(Types.A_LIST_REQUEST, {
	path:"", //+
	api:"", //+
	payload:{}, //?
	append:false, //? 列表数据是否累加
	indexFieldName:"id", //? 列表数据中唯一的“索引”字段名称
	setBefore(state,response,payload){ //?
		console.log(state,response)
		return state;
	},
	setAfter(response,payload){ //?
		console.log(response,payload)
	}
})

dispatch(Types.A_SEND_REQUEST,{
	api:"", //+
	payload:{}, //?
	back:false, //?
	redirectUrl:"", //?
	stepField:"", //?
	messageField:"", //?
	requestSuccess:(res)=>{}, //? 发送ajax后，结果成功后执行的钩子
	requestError:(err)=>{}, //? 发送ajax后，结果失败后执行的钩子
	requestBeforeActions:[{async:true,name:"",payload:null,callback(actionResponse,payload){}}], //? 在标记请求开始之后，执行请求之前，需要执行 actions 队列
	requestAfterActions:[{async:true,name:"",payload:null,callback(actionResponse,payload){}}], //? 在执行请求之后，callback 之前，需要执行 actions 队列
	callback:{}, //? 参看 Types.M_MOD_SET 的参数
	method:"post" //?
})
```


### Muations

```
store.commit(Types.M_MOD_RESET,{
	path:"", //+
	data:{} //?
})

// 值可以是数组或对象
commit(Types.M_MOD_SET,{
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