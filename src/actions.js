import * as Types from './types'

export default ({request})=>{
	// console.log(request)
	let handle ={
		[Types.A_LIST_REQUEST]: ({commit, state, dispatch}, {path,api,payload,indexFieldName='id',append=false,setBefore,setAfter}) => {
			// console.log(path,api,payload)
			commit(Types.M_LIST_LOADING, {path, append})
			request('get', api, payload, response => {
				commit(Types.M_LIST_RECEIVED, {
					path,
					response,
					setBefore,
					setAfter,
					indexFieldName,
					append
				})
			}, ({message}) => {
				commit(Types.M_LIST_ERROR, { path, message })
			})
		},

		[Types.A_MOD_REQUEST]: ({commit, state, dispatch}, {api, path="",stepField="",errorField="", payload,setBefore}) => {
			// console.log(api,path,payload)
			commit(Types.M_MOD_LOADING, stepField)
			request('get', api, payload, res => {
				commit(Types.M_MOD_RECEIVED, {
					path,
					stepField,
					res,
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
						payload:null,
						async:true,
						callback:null
					},requestBeforeActions[i]), trlt;
					let tfn = ()=> dispatch( el.name, (typeof el.payload==='function'?el.payload():el.payload) )
					if( el.async ){
						tfn()
					}else{
						trlt = await tfn()
					}

					el.callback && el.callback(trlt,payload)
					i++
				}
			}

			let rlts;
			await request(method, api, payload, res => {
				requestSuccess && requestSuccess(res);
				rlts = res;
				// console.log(res,success,message)
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
							},requestAfterActions[i]), trlt;
							let tfn = ()=> dispatch(el.name, (typeof el.payload==='function'?el.payload():el.payload) )
							if( el.async ){
								tfn()
							}else{
								trlt = await tfn()
							}

							el.callback && el.callback(trlt,payload)
							i++
						}
					})()
				}
				
				
				
				// 执行回调
				if(callback){
					if(typeof callback==='object'){
						callback.response = res;
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
			}, err =>{
				requestError && requestError(err);
				
			  let message = err.message;
			  stepField && commit(Types.M_SEND_STEP,{stepField,errorField,message,value:"error"})
      })

			return rlts;
		},
	}
	return handle;
}
