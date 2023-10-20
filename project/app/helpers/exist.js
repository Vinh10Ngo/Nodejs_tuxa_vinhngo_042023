
let hasError = (errors, paramName, errorMsg) => {
  return errors.some(error => error.param === paramName && error.msg === errorMsg);
}
module.exports = {
  hasError, 
}
