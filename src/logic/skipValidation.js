export default ({ isOnBlur, isOnChange, isOnTouch, isTouched, isReValidateOnBlur, isReValidateOnChange, isBlurEvent, isSubmitted, isOnAll, }) => {
  if (isOnAll) {
      return false;
  }
  else if (!isSubmitted && isOnTouch) {
      return !(isTouched || isBlurEvent);
  }
  else if (isSubmitted ? isReValidateOnBlur : isOnBlur) {
      return !isBlurEvent;
  }
  else if (isSubmitted ? isReValidateOnChange : isOnChange) {
      return isBlurEvent;
  }
  return true;
};