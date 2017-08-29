const babelCore = require('babel-core');
/* babelCore.transformFile("index.js",{},function(err,result){
	console.log(err,result.code)
}) */

const handle = babelCore.transformFileSync("index.js")
console.log(handle.code)
