# Vuex-capsule

依赖 Vuex2，简化编码。

## Actions
	dispatch(Types.A_MOD_REQUEST, {
		path:"",
		api:"",
		payload:{},
		setBefore(res){
			console.log(res)
			return res;
		},
		stepField:""
	})
	
	dispatch(Types.A_LIST_REQUEST, {
		path:"",
		api:"",
		payload:{},
		setBefore(td,res){
			console.log(td,res)
			return td;
		},
		setAfter(res){
			console.log(res)
		}
	})

	dispatch(Types.A_SUBMIT_REQUEST,{
		api:"", //+
		payload:{}, //?
		back:false, //?
		redirectUrl:"", //?
		stepField:"", //?
		messageField:"", //?
		requestBeforeActions:[{async:true,name:"",payload:null,callback(actionResponse,payload){}}], //? 在标记请求开始之后，执行请求之前，需要执行 actions 队列
		requestAfterActions:[{async:true,name:"",payload:null,callback(actionResponse,payload){}}], //? 在执行请求之后，callback 之前，需要执行 actions 队列
		callback:{} //? 参看 Types.M_MOD_SET 的参数
	})

## Muations

	store.commit(Types.M_MOD_RESET,{
		path:"",
		data:{}
	})
	
	// 值可以是数组或对象
	commit(Types.M_MOD_SET,{
		path:"a.b.items",
		operate:"match.set|match.del|set|push",
		depend:()=>{}, //? 返回 false 终止执行该任务

		// set|push
		value:"",
		value(dd,response){
			console.log(dd,response);
			return dd;
		},
		
		// match.set|match.del
		matchField:"",
		matchValue:"",
		matchCallback:(td)=>{
			console.log(td)
			return td;
		}
	});
	
## ChangeLog
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