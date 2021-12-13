import omit from './omit';
export default (fields, keyName) => fields.map((field = {}) => omit(field, keyName));
