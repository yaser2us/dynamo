import isUndefined from './isUndefined';

export default (
  data,
  from,
  to,
) => {
  if (Array.isArray(data)) {
    if (isUndefined(data[to])) {
      data[to] = undefined;
    }
    data.splice(to, 0, data.splice(from, 1)[0]);
    return data;
  }

  return [];
};
