export default (callback, wait) => {
  let timer = 0;
  return (...args) => {
      clearTimeout(timer);
      timer = window.setTimeout(() => callback(...args), wait);
  };
};