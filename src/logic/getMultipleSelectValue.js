export default (options) => [...options]
    .filter(({ selected }) => selected)
    .map(({ value }) => value);