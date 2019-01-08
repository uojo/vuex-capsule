import checkMutationName from './checkMutationName';
// import {getStatePath} from './entity'
import * as Types from '../types';
// import log from './log'

var handle = function handle(options) {
  return function (_ref) {
    var form = _ref.form,
        entityInfo = _ref.entityInfo,
        operate = _ref.operate;

    var rlt = void 0;
    var _entityInfo$data = entityInfo.data,
        api = _entityInfo$data.api,
        stateOperatePath = _entityInfo$data.stateOperatePath;
    // log({stateBasePath, stateOperatePath, stateOperateDataPath})
    // const statePath = getStatePath(name, attribute, operate)
    // log(statePath.operatePath)

    var mutationPrefix = [form].concat(stateOperatePath);
    // log(mutationPrefix)
    var convertMutationName = function convertMutationName() {
      // log(arguments)
      return mutationPrefix.concat(Array.from(arguments));
    };
    // log(mutationPrefix.join('/'))
    // log(api.url)
    switch (form) {
      case 'collection':
        if (operate === 'index') {
          rlt = checkMutationName(options, true, {
            progress: convertMutationName('progress'),
            received: convertMutationName('received'),
            error: convertMutationName('error')
          }, {
            progress: Types.M_LIST_LOADING,
            received: Types.M_LIST_RECEIVED,
            error: Types.M_LIST_ERROR
          });
        } else {
          // send
          rlt = checkMutationName(options, true, {
            error: convertMutationName('send', 'error'),
            done: convertMutationName('done')
          }, {
            error: Types.M_SEND_ERROR,
            done: Types.M_MOD_SET
          });
        }

        break;
      case 'single':

        if (operate === 'reset') {
          rlt = checkMutationName(options, true, {
            restDone: convertMutationName('done')
          }, {
            restDone: Types.M_MOD_RESET
          });
        } else {
          if (api.url) {
            if (['index', 'read'].includes(operate)) {
              rlt = checkMutationName(options, true, {
                received: convertMutationName('received')
              }, {
                received: Types.M_MOD_RECEIVED
              });
            } else {
              // send
              rlt = checkMutationName(options, true, {
                error: convertMutationName('send', 'error'),
                done: convertMutationName('done')
              }, {
                error: Types.M_SEND_ERROR,
                done: Types.M_MOD_SET
              });
            }
          } else {
            if (operate === 'update') {
              rlt = checkMutationName(options, true, {
                localUpdateDone: convertMutationName('done')
              }, {
                localUpdateDone: Types.M_MOD_SET
              });
            }
          }
        }

        break;
    }

    return rlt;
  };
};

// mutation 别名
export default handle;