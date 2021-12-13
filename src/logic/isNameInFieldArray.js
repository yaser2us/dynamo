import getNodeParentName from './getNodeParentName';
export default (names, name) => [...names].some((current) => getNodeParentName(name) === current);
