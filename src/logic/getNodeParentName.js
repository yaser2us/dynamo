export default (name) => name.substring(0, name.search(/.\d/)) || name;
