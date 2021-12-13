import convertToArrayPayload from './convertToArrayPayload';
import isObject from './isObject';

export default (value) =>
  (convertToArrayPayload(value)).map((data) => {
    if (isObject(data)) {
      const object = {};

      for (const key in data) {
        object[key] = true;
      }

      return object;
    }

    return true;
  });
