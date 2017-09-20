import * as Types from './types'

export default ({http})=>{
	// console.log(http)
	let handle ={
		[Types.A_LIST_REQUEST]: ({commit, state, dispatch}, {path,api,payload,setBefore,setAfter}) => {
			// console.log(path,api,payload)
			commit(Types.M_LIST_LOADING, path)
			http.req('get', api, payload, response => {
				commit(Types.M_LIST_RECEIVED, {
					path,
					response,
					setBefore,
					setAfter
				})
			}, ({message}) => {
				commit(Types.M_LIST_ERROR, { path, message })
			})
		},

		[Types.A_MOD_REQUEST]: ({commit, state, dispatch}, {api,path="",stepField="",errorField="", payload,setBefore}) => {
			// console.log(api,path,payload)
			commit(Types.M_MOD_LOADING, stepField)
			http.req('get',api, payload, res => {
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

		[Types.A_SUBMIT_REQUEST]: async ({commit, state, dispatch}, data={}) => {
			// console.log(payload)
			const {api,payload={},redirectUrl,back,requestBeforeActions=[],requestAfterActions=[],callback,stepField="",errorField=""} = data;

			stepField && commit(Types.M_SUBMIT_STEP,{stepField,value:"submitting"})

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
			await http.req('post', api, payload, res => {
				rlts = res;
				// console.log(res,success,message)
        stepField && commit(Types.M_SUBMIT_STEP,{stepField,value:"submitted"})

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
			  let message = err.message;
			  stepField && commit(Types.M_SUBMIT_STEP,{stepField,errorField,message,value:"error"})
      })

			return rlts;
		},
	}
	return handle;
}
