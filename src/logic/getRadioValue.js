const defaultReturn = {
  isValid: false,
  value: null,
};
export default (options) => Array.isArray(options)
  ? options.reduce((previous, option) => option && option.checked && !option.disabled
      ? {
          isValid: true,
          value: option.value,
      }
      : previous, defaultReturn)
  : defaultReturn;