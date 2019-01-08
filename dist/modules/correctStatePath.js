export default (function (val) {
  return Array.isArray(val) ? val.join('.') : val;
});