import axios from 'axios'
import VuexCapsule from 'vuex-capsule'

export default {
  req: function(method, url = '', data = {}, success = null, error = null) {
    let payload = method=='get'?{params:data}:data;

    axios[method](url, payload)
    .then(response=>{
      // 指定接口结构
      let res = Object.assign({
        success:true,
        results:{
          
        }
      },response);
      // 执行回调
      success(res);
    })
    .catch(error=>{
      // 指定接口结构
      let err = Object.assign({
        success:false,
        message:""
      },error);
      // 执行回调
      error(err);
    })

  }
}
