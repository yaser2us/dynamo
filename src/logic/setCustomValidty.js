import isBoolean from '../utils/isBoolean';
export default (inputRef, shouldUseNativeValidation, message) => {
    if (shouldUseNativeValidation && inputRef.reportValidity) {
        inputRef.setCustomValidity(isBoolean(message) ? '' : message || ' ');
        inputRef.reportValidity();
    }
};