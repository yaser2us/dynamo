export default (value) =>
  Array.isArray(value) ? Array(value.length).fill(undefined) : undefined;
