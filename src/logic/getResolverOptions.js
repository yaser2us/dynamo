import { get } from '../utils';
import set from '../utils/set';

export default (
  fieldsNames,
  _fieldss,
  criteriaMode,
  shouldUseNativeValidation,
) => {
  const fields = {};

  for (const name of fieldsNames) {
    const field = get(_fieldss, name);

    field && set(fields, name, field._f);
  }

  return {
    criteriaMode,
    names: [...fieldsNames],
    fields,
    shouldUseNativeValidation,
  };
};
