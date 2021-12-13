export default (source, key) => {
  const copy = Object.assign({}, source);
  delete copy[key];
  return copy;
};