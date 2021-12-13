import isObject from './isObject';
export default (value) => isObject(value) && !Object.keys(value).length;
