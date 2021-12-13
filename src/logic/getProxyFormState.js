import { VALIDATION_MODE } from '../constants';

export default (
  formState,
  _proxyFormState,
  localProxyFormState,
  isRoot = true,
) => {
  function createGetter(prop) {
    return () => {
      if (prop in formState) {
        if (_proxyFormState[prop] !== VALIDATION_MODE.all) {
          _proxyFormState[prop] = !isRoot || VALIDATION_MODE.all;
        }
        localProxyFormState && (localProxyFormState[prop] = true);
        return formState[prop];
      }
      return undefined;
    };
  }

  const result = {};
  for (const key in formState) {
    Object.defineProperty(result, key, {
      get: createGetter(key),
    });
  }

  return result;
};
