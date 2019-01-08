// action
// export const ENTITY = 'entity' // rename: entityOperate
// export const ENTITY_LIST = 'entity/collection' // rename: collectionOperate
// action
export var STEP_SET = 'step/set';
// mutation
export var STEP_SET_DONE = 'step/set/done';
// action
// export const LIST_REQUEST = 'entity/collection/request'  => rename: collectionSync
// mutation
export var M_LIST_LOADING = 'entity/collection/request/loading';
export var M_LIST_RECEIVED = 'entity/collection/request/received';
export var M_LIST_ERROR = 'entity/collection/request/error';
// action
// export const MOD_REQUEST = 'entity/get/request'  => rename: entitySync
// mutation
export var M_MOD_SET = 'entity/set';
export var M_MOD_RESET = 'entity/reset';
export var M_MOD_RECEIVED = 'entity/get/received';
// action
// export const SEND_REQUEST = 'entity/send/request'  => rename: entitySend
// mutation
export var M_SEND_RECEIVED = 'entity/send/request/received';
export var M_SEND_ERROR = 'entity/send/request/error';