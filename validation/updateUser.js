const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateUpdateInput(data) {
  let errors = {};

  data.nickname = !isEmpty(data.nickname) ? data.nickname : '';
  data.email = !isEmpty(data.email) ? data.email : '';

  if (Validator.isEmpty(data.nickname)) {
    errors.nickname = 'Please enter your nickname';
  }

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
