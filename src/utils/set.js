import isKey from './isKey';
import isObject from './isObject';
import stringToPath from './stringToPath';
export default function set(object, path, value) {
  let index = -1;
  // console.log("dyno ;)", isKey(path),stringToPath(path), "setset", object)
  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const length = tempPath.length;
  const lastIndex = length - 1;
  while (++index < length) {
    const key = tempPath[index];
    let newValue = value;
    if (index !== lastIndex) {
      const objValue = object[key];
      newValue =
        isObject(objValue) || Array.isArray(objValue)
          ? objValue
          : !isNaN(+tempPath[index + 1])
            ? []
            : {};
    }
    object[key] = newValue;
    object = object[key];
  }
  return object;
}
