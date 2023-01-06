const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateChangePwInput(data) {
  let errors = {};

  data.oldPw = !isEmpty(data.oldPw) ? data.oldPw : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (Validator.isEmpty(data.oldPw)) {
    errors.oldPw = 'Please enter current password';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field required';
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password2) && !Validator.isEmpty(data.password)) {
    errors.password2 = 'Please confirm password';
  } else if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Password must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
