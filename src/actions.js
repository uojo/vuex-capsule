import * as Types from './types'

export default ({request})=>{
	// console.log(request)
	let handle = {
		[Types.A_LIST_REQUEST]: async ({commit, state, dispatch}, {path,api,payload,indexFieldName='id',append=false,setBefore,setAfter}) => {
			// return new Promise( async (resolve, reject)=>{
				// console.log(path,api,payload,append)
				commit(Types.M_LIST_LOADING, {path, append})
				
				const complete_cb = (response)=>{
					const {success,message} = response;
					if(success){
						commit(Types.M_LIST_RECEIVED, {
							path,
							response,payload,
							setBefore,
							setAfter,
							indexFieldName,
							append
						})
					}else{
						commit(Types.M_LIST_ERROR, { path, message })
					}
					// resolve(response)
				}
				
				let res_promise
				try{
					res_promise = request('get', api, payload);
					res_promise.then(e=>{
						complete_cb(e)
					},e=>{
						complete_cb(e)
					})
				}catch(e){
					console.error(e)
				}
				return res_promise;
			// })

		},

		[Types.A_MOD_REQUEST]: ({commit, state, dispatch}, {api, path="",stepField="",errorField="", payload,setBefore}) => {
			// console.log(api,path,payload)
			commit(Types.M_MOD_LOADING, stepField)
			request('get', api, payload, response => {
				// console.log(response)
				commit(Types.M_MOD_RECEIVED, {
					path,
					stepField,
					response,
					setBefore
				})
			}, ({message}) => {
				commit(Types.M_MOD_ERROR, { stepField, errorField, message })
			})
		},

		[Types.A_SEND_REQUEST]: async ({commit, state, dispatch}, data={}) => {
			// console.log("data",data)
			// console.log("method",method)
			const {api,payload={},redirectUrl,back,requestBeforeActions=[],requestAfterActions=[],requestSuccess,requestError,callback,stepField="",errorField="", method="post"} = data;

			stepField && commit(Types.M_SEND_STEP,{stepField,value:"loading"})
			if(requestBeforeActions.length){
				let i = 0;
				while(i<requestBeforeActions.length){
					let el = Object.assign({
						name:"",
						payload:{},
						async:true,
						callback:null
					}, requestBeforeActions[i]), rlt_await;
					let _payload = (typeof el.payload==='function')?el.payload():el.payload
					if( el.async ){
						dispatch( el.name, _payload )
					}else{
						rlt_await = await dispatch( el.name, _payload );
						if(rlt_await && !rlt_await.then ){
							el.callback && el.callback(rlt_await, payload);
						}
						
					}
					i++;
				}
			}
			
			return new Promise( async (reslove,reject)=>{
				
				const reqArgs = [method, api, payload, null, err =>{
					requestError && requestError(err);
					
					let message = err.message;
					stepField && commit(Types.M_SEND_STEP,{stepField,errorField,message,value:"error"})
				}];
				// console.log(reqArgs)
				let res_promise = request.apply(this,reqArgs);
				// console.log(res_promise)
				
				const complete_cb = (response)=>{
					if(response){
						requestSuccess && requestSuccess(response);
						// console.log(response,success,message)
						stepField && commit(Types.M_SEND_STEP,{stepField,value:"onload"})

						// console.log(requestAfterActions)
						if(requestAfterActions.length){
							(async ()=>{
								let i = 0;
								while(i<requestAfterActions.length){
									let el = Object.assign({
										name:"",
										payload:null,
										async:true,
										callback:null
									},requestAfterActions[i]), rlt_await;
									let tfn = ()=> dispatch(el.name, (typeof el.payload==='function'?el.payload():el.payload) )
									if( el.async ){
										tfn()
									}else{
										rlt_await = await dispatch( el.name, _payload );
										if(rlt_await && !rlt_await.then ){
											el.callback && el.callback(rlt_await, payload);
										}
									}
									i++
								}
							})()
						}
						
						// 执行回调
						if(callback){
							if(typeof callback==='object'){
								callback.response = response;
								callback.payload = payload;
								commit(Types.M_MOD_SET, callback)
							}
						}

						back && setTimeout(()=>{
							if(typeof back==='string'){
								location.hash=back;
							}else{
								window.history.go(-1)
							}

						},500)
						redirectUrl && (window.location.hash = redirectUrl)
					}
					reslove(response);
				}
				
				res_promise.then(e=>{
					complete_cb(e)
				},e=>{
					complete_cb(e)
				})
				
			})
			
		},
	}
	return handle;
}
