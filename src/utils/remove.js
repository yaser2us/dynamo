import compact from './compact';
import convertToArrayPayload from './convertToArrayPayload';
import isUndefined from './isUndefined';

function removeAtIndexes(data, indexes) {
  let i = 0;
  const temp = [...data];
  for (const index of indexes) {
    temp.splice(index - i, 1);
    i++;
  }
  return compact(temp).length ? temp : [];
}

export default (data, index) =>
  isUndefined(index)
    ? []
    : removeAtIndexes(
      data,
      (convertToArrayPayload(index)).sort((a, b) => a - b),
    );
