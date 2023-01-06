const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEmail(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Please enter your email';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Invalid Email';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
