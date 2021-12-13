export default (name, validateAllFieldCriteria, errors, type, message) => validateAllFieldCriteria
  ? Object.assign(Object.assign({}, errors[name]), { types: Object.assign(Object.assign({}, (errors[name] && errors[name].types ? errors[name].types : {})), { [type]: message || true }) }) : {};
