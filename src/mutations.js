import deepAssign from 'deep-assign'
import * as Types from './types'
import {isPlainObject,isArray} from 'lodash'
import utils from './utils'

export default {
	
	// 通用 -- start
  [Types.M_LIST_LOADING]: (state, {path,append}) => {
		// console.log(state,path)
    let rlt = {
      itemsStep:'loading',
    };
		if(!append){
			rlt.items = []
			rlt.itemsIndex = []
		}
		let dd = eval(`state.${path}`)
    utils.fn.objAssign(dd,rlt)
    // console.log(dd,rlt)
  },
  [Types.M_LIST_RECEIVED]: (state, {path,response,payload,setBefore, setAfter, indexFieldName, append}) => {
		let {items,pageBean} = response.results
    let rlt = {
      itemsStep:'onload',
      items,
      pageBean,
    };
		// console.log(rlt);
		
		if(setBefore){
			rlt = setBefore(rlt, response, payload);
		}
		// console.log("M_LIST_RECEIVED", path, rlt);
		let dd = eval(`state.${path}`)
		
		if(append && indexFieldName){
			let itemsObj={};
			items.map(n=>{
				itemsObj[n[indexFieldName]] = n;
			});
			// console.log("res.itemsObj",itemsObj)
			
			// 遍历原数据
			let newItems = []
			dd.items.map(n=>{
				let td = itemsObj[n[indexFieldName]];
				// console.log(n, td)
				if( td ){
					// 与本地数据重复
					newItems.push(utils.fn.objAssign(n, td));
					delete itemsObj[n[indexFieldName]];
				}else{
					newItems.push(n);
				}
			})
			
			for(let k in itemsObj){
				newItems.push( itemsObj[k] );
			}
			rlt.items = newItems;
			// console.log(path, newItems)
		}
		
		// console.log(dd)
		utils.fn.objAssign(dd, rlt);
		
    setAfter && setAfter(response,payload)

  },
  [Types.M_LIST_ERROR]: (state, {path,message}) => {
    // Object.assign(state, payload)
    let rlt = {
      itemsStep:'error',
      errorMessage: message
    };
		let dd = eval(`state.${path}`)
    utils.fn.objAssign(dd,rlt)
    
  },
	
  [Types.M_MOD_LOADING]: (state, stepField) => {
		stepField && eval(`state.${stepField}="loading"`)
		
  },
  [Types.M_MOD_RECEIVED]: (state, payload) => {
		let {path, stepField, response, setBefore} = payload;
    // console.log(state, payload)
		stepField && eval(`state.${stepField}="onload"`)
    
    setBefore && (response = setBefore(response))
		
		let dd = path?eval(`state.${path}`):null
    // console.log(dd, response)
		
		if(dd && response){
			utils.fn.objAssign(dd, response.results )
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
		utils.fn.mapDeep(rlt,(val,key,pt)=>{
			if( val instanceof Array ){
				pt[key]=[];
				return false;
			}
			pt[key] = ''
		});
		
    utils.fn.objAssign( dd, Object.assign(rlt,data) )
    
  },
  [Types.M_MOD_SET]: (state, tasks) => {
    
		if( !isArray(tasks) && isPlainObject(tasks) ){
			tasks = [tasks]
		}
		// console.warn("M_MOD_SET", tasks)
		tasks.map( task=>{
			
			let {
				path,operate,value,response,payload,
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
				value = value(dd, response,payload)
			}
			
			if( operate==='match.set' ){
				dd.map(el=>{
					// console.log(el,el[matchField],matchValue)
					if(el[matchField]===matchValue && matchCallback){
						return matchCallback(el,response,payload);
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
				
			}else if(typeof value !="undefined"){
				
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
