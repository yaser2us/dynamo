import generateId from './generateId';
export default (values = [], keyName) => values.map((value) => (Object.assign({ [keyName]: (value && value[keyName]) || generateId() }, value)));
