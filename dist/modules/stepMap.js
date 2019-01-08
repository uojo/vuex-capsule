exports.operatingStepMap = {
  index: 'loading',
  read: 'loading',
  create: 'creating',
  update: 'updating',
  delete: 'deleting'
};
exports.operatedStepMap = {
  error: 'error',
  reset: 'reset',
  index: 'received',
  read: 'received',
  create: 'created',
  update: 'updated',
  delete: 'deleted'
};

exports.allStep = ['reset', 'error', 'progress', 'done'];