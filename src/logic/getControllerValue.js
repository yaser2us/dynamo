import isCheckBoxInput from '../utils/isCheckBoxInput';
import isObject from '../utils/isObject';
export default (event) => isObject(event) && event.target
    ? isCheckBoxInput(event.target)
        ? event.target.checked
        : event.target.value
    : event;