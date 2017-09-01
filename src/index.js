import createActions from './actions'
import mutations from './mutations'
import * as types from './types'
import * as mods from './mods'

let handle = {
	// actions,
	mutations,
	types,
	createActions,
	mods,
	/* config:function(options){
		console.log(options)
		this.actions = createActions(options)
		// this.http = options.http;
	}, */
	// http:null,
	/* abc: function(){
		// console.log( handle.http+5 )
		return this.http+5
	} */
};

export default handle