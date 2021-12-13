import * as React from 'react';
import isString from './isString';
export default (value) => isString(value) || React.isValidElement(value);
