import isCheckBoxInput from './isCheckBoxInput';
import isRadioInput from './isRadioInput';
export default (ref) => isRadioInput(ref) || isCheckBoxInput(ref);