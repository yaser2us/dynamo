import isObject from '../utils/isObject';
import isRegex from '../utils/isRegex';

export default (validationData) =>
  isObject(validationData) && !isRegex(validationData)
    ? validationData
    : {
        value: validationData,
        message: '',
      };
