import deepAssign from 'deep-assign'
import * as Types from './types'
import {isObject,isPlainObject,isArray} from 'lodash'

const objAssign = (dd,sd)=>{
	// console.log(dd,sd)
	if(dd){
		Object.assign(dd,sd)
		// deepAssign(dd,sd)
	}else{
		console.warn('目标对象非法')
	}

}

export default {
	
	// 通用 -- start
  [Types.M_LIST_LOADING]: (state, path) => {
		// console.log(state,path)
    let rlt = {
      itemsStep:'loading',
      items:[]
    };
		let dd = eval(`state.${path}`)
    objAssign(dd,rlt)
    
  },
  [Types.M_LIST_RECEIVED]: (state, {path,response,setBefore,setAfter}) => {
    // Object.assign(state, payload)
		let {items,pageBean} = response
    let rlt = {
      itemsStep:'onload',
      items,
      pageBean
    };
		
		if(setBefore){
			rlt = setBefore(rlt,response);
		}
		// console.log("M_LIST_RECEIVED", path, rlt);
		let dd = eval(`state.${path}`)
		
    objAssign(dd, rlt);

    setAfter && setAfter(response)

  },
  [Types.M_LIST_ERROR]: (state, {path,message}) => {
    // Object.assign(state, payload)
    let rlt = {
      itemsStep:'error',
      errorMessage: message
    };
		let dd = eval(`state.${path}`)
    objAssign(dd,rlt)
    
  },
	
  [Types.M_MOD_LOADING]: (state, stepField) => {
		stepField && eval(`state.${stepField}="loading"`)
		
  },
  [Types.M_MOD_RECEIVED]: (state, {path, stepField, res, setBefore}) => {
    // console.log(state, res)
		stepField && eval(`state.${stepField}="onload"`)
    
    setBefore && (res = setBefore(res))
		
		let dd = path?eval(`state.${path}`):null
    // console.log(dd, res)
		
		if(dd && res){
			objAssign(dd, res )
		}
    
  },
  [Types.M_MOD_ERROR]: (state, {stepField,errorField,message}) => {

		stepField && eval(`state.${stepField}="error"`)
		errorField && eval(`state.${errorField}=message`)
    
  },
  [Types.M_MOD_RESET]: (state, {path,data}) => {
    // console.warn("M_MOD_RESET")
		if(!path)return;
		let dd = eval(`state.${path}`)
    let rlt = Object.assign({},dd);
    // console.log(rlt)
    for(var key in rlt){
      rlt[key]=''
    }
		
    objAssign( dd, Object.assign(rlt,data) )
    
  },
  [Types.M_MOD_SET]: (state, tasks) => {
    
		if( !isArray(tasks) && isPlainObject(tasks) ){
			tasks = [tasks]
		}
		// console.warn("M_MOD_SET", tasks)
		tasks.map( task=>{
			
			let {
				path,operate,value,response, 
				matchValue,matchField,matchCallback,
				depend
			} = task;
			
			if(!path)return;
			
			let goon;
			depend && (goon=depend())
			if(!goon===false)return;
			
			let dd = eval(`state.${path}`);
			let rlt;
			
			if(typeof value === 'function'){
				value = value(dd,response)
			}
			
			if( operate==='match.set' ){
				dd.map(el=>{
					// console.log(el,el[matchField],matchValue)
					if(el[matchField]===matchValue && matchCallback){
						return matchCallback(el);
					}else{
						return el;
					}
					
				})

			}else if(operate==='match.del'){
				rlt = eval(`state.${path}`).filter( (el,i)=>{
					// console.log(el)
					if(el[matchField]!==matchValue){
						return el;
					}
				});
				
				eval(`state.${path}=rlt`);
				
			}else if(value){
				
				if( operate==='push' ){
					eval(`state.${path}.push(value)`)
				}else if( operate==='set'){
					eval(`state.${path}=value`);
				}
				
			}
			
		});
    
  },
  [Types.M_SEND_STEP]: (state, {stepField,errorField,message,value}) => {
    stepField && eval(`state.${stepField}=value`)
    errorField && message && eval(`state.${errorField}=message`)
  }
	
	// 通用 -- end
}
