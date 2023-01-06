const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.nickname = !isEmpty(data.nickname) ? data.nickname : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (Validator.isEmpty(data.nickname)) {
    errors.nickname = 'Please enter your nickname';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Please enter your email';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Invalid Email';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Please enter your password';
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
