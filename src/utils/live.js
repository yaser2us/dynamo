import isHTMLElement from './isHTMLElement';
export default (ref) => !isHTMLElement(ref) || !document.contains(ref);
