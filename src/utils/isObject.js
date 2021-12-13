import isDateObject from './isDateObject';
import isNullOrUndefined from './isNullOrUndefined';
export const isObjectType = (value) => typeof value === 'object';
export default (value) => !isNullOrUndefined(value) &&
    !Array.isArray(value) &&
    isObjectType(value) &&
    !isDateObject(value);