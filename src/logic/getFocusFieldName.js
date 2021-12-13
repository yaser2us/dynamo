export default (name, index, options) => options && !options.shouldFocus
    ? options.focusName || `${name}.${options.focusIndex}.`
    : `${name}.${index}.`;