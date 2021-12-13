import isNullOrUndefined from './isNullOrUndefined';
import { isObjectType } from './isObject';
export default (value) => isNullOrUndefined(value) || !isObjectType(value);
