import React__default, { createContext, useContext, createElement, useRef, useState, useEffect, useCallback, isValidElement, useMemo } from 'react';
import _ from 'lodash';

var isCheckBoxInput = (element => element.type === 'checkbox');

var isDateObject = (data => data instanceof Date);

var isNullOrUndefined = (value => value == null);

const isObjectType = value => typeof value === 'object';
var isObject = (value => !isNullOrUndefined(value) && !Array.isArray(value) && isObjectType(value) && !isDateObject(value));

var getControllerValue = (event => isObject(event) && event.target ? isCheckBoxInput(event.target) ? event.target.checked : event.target.value : event);

var getNodeParentName = (name => name.substring(0, name.search(/.\d/)) || name);

var isNameInFieldArray = ((names, name) => [...names].some(current => getNodeParentName(name) === current));

var compact = (value => value.filter(Boolean));

var isUndefined = (val => val === undefined);

var get = ((obj, path, defaultValue) => {
  if (isObject(obj) && path) {
    const result = compact(path.split(/[,[\].]+?/)).reduce((result, key) => isNullOrUndefined(result) ? result : result[key], obj);
    return isUndefined(result) || result === obj ? isUndefined(obj[path]) ? defaultValue : obj[path] : result;
  }
  return undefined;
});

const EVENTS = {
  BLUR: 'blur',
  CHANGE: 'change'
};
const VALIDATION_MODE = {
  onBlur: 'onBlur',
  onChange: 'onChange',
  onSubmit: 'onSubmit',
  onTouched: 'onTouched',
  all: 'all'
};
const INPUT_VALIDATION_RULES = {
  max: 'max',
  min: 'min',
  maxLength: 'maxLength',
  minLength: 'minLength',
  pattern: 'pattern',
  required: 'required',
  validate: 'validate'
};

var omit = ((source, key) => {
  const copy = Object.assign({}, source);
  delete copy[key];
  return copy;
});

const FormContext = createContext(null);
FormContext.displayName = 'RHFContext';
const useFormContext = () => useContext(FormContext);
const FormProvider = props => createElement(FormContext.Provider, {
  value: omit(props, 'children')
}, props.children);

var getProxyFormState = ((formState, _proxyFormState, localProxyFormState, isRoot = true) => {
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
      get: createGetter(key)
    });
  }
  return result;
});

var isEmptyObject = (value => isObject(value) && !Object.keys(value).length);

var shouldRenderFormState = ((formStateData, _proxyFormState, isRoot) => {
  const formState = omit(formStateData, 'name');
  return isEmptyObject(formState) || Object.keys(formState).length >= Object.keys(_proxyFormState).length || Object.keys(formState).find(key => _proxyFormState[key] === (!isRoot || VALIDATION_MODE.all));
});

var convertToArrayPayload = (value => Array.isArray(value) ? value : [value]);

function useFormState(props) {
  const methods = useFormContext();
  const {
    control = methods.control,
    disabled,
    visible,
    name
  } = props || {};
  const nameRef = useRef(name);
  const [formState, updateFormState] = useState(control._formState.val);
  const _localProxyFormState = useRef({
    isDirty: false,
    dirtyFields: false,
    touchedFields: false,
    isValidating: false,
    isValid: false,
    errors: false
  });
  nameRef.current = name;
  useEffect(() => {
    const formStateSubscription = control._subjects.state.subscribe({
      next: formState => (!nameRef.current || !formState.name || convertToArrayPayload(nameRef.current).includes(formState.name)) && shouldRenderFormState(formState, _localProxyFormState.current) && updateFormState(Object.assign(Object.assign({}, control._formState.val), formState))
    });
    disabled && formStateSubscription.unsubscribe();
    return () => formStateSubscription.unsubscribe();
  }, [disabled, control]);
  return getProxyFormState(formState, control._proxyFormState, _localProxyFormState.current, false);
}

function useController(props) {
  const methods = useFormContext();
  const {
    name,
    control = methods.control,
    shouldUnregister,
    item
  } = props;
  console.log("dyno ;)", item, "useController");
  const [value, setInputStateValue] = useState(get(control._formValues, name, get(control._defaultValues, name, props.defaultValue)));
  const formState = useFormState({
    control: control || methods.control,
    name
  });
  const registerProps = control.register(name, Object.assign(Object.assign({}, {
    ...props.rules,
    item: {
      ...item
    }
  }), {
    value
  }));
  const updateMounted = useCallback((name, value) => {
    const field = get(control._fields, name);
    if (field) {
      field._f.mount = value;
    }
  }, [control]);
  useEffect(() => {
    const controllerSubscription = control._subjects.control.subscribe({
      next: data => (!data.name || name === data.name) && setInputStateValue(get(data.values, name))
    });
    updateMounted(name, true);
    return () => {
      controllerSubscription.unsubscribe();
      const _shouldUnregisterField = control._shouldUnregister || shouldUnregister;
      if (isNameInFieldArray(control._names.array, name) ? _shouldUnregisterField && !control._isInAction.val : _shouldUnregisterField) {
        control.unregister(name);
      } else {
        updateMounted(name, false);
      }
    };
  }, [name, control, shouldUnregister, updateMounted]);
  return {
    field: {
      onChange: event => {
        const value = getControllerValue(event);
        setInputStateValue(value);
        registerProps.onChange({
          target: {
            value,
            name: name
          },
          type: EVENTS.CHANGE
        });
      },
      onBlur: () => {
        registerProps.onBlur({
          target: {
            name: name
          },
          type: EVENTS.BLUR
        });
      },
      name,
      value,
      ref: elm => elm && registerProps.ref({
        focus: () => elm.focus && elm.focus(),
        setCustomValidity: message => elm.setCustomValidity(message),
        reportValidity: () => elm.reportValidity()
      })
    },
    formState,
    fieldState: {
      invalid: !!get(formState.errors, name),
      isDirty: !!get(formState.dirtyFields, name),
      isTouched: !!get(formState.touchedFields, name),
      error: get(formState.errors, name)
    }
  };
}

const Controller = props => props.render(useController(props));

var appendErrors = ((name, validateAllFieldCriteria, errors, type, message) => validateAllFieldCriteria ? Object.assign(Object.assign({}, errors[name]), {
  types: Object.assign(Object.assign({}, errors[name] && errors[name].types ? errors[name].types : {}), {
    [type]: message || true
  })
}) : {});

var isKey = (value => /^\w*$/.test(value));

var stringToPath = (input => compact(input.replace(/["|']|\]/g, '').split(/\.|\[/)));

function set(object, path, value) {
  let index = -1;
  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const length = tempPath.length;
  const lastIndex = length - 1;
  while (++index < length) {
    const key = tempPath[index];
    let newValue = value;
    if (index !== lastIndex) {
      const objValue = object[key];
      newValue = isObject(objValue) || Array.isArray(objValue) ? objValue : !isNaN(+tempPath[index + 1]) ? [] : {};
    }
    object[key] = newValue;
    object = object[key];
  }
  return object;
}

const focusFieldBy = (fields, callback, fieldsNames) => {
  for (const key of fieldsNames || Object.keys(fields)) {
    const field = get(fields, key);
    if (field) {
      const _f = field._f;
      const current = omit(field, '_f');
      if (_f && callback(_f.name)) {
        if (_f.ref.focus && isUndefined(_f.ref.focus())) {
          break;
        } else if (_f.refs) {
          _f.refs[0].focus();
          break;
        }
      } else if (isObject(current)) {
        focusFieldBy(current, callback);
      }
    }
  }
};

var getFocusFieldName = ((name, index, options) => options && !options.shouldFocus ? options.focusName || `${name}.${options.focusIndex}.` : `${name}.${index}.`);

var generateId = (() => {
  const d = typeof performance === 'undefined' ? Date.now() : performance.now() * 1000;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16 + d) % 16 | 0;
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
});

var mapIds = ((values = [], keyName) => values.map(value => Object.assign({
  [keyName]: value && value[keyName] || generateId()
}, value)));

function append(data, value) {
  return [...convertToArrayPayload(data), ...convertToArrayPayload(value)];
}

var fillEmptyArray = (value => Array.isArray(value) ? Array(value.length).fill(undefined) : undefined);

function insert(data, index, value) {
  return [...data.slice(0, index), ...convertToArrayPayload(value), ...data.slice(index)];
}

var moveArrayAt = ((data, from, to) => {
  if (Array.isArray(data)) {
    if (isUndefined(data[to])) {
      data[to] = undefined;
    }
    data.splice(to, 0, data.splice(from, 1)[0]);
    return data;
  }
  return [];
});

var omitKey = ((fields, keyName) => fields.map((field = {}) => omit(field, keyName)));

function prepend(data, value) {
  return [...convertToArrayPayload(value), ...convertToArrayPayload(data)];
}

function removeAtIndexes(data, indexes) {
  let i = 0;
  const temp = [...data];
  for (const index of indexes) {
    temp.splice(index - i, 1);
    i++;
  }
  return compact(temp).length ? temp : [];
}
var removeArrayAt = ((data, index) => isUndefined(index) ? [] : removeAtIndexes(data, convertToArrayPayload(index).sort((a, b) => a - b)));

var swapArrayAt = ((data, indexA, indexB) => {
  data[indexA] = [data[indexB], data[indexB] = data[indexA]][0];
});

var isBoolean = (value => typeof value === 'boolean');

function baseGet(object, updatePath) {
  const length = updatePath.slice(0, -1).length;
  let index = 0;
  while (index < length) {
    object = isUndefined(object) ? index++ : object[updatePath[index++]];
  }
  return object;
}
function unset(object, path) {
  const updatePath = isKey(path) ? [path] : stringToPath(path);
  const childObject = updatePath.length == 1 ? object : baseGet(object, updatePath);
  const key = updatePath[updatePath.length - 1];
  let previousObjRef;
  if (childObject) {
    delete childObject[key];
  }
  for (let k = 0; k < updatePath.slice(0, -1).length; k++) {
    let index = -1;
    let objectRef;
    const currentPaths = updatePath.slice(0, -(k + 1));
    const currentPathsLength = currentPaths.length - 1;
    if (k > 0) {
      previousObjRef = object;
    }
    while (++index < currentPaths.length) {
      const item = currentPaths[index];
      objectRef = objectRef ? objectRef[item] : object[item];
      if (currentPathsLength === index && (isObject(objectRef) && isEmptyObject(objectRef) || Array.isArray(objectRef) && !objectRef.filter(data => isObject(data) && !isEmptyObject(data) || isBoolean(data)).length)) {
        previousObjRef ? delete previousObjRef[item] : delete object[item];
      }
      previousObjRef = objectRef;
    }
  }
  return object;
}

var updateAt = ((fieldValues, index, value) => {
  fieldValues[index] = value;
  return fieldValues;
});

const useFieldArray = props => {
  const methods = useFormContext();
  const {
    control = methods.control,
    name,
    keyName = 'id',
    shouldUnregister
  } = props;
  const _focusName = useRef('');
  const [fields, setFields] = useState(mapIds(control._getFieldArrayValue(name), keyName));
  control._names.array.add(name);
  const append$1 = (value, options) => {
    const appendValue = convertToArrayPayload(value);
    const updatedFieldArrayValues = append(control._getFieldArrayValue(name), appendValue);
    control._bathFieldArrayUpdate(keyName, name, append, {
      argA: fillEmptyArray(value)
    }, updatedFieldArrayValues, false);
    setFields(mapIds(updatedFieldArrayValues, keyName));
    _focusName.current = getFocusFieldName(name, updatedFieldArrayValues.length - appendValue.length, options);
  };
  const prepend$1 = (value, options) => {
    const updatedFieldArrayValues = prepend(control._getFieldArrayValue(name), convertToArrayPayload(value));
    control._bathFieldArrayUpdate(keyName, name, prepend, {
      argA: fillEmptyArray(value)
    }, updatedFieldArrayValues);
    setFields(mapIds(updatedFieldArrayValues, keyName));
    _focusName.current = getFocusFieldName(name, 0, options);
  };
  const remove = index => {
    const updatedFieldArrayValues = removeArrayAt(control._getFieldArrayValue(name), index);
    control._bathFieldArrayUpdate(keyName, name, removeArrayAt, {
      argA: index
    }, updatedFieldArrayValues);
    setFields(mapIds(updatedFieldArrayValues, keyName));
  };
  const insert$1 = (index, value, options) => {
    const updatedFieldArrayValues = insert(control._getFieldArrayValue(name), index, convertToArrayPayload(value));
    control._bathFieldArrayUpdate(keyName, name, insert, {
      argA: index,
      argB: fillEmptyArray(value)
    }, updatedFieldArrayValues);
    setFields(mapIds(updatedFieldArrayValues, keyName));
    _focusName.current = getFocusFieldName(name, index, options);
  };
  const swap = (indexA, indexB) => {
    const fieldValues = control._getFieldArrayValue(name);
    swapArrayAt(fieldValues, indexA, indexB);
    control._bathFieldArrayUpdate(keyName, name, swapArrayAt, {
      argA: indexA,
      argB: indexB
    }, fieldValues, false);
    setFields(mapIds(fieldValues, keyName));
  };
  const move = (from, to) => {
    const fieldValues = control._getFieldArrayValue(name);
    moveArrayAt(fieldValues, from, to);
    control._bathFieldArrayUpdate(keyName, name, moveArrayAt, {
      argA: from,
      argB: to
    }, fieldValues, false);
    setFields(mapIds(fieldValues, keyName));
  };
  const update = (index, value) => {
    const fieldValues = control._getFieldArrayValue(name);
    const updatedFieldArrayValues = updateAt(fieldValues, index, value);
    control._bathFieldArrayUpdate(keyName, name, updateAt, {
      argA: index,
      argB: value
    }, fieldValues, true, false);
    setFields(mapIds(updatedFieldArrayValues, keyName));
  };
  useEffect(() => {
    control._isInAction.val = false;
    if (control._names.watchAll) {
      control._subjects.state.next({});
    } else {
      for (const watchField of control._names.watch) {
        if (name.startsWith(watchField)) {
          control._subjects.state.next({});
          break;
        }
      }
    }
    control._subjects.watch.next({
      name,
      values: control._formValues
    });
    _focusName.current && focusFieldBy(control._fields, key => key.startsWith(_focusName.current));
    _focusName.current = '';
    control._subjects.array.next({
      name,
      values: omitKey([...fields], keyName)
    });
    control._proxyFormState.isValid && control._updateValid();
  }, [fields, name, control, keyName]);
  useEffect(() => {
    const fieldArraySubscription = control._subjects.array.subscribe({
      next(payload) {
        if (payload.isReset) {
          unset(control._fields, payload.name || name);
          unset(control._formValues, payload.name || name);
          payload.name ? set(control._formValues, payload.name, payload.values) : payload.values && (control._formValues = payload.values);
          setFields(mapIds(get(control._formValues, name), keyName));
        }
      }
    });
    !get(control._formValues, name) && set(control._formValues, name, []);
    return () => {
      fieldArraySubscription.unsubscribe();
      if (control._shouldUnregister || shouldUnregister) {
        control.unregister(name);
        unset(control._formValues, name);
      } else {
        const fieldArrayValues = get(control._formValues, name);
        fieldArrayValues && set(control._formValues, name, fieldArrayValues);
      }
    };
  }, [name, control, keyName, shouldUnregister]);
  return {
    swap: useCallback(swap, [name, control, keyName]),
    move: useCallback(move, [name, control, keyName]),
    prepend: useCallback(prepend$1, [name, control, keyName]),
    append: useCallback(append$1, [name, control, keyName]),
    remove: useCallback(remove, [name, control, keyName]),
    insert: useCallback(insert$1, [name, control, keyName]),
    update: useCallback(update, [name, control, keyName]),
    fields: fields
  };
};

var debounce = ((callback, wait) => {
  let timer = 0;
  return (...args) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), wait);
  };
});

var isPrimitive = (value => isNullOrUndefined(value) || !isObjectType(value));

function deepEqual(object1, object2) {
  if (isPrimitive(object1) || isPrimitive(object2) || isDateObject(object1) || isDateObject(object2)) {
    return object1 === object2;
  }
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    if (!keys2.includes(key)) {
      return false;
    }
    if (key !== 'ref') {
      const val2 = object2[key];
      if ((isObject(val1) || Array.isArray(val1)) && (isObject(val2) || Array.isArray(val2)) ? !deepEqual(val1, val2) : val1 !== val2) {
        return false;
      }
    }
  }
  return true;
}

var getValidationModes = (mode => ({
  isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,
  isOnBlur: mode === VALIDATION_MODE.onBlur,
  isOnChange: mode === VALIDATION_MODE.onChange,
  isOnAll: mode === VALIDATION_MODE.all,
  isOnTouch: mode === VALIDATION_MODE.onTouched
}));

var isFileInput = (element => element.type === 'file');

var isFunction = (value => typeof value === 'function');

var isHTMLElement = (value => value instanceof HTMLElement);

var isMultipleSelect = (element => element.type === `select-multiple`);

var isRadioInput = (element => element.type === 'radio');

var isRadioOrCheckboxFunction = (ref => isRadioInput(ref) || isCheckBoxInput(ref));

var isString = (value => typeof value === 'string');

var isWeb = typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined' && typeof document !== 'undefined';

class Subscription {
  constructor() {
    this.tearDowns = [];
  }
  add(tearDown) {
    this.tearDowns.push(tearDown);
  }
  unsubscribe() {
    for (const teardown of this.tearDowns) {
      teardown();
    }
    this.tearDowns = [];
  }
}
class Subscriber {
  constructor(observer, subscription) {
    this.observer = observer;
    this.closed = false;
    subscription.add(() => this.closed = true);
  }
  next(value) {
    if (!this.closed) {
      this.observer.next(value);
    }
  }
}
class Subject {
  constructor() {
    this.observers = [];
  }
  next(value) {
    for (const observer of this.observers) {
      observer.next(value);
    }
  }
  subscribe(observer) {
    const subscription = new Subscription();
    const subscriber = new Subscriber(observer, subscription);
    this.observers.push(subscriber);
    return subscription;
  }
  unsubscribe() {
    this.observers = [];
  }
}

const defaultResult = {
  value: false,
  isValid: false
};
const validResult = {
  value: true,
  isValid: true
};
var getCheckboxValue = (options => {
  if (Array.isArray(options)) {
    if (options.length > 1) {
      const values = options.filter(option => option && option.checked && !option.disabled).map(option => option.value);
      return {
        value: values,
        isValid: !!values.length
      };
    }
    return options[0].checked && !options[0].disabled ? options[0].attributes && !isUndefined(options[0].attributes.value) ? isUndefined(options[0].value) || options[0].value === '' ? validResult : {
      value: options[0].value,
      isValid: true
    } : validResult : defaultResult;
  }
  return defaultResult;
});

var getFieldValueAs = ((value, {
  valueAsNumber,
  valueAsDate,
  setValueAs
}) => isUndefined(value) ? value : valueAsNumber ? value === '' ? NaN : +value : valueAsDate ? new Date(value) : setValueAs ? setValueAs(value) : value);

var getMultipleSelectValue = (options => [...options].filter(({
  selected
}) => selected).map(({
  value
}) => value));

const defaultReturn = {
  isValid: false,
  value: null
};
var getRadioValue = (options => Array.isArray(options) ? options.reduce((previous, option) => option && option.checked && !option.disabled ? {
  isValid: true,
  value: option.value
} : previous, defaultReturn) : defaultReturn);

function getFieldValue(field) {
  if (field && field._f) {
    const ref = field._f.ref;
    if (isFileInput(ref)) {
      return ref.files;
    }
    if (isRadioInput(ref)) {
      return getRadioValue(field._f.refs).value;
    }
    if (isMultipleSelect(ref)) {
      return getMultipleSelectValue(ref.options);
    }
    if (isCheckBoxInput(ref)) {
      return getCheckboxValue(field._f.refs).value;
    }
    return getFieldValueAs(isUndefined(ref.value) ? field._f.ref.value : ref.value, field._f);
  }
}

var getResolverOptions = ((fieldsNames, _fieldss, criteriaMode, shouldUseNativeValidation) => {
  const fields = {};
  for (const name of fieldsNames) {
    const field = get(_fieldss, name);
    field && set(fields, name, field._f);
  }
  return {
    criteriaMode,
    names: [...fieldsNames],
    fields,
    shouldUseNativeValidation
  };
});

var hasValidation = ((options, mounted) => mounted && options && (options.required || options.min || options.max || options.maxLength || options.minLength || options.pattern || options.validate));

function deepMerge(target, source) {
  if (isPrimitive(target) || isPrimitive(source)) {
    return source;
  }
  for (const key in source) {
    const targetValue = target[key];
    const sourceValue = source[key];
    try {
      target[key] = isObject(targetValue) && isObject(sourceValue) || Array.isArray(targetValue) && Array.isArray(sourceValue) ? deepMerge(targetValue, sourceValue) : sourceValue;
    } catch (_a) {}
  }
  return target;
}

function setDirtyFields(values, defaultValues, dirtyFields, parentNode, parentName) {
  let index = -1;
  while (++index < values.length) {
    for (const key in values[index]) {
      if (Array.isArray(values[index][key])) {
        !dirtyFields[index] && (dirtyFields[index] = {});
        dirtyFields[index][key] = [];
        setDirtyFields(values[index][key], get(defaultValues[index] || {}, key, []), dirtyFields[index][key], dirtyFields[index], key);
      } else {
        !isNullOrUndefined(defaultValues) && deepEqual(get(defaultValues[index] || {}, key), values[index][key]) ? set(dirtyFields[index] || {}, key) : dirtyFields[index] = Object.assign(Object.assign({}, dirtyFields[index]), {
          [key]: true
        });
      }
    }
    parentNode && !dirtyFields.length && delete parentNode[parentName];
  }
  return dirtyFields;
}
var setFieldArrayDirtyFields = ((values, defaultValues, dirtyFields) => deepMerge(setDirtyFields(values, defaultValues, dirtyFields.slice(0, values.length)), setDirtyFields(defaultValues, values, dirtyFields.slice(0, values.length))));

var skipValidation = (({
  isOnBlur,
  isOnChange,
  isOnTouch,
  isTouched,
  isReValidateOnBlur,
  isReValidateOnChange,
  isBlurEvent,
  isSubmitted,
  isOnAll
}) => {
  if (isOnAll) {
    return false;
  } else if (!isSubmitted && isOnTouch) {
    return !(isTouched || isBlurEvent);
  } else if (isSubmitted ? isReValidateOnBlur : isOnBlur) {
    return !isBlurEvent;
  } else if (isSubmitted ? isReValidateOnChange : isOnChange) {
    return isBlurEvent;
  }
  return true;
});

var unsetEmptyArray = ((ref, name) => !compact(get(ref, name, [])).length && unset(ref, name));

var isMessage = (value => isString(value) || isValidElement(value));

var isRegex = (value => value instanceof RegExp);

function getValidateError(result, ref, type = 'validate') {
  if (isMessage(result) || Array.isArray(result) && result.every(isMessage) || isBoolean(result) && !result) {
    return {
      type,
      message: isMessage(result) ? result : '',
      ref
    };
  }
}

var getValueAndMessage = (validationData => isObject(validationData) && !isRegex(validationData) ? validationData : {
  value: validationData,
  message: ''
});

var validateField = (async (field, inputValue, validateAllFieldCriteria, shouldUseNativeValidation) => {
  const {
    ref,
    refs,
    required,
    maxLength,
    minLength,
    min,
    max,
    pattern,
    validate,
    name,
    valueAsNumber,
    mount
  } = field._f;
  if (!mount) {
    return {};
  }
  const inputRef = refs ? refs[0] : ref;
  const setCustomValidty = message => {
    if (shouldUseNativeValidation && inputRef.reportValidity) {
      inputRef.setCustomValidity(isBoolean(message) ? '' : message || ' ');
      inputRef.reportValidity();
    }
  };
  const error = {};
  const isRadio = isRadioInput(ref);
  const isCheckBox = isCheckBoxInput(ref);
  const isRadioOrCheckbox = isRadio || isCheckBox;
  const isEmpty = (valueAsNumber || isFileInput(ref)) && !ref.value || inputValue === '' || Array.isArray(inputValue) && !inputValue.length;
  const appendErrorsCurry = appendErrors.bind(null, name, validateAllFieldCriteria, error);
  const getMinMaxMessage = (exceedMax, maxLengthMessage, minLengthMessage, maxType = INPUT_VALIDATION_RULES.maxLength, minType = INPUT_VALIDATION_RULES.minLength) => {
    const message = exceedMax ? maxLengthMessage : minLengthMessage;
    error[name] = Object.assign({
      type: exceedMax ? maxType : minType,
      message,
      ref
    }, appendErrorsCurry(exceedMax ? maxType : minType, message));
  };
  if (required && (!isRadioOrCheckbox && (isEmpty || isNullOrUndefined(inputValue)) || isBoolean(inputValue) && !inputValue || isCheckBox && !getCheckboxValue(refs).isValid || isRadio && !getRadioValue(refs).isValid)) {
    const {
      value,
      message
    } = isMessage(required) ? {
      value: !!required,
      message: required
    } : getValueAndMessage(required);
    if (value) {
      error[name] = Object.assign({
        type: INPUT_VALIDATION_RULES.required,
        message,
        ref: inputRef
      }, appendErrorsCurry(INPUT_VALIDATION_RULES.required, message));
      if (!validateAllFieldCriteria) {
        setCustomValidty(message);
        return error;
      }
    }
  }
  if (!isEmpty && (!isNullOrUndefined(min) || !isNullOrUndefined(max))) {
    let exceedMax;
    let exceedMin;
    const maxOutput = getValueAndMessage(max);
    const minOutput = getValueAndMessage(min);
    if (!isNaN(inputValue)) {
      const valueNumber = ref.valueAsNumber || parseFloat(inputValue);
      if (!isNullOrUndefined(maxOutput.value)) {
        exceedMax = valueNumber > maxOutput.value;
      }
      if (!isNullOrUndefined(minOutput.value)) {
        exceedMin = valueNumber < minOutput.value;
      }
    } else {
      const valueDate = ref.valueAsDate || new Date(inputValue);
      if (isString(maxOutput.value)) {
        exceedMax = valueDate > new Date(maxOutput.value);
      }
      if (isString(minOutput.value)) {
        exceedMin = valueDate < new Date(minOutput.value);
      }
    }
    if (exceedMax || exceedMin) {
      getMinMaxMessage(!!exceedMax, maxOutput.message, minOutput.message, INPUT_VALIDATION_RULES.max, INPUT_VALIDATION_RULES.min);
      if (!validateAllFieldCriteria) {
        setCustomValidty(error[name].message);
        return error;
      }
    }
  }
  if ((maxLength || minLength) && !isEmpty && isString(inputValue)) {
    const maxLengthOutput = getValueAndMessage(maxLength);
    const minLengthOutput = getValueAndMessage(minLength);
    const exceedMax = !isNullOrUndefined(maxLengthOutput.value) && inputValue.length > maxLengthOutput.value;
    const exceedMin = !isNullOrUndefined(minLengthOutput.value) && inputValue.length < minLengthOutput.value;
    if (exceedMax || exceedMin) {
      getMinMaxMessage(exceedMax, maxLengthOutput.message, minLengthOutput.message);
      if (!validateAllFieldCriteria) {
        setCustomValidty(error[name].message);
        return error;
      }
    }
  }
  if (pattern && !isEmpty && isString(inputValue)) {
    const {
      value: patternValue,
      message
    } = getValueAndMessage(pattern);
    console.log("dyno ;)", isRegex(new RegExp(patternValue)), !inputValue.match(patternValue), patternValue, "patternValue");
    if (isRegex(new RegExp(patternValue)) && !inputValue.match(patternValue)) {
      error[name] = Object.assign({
        type: INPUT_VALIDATION_RULES.pattern,
        message,
        ref
      }, appendErrorsCurry(INPUT_VALIDATION_RULES.pattern, message));
      if (!validateAllFieldCriteria) {
        setCustomValidty(message);
        return error;
      }
    }
  }
  if (validate) {
    if (isFunction(validate)) {
      const result = await validate(inputValue);
      const validateError = getValidateError(result, inputRef);
      if (validateError) {
        error[name] = Object.assign(Object.assign({}, validateError), appendErrorsCurry(INPUT_VALIDATION_RULES.validate, validateError.message));
        if (!validateAllFieldCriteria) {
          setCustomValidty(validateError.message);
          return error;
        }
      }
    } else if (isObject(validate)) {
      let validationResult = {};
      for (const key in validate) {
        if (!isEmptyObject(validationResult) && !validateAllFieldCriteria) {
          break;
        }
        const validateError = getValidateError(await validate[key](inputValue), inputRef, key);
        if (validateError) {
          validationResult = Object.assign(Object.assign({}, validateError), appendErrorsCurry(key, validateError.message));
          setCustomValidty(validateError.message);
          if (validateAllFieldCriteria) {
            error[name] = validationResult;
          }
        }
      }
      if (!isEmptyObject(validationResult)) {
        error[name] = Object.assign({
          ref: inputRef
        }, validationResult);
        if (!validateAllFieldCriteria) {
          return error;
        }
      }
    }
  }
  setCustomValidty(true);
  return error;
});

const defaultOptions = {
  mode: VALIDATION_MODE.onSubmit,
  reValidateMode: VALIDATION_MODE.onChange,
  shouldFocusError: true
};
const isWindowUndefined = typeof window === 'undefined';
function createFormControlV3(props = {}) {
  let formOptions = Object.assign(Object.assign({}, defaultOptions), props);
  let _delayCallback;
  let _formState = {
    isDirty: false,
    isValidating: false,
    dirtyFields: {},
    isSubmitted: false,
    submitCount: 0,
    touchedFields: {},
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    errors: {}
  };
  const _proxyFormState = {
    isDirty: false,
    dirtyFields: false,
    touchedFields: false,
    isValidating: false,
    isValid: false,
    errors: false
  };
  let _fields = {};
  let _formValues = {};
  let _defaultValues = formOptions.defaultValues || {};
  let _isInAction = false;
  let _isMounted = false;
  const _subjects = {
    watch: new Subject(),
    control: new Subject(),
    array: new Subject(),
    state: new Subject()
  };
  let _names = {
    mount: new Set(),
    unMount: new Set(),
    array: new Set(),
    watch: new Set(),
    watchAll: false
  };
  const validationMode = getValidationModes(formOptions.mode);
  const isValidateAllFieldCriteria = formOptions.criteriaMode === VALIDATION_MODE.all;
  const isFieldWatched = name => _names.watchAll || _names.watch.has(name) || _names.watch.has((name.match(/\w+/) || [])[0]);
  const updateErrorState = (name, error) => {
    set(_formState.errors, name, error);
    _subjects.state.next({
      errors: _formState.errors
    });
  };
  const shouldRenderBaseOnValid = async () => {
    const isValid = await validateForm(_fields, true);
    if (isValid !== _formState.isValid) {
      _formState.isValid = isValid;
      _subjects.state.next({
        isValid
      });
    }
  };
  const shouldRenderBaseOnError = async (shouldSkipRender, name, error, fieldState, isValidFromResolver, isWatched) => {
    const previousError = get(_formState.errors, name);
    const isValid = !!(_proxyFormState.isValid && (formOptions.resolver ? isValidFromResolver : shouldRenderBaseOnValid()));
    if (props.delayError && error) {
      _delayCallback = _delayCallback || debounce(updateErrorState, props.delayError);
      _delayCallback(name, error);
    } else {
      error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
    }
    if ((isWatched || (error ? !deepEqual(previousError, error) : previousError) || !isEmptyObject(fieldState) || _formState.isValid !== isValid) && !shouldSkipRender) {
      const updatedFormState = Object.assign(Object.assign(Object.assign({}, fieldState), _proxyFormState.isValid && formOptions.resolver ? {
        isValid
      } : {}), {
        errors: _formState.errors,
        name
      });
      _formState = Object.assign(Object.assign({}, _formState), updatedFormState);
      _subjects.state.next(isWatched ? {
        name
      } : updatedFormState);
    }
    _subjects.state.next({
      isValidating: false
    });
  };
  const setFieldValue = (name, value, options = {}, shouldRender) => {
    const field = get(_fields, name);
    if (field) {
      const _f = field._f;
      if (_f) {
        set(_formValues, name, getFieldValueAs(value, _f));
        const fieldValue = isWeb && isHTMLElement(_f.ref) && isNullOrUndefined(value) ? '' : value;
        if (isFileInput(_f.ref) && !isString(fieldValue)) {
          _f.ref.files = fieldValue;
        } else if (isMultipleSelect(_f.ref)) {
          [..._f.ref.options].forEach(selectRef => selectRef.selected = fieldValue.includes(selectRef.value));
        } else if (_f.refs) {
          if (isCheckBoxInput(_f.ref)) {
            _f.refs.length > 1 ? _f.refs.forEach(checkboxRef => checkboxRef.checked = Array.isArray(fieldValue) ? !!fieldValue.find(data => data === checkboxRef.value) : fieldValue === checkboxRef.value) : _f.refs[0].checked = !!fieldValue;
          } else {
            _f.refs.forEach(radioRef => radioRef.checked = radioRef.value === fieldValue);
          }
        } else {
          _f.ref.value = fieldValue;
        }
        if (shouldRender) {
          _subjects.control.next({
            values: getValues(),
            name
          });
        }
        (options.shouldDirty || options.shouldTouch) && updateTouchAndDirtyState(name, fieldValue, options.shouldTouch);
        options.shouldValidate && trigger(name);
      }
    }
  };
  const updateTouchAndDirtyState = (name, inputValue, isCurrentTouched, shouldRender = true) => {
    const state = {
      name
    };
    let isChanged = false;
    if (_proxyFormState.isDirty) {
      const previousIsDirty = _formState.isDirty;
      _formState.isDirty = _getIsDirty();
      state.isDirty = _formState.isDirty;
      isChanged = previousIsDirty !== state.isDirty;
    }
    if (_proxyFormState.dirtyFields && !isCurrentTouched) {
      const isPreviousFieldDirty = get(_formState.dirtyFields, name);
      const isCurrentFieldDirty = !deepEqual(get(_defaultValues, name), inputValue);
      isCurrentFieldDirty ? set(_formState.dirtyFields, name, true) : unset(_formState.dirtyFields, name);
      state.dirtyFields = _formState.dirtyFields;
      isChanged = isChanged || isPreviousFieldDirty !== get(_formState.dirtyFields, name);
    }
    const isPreviousFieldTouched = get(_formState.touchedFields, name);
    if (isCurrentTouched && !isPreviousFieldTouched) {
      set(_formState.touchedFields, name, isCurrentTouched);
      state.touchedFields = _formState.touchedFields;
      isChanged = isChanged || _proxyFormState.touchedFields && isPreviousFieldTouched !== isCurrentTouched;
    }
    isChanged && shouldRender && _subjects.state.next(state);
    return isChanged ? state : {};
  };
  const executeResolver = async name => {
    return formOptions.resolver ? await formOptions.resolver(Object.assign({}, _formValues), formOptions.context, getResolverOptions(name || _names.mount, _fields, formOptions.criteriaMode, formOptions.shouldUseNativeValidation)) : {};
  };
  const executeResolverValidation = async names => {
    const {
      errors
    } = await executeResolver();
    if (names) {
      for (const name of names) {
        const error = get(errors, name);
        error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
      }
    } else {
      _formState.errors = errors;
    }
    return errors;
  };
  const validateForm = async (_fields, shouldCheckValid, context = {
    valid: true
  }) => {
    for (const name in _fields) {
      const field = _fields[name];
      if (field) {
        const _f = field._f;
        const val = omit(field, '_f');
        if (_f) {
          const fieldError = await validateField(field, get(_formValues, _f.name), isValidateAllFieldCriteria, formOptions.shouldUseNativeValidation);
          console.log("dyno ;)", fieldError, "fieldError");
          if (shouldCheckValid) {
            if (fieldError[_f.name]) {
              context.valid = false;
              break;
            }
          } else {
            if (fieldError[_f.name]) {
              context.valid = false;
            }
            fieldError[_f.name] ? set(_formState.errors, _f.name, fieldError[_f.name]) : unset(_formState.errors, _f.name);
          }
        }
        val && (await validateForm(val, shouldCheckValid, context));
      }
    }
    return context.valid;
  };
  const handleChange = async ({
    type,
    target,
    target: {
      value,
      name,
      type: inputType
    }
  }) => {
    let error;
    let isValid;
    const field = get(_fields, name);
    if (field) {
      let inputValue = inputType ? getFieldValue(field) : undefined;
      inputValue = isUndefined(inputValue) ? value : inputValue;
      const isBlurEvent = type === EVENTS.BLUR;
      const {
        isOnBlur: isReValidateOnBlur,
        isOnChange: isReValidateOnChange
      } = getValidationModes(formOptions.reValidateMode);
      const shouldSkipValidation = !hasValidation(field._f, field._f.mount) && !formOptions.resolver && !get(_formState.errors, name) || skipValidation(Object.assign({
        isBlurEvent,
        isTouched: !!get(_formState.touchedFields, name),
        isSubmitted: _formState.isSubmitted,
        isReValidateOnBlur,
        isReValidateOnChange
      }, validationMode));
      const isWatched = !isBlurEvent && isFieldWatched(name);
      if (!isUndefined(inputValue)) {
        set(_formValues, name, inputValue);
      }
      const fieldState = updateTouchAndDirtyState(name, inputValue, isBlurEvent, false);
      const shouldRender = !isEmptyObject(fieldState) || isWatched;
      if (shouldSkipValidation) {
        !isBlurEvent && _subjects.watch.next({
          name,
          type
        });
        return shouldRender && _subjects.state.next(isWatched ? {
          name
        } : Object.assign(Object.assign({}, fieldState), {
          name
        }));
      }
      _subjects.state.next({
        isValidating: true
      });
      if (formOptions.resolver) {
        const {
          errors
        } = await executeResolver([name]);
        error = get(errors, name);
        if (isCheckBoxInput(target) && !error) {
          const parentNodeName = getNodeParentName(name);
          const valError = get(errors, parentNodeName, {});
          valError.type && valError.message && (error = valError);
          if (valError || get(_formState.errors, parentNodeName)) {
            name = parentNodeName;
          }
        }
        isValid = isEmptyObject(errors);
      } else {
        error = (await validateField(field, get(_formValues, name), isValidateAllFieldCriteria, formOptions.shouldUseNativeValidation))[name];
      }
      !isBlurEvent && _subjects.watch.next({
        name,
        type,
        values: getValues()
      });
      shouldRenderBaseOnError(false, name, error, fieldState, isValid, isWatched);
    }
  };
  const _updateValidAndInputValue = (name, ref, shouldSkipValueAs) => {
    const field = get(_fields, name);
    if (field) {
      const fieldValue = get(_formValues, name);
      const isValueUndefined = isUndefined(fieldValue);
      const defaultValue = isValueUndefined ? get(_defaultValues, name) : fieldValue;
      if (isUndefined(defaultValue) || ref && ref.defaultChecked || shouldSkipValueAs) {
        ref && ref.visible && set(_formValues, name, shouldSkipValueAs ? defaultValue : getFieldValue(field));
      } else {
        setFieldValue(name, defaultValue);
      }
    }
    _isMounted && _proxyFormState.isValid && _updateValid();
  };
  const _getIsDirty = (name, data) => {
    name && data && set(_formValues, name, data);
    return !deepEqual(Object.assign({}, getValues()), _defaultValues);
  };
  const _updateValid = async () => {
    const isValid = formOptions.resolver ? isEmptyObject((await executeResolver()).errors) : await validateForm(_fields, true);
    if (isValid !== _formState.isValid) {
      _formState.isValid = isValid;
      _subjects.state.next({
        isValid
      });
    }
  };
  const setValues = (name, value, options) => Object.entries(value).forEach(([fieldKey, fieldValue]) => {
    const fieldName = `${name}.${fieldKey}`;
    const field = get(_fields, fieldName);
    const isFieldArray = _names.array.has(name);
    (isFieldArray || !isPrimitive(fieldValue) || field && !field._f) && !isDateObject(fieldValue) ? setValues(fieldName, fieldValue, options) : setFieldValue(fieldName, fieldValue, options, true);
  });
  const _getWatch = (fieldNames, defaultValue, isGlobal) => {
    const fieldValues = Object.assign({}, _isMounted ? Object.assign({}, Object.assign(Object.assign({}, _defaultValues), _formValues)) : isUndefined(defaultValue) ? _defaultValues : defaultValue);
    if (!fieldNames) {
      isGlobal && (_names.watchAll = true);
      return fieldValues;
    }
    const resultChanges = [];
    const result = new Map();
    for (const fieldName of convertToArrayPayload(fieldNames)) {
      isGlobal && _names.watch.add(fieldName);
      resultChanges.push(get(fieldValues, fieldName));
      result.set(fieldName, get(fieldValues, fieldName));
    }
    return Array.isArray(fieldNames) ? [resultChanges, result] : isObject(result[0]) ? Object.assign({}, result[0]) : Array.isArray(result[0]) ? [...result[0]] : result[0];
  };
  const _updateFormValues = (defaultValues, name = '') => {
    console.log("dyno ;)", defaultValues, "_updateFormValues");
    for (const key in defaultValues) {
      const value = defaultValues[key];
      const fieldName = name + (name ? '.' : '') + key;
      const field = get(_fields, fieldName);
      if (!field || !field._f) {
        if (isObject(value) || Array.isArray(value)) {
          _updateFormValues(value, fieldName);
        } else if (!field) {
          set(_formValues, fieldName, value);
        }
      }
    }
  };
  const _bathFieldArrayUpdate = (keyName, name, method, args, updatedFieldArrayValues = [], shouldSet = true, shouldSetFields = true) => {
    _isInAction = true;
    if (shouldSetFields && get(_fields, name)) {
      const output = method(get(_fields, name), args.argA, args.argB);
      shouldSet && set(_fields, name, output);
    }
    set(_formValues, name, updatedFieldArrayValues);
    if (Array.isArray(get(_formState.errors, name))) {
      const output = method(get(_formState.errors, name), args.argA, args.argB);
      shouldSet && set(_formState.errors, name, output);
      unsetEmptyArray(_formState.errors, name);
    }
    if (_proxyFormState.touchedFields && get(_formState.touchedFields, name)) {
      const output = method(get(_formState.touchedFields, name), args.argA, args.argB);
      shouldSet && set(_formState.touchedFields, name, output);
      unsetEmptyArray(_formState.touchedFields, name);
    }
    if (_proxyFormState.dirtyFields || _proxyFormState.isDirty) {
      set(_formState.dirtyFields, name, setFieldArrayDirtyFields(omitKey(updatedFieldArrayValues, keyName), get(_defaultValues, name, []), get(_formState.dirtyFields, name, [])));
      updatedFieldArrayValues && set(_formState.dirtyFields, name, setFieldArrayDirtyFields(omitKey(updatedFieldArrayValues, keyName), get(_defaultValues, name, []), get(_formState.dirtyFields, name, [])));
      unsetEmptyArray(_formState.dirtyFields, name);
    }
    _subjects.state.next({
      isDirty: _getIsDirty(name, omitKey(updatedFieldArrayValues, keyName)),
      dirtyFields: _formState.dirtyFields,
      errors: _formState.errors,
      isValid: _formState.isValid
    });
  };
  const _getFieldArrayValue = name => get(_isMounted ? _formValues : _defaultValues, name, []);
  const setValue = (name, value, options = {}) => {
    const field = get(_fields, name);
    const isFieldArray = _names.array.has(name);
    set(_formValues, name, value);
    if (isFieldArray) {
      _subjects.array.next({
        values: value,
        name,
        isReset: true
      });
      if ((_proxyFormState.isDirty || _proxyFormState.dirtyFields) && options.shouldDirty) {
        set(_formState.dirtyFields, name, setFieldArrayDirtyFields(value, get(_defaultValues, name, []), get(_formState.dirtyFields, name, [])));
        _subjects.state.next({
          name,
          dirtyFields: _formState.dirtyFields,
          isDirty: _getIsDirty(name, value)
        });
      }
    } else {
      field && !field._f && !isNullOrUndefined(value) ? setValues(name, value, options) : setFieldValue(name, value, options, true);
    }
    isFieldWatched(name) && _subjects.state.next({});
    _subjects.watch.next({
      name
    });
  };
  const trigger = async (name, options = {}) => {
    const fieldNames = convertToArrayPayload(name);
    let isValid;
    _subjects.state.next({
      isValidating: true
    });
    if (formOptions.resolver) {
      const schemaResult = await executeResolverValidation(isUndefined(name) ? name : fieldNames);
      isValid = name ? fieldNames.every(name => !get(schemaResult, name)) : isEmptyObject(schemaResult);
    } else {
      if (name) {
        isValid = (await Promise.all(fieldNames.map(async fieldName => {
          const field = get(_fields, fieldName);
          return await validateForm(field._f ? {
            [fieldName]: field
          } : field);
        }))).every(Boolean);
      } else {
        await validateForm(_fields);
        isValid = isEmptyObject(_formState.errors);
      }
    }
    _subjects.state.next(Object.assign(Object.assign({}, isString(name) ? {
      name
    } : {}), {
      errors: _formState.errors,
      isValidating: false
    }));
    if (options.shouldFocus && !isValid) {
      focusFieldBy(_fields, key => get(_formState.errors, key), name ? fieldNames : _names.mount);
    }
    _proxyFormState.isValid && _updateValid();
    return isValid;
  };
  const triggerBackground = async (name, options = {}) => {
    const fieldNames = convertToArrayPayload(name);
    let isValid;
    console.log("dyno ;)", "trigger", _formState.errors);
    if (formOptions.resolver) {
      const schemaResult = await executeResolverValidation(isUndefined(name) ? name : fieldNames);
      isValid = name ? fieldNames.every(name => !get(schemaResult, name)) : isEmptyObject(schemaResult);
    } else {
      if (name) {
        isValid = (await Promise.all(fieldNames.map(async fieldName => {
          const field = get(_fields, fieldName);
          return await validateForm(field._f ? {
            [fieldName]: field
          } : field);
        }))).every(Boolean);
      } else {
        isValid = await validateForm(_fields, true);
      }
    }
    if (options.shouldFocus && !isValid) {
      focusFieldBy(_fields, key => get(_formState.errors, key), name ? fieldNames : _names.mount);
    }
    _proxyFormState.isValid && _updateValid();
    console.log("dyno ;)", "trigger", _formState.errors, "end");
    return isValid;
  };
  const getValues = fieldNames => {
    console.log("dyno ;)", _formValues, _fields, "fdfdfdfdfdfd");
    const values = Object.assign(Object.assign({}, _defaultValues), _formValues);
    return isUndefined(fieldNames) ? values : isString(fieldNames) ? get(values, fieldNames) : fieldNames.map(name => get(values, name));
  };
  const clearErrors = name => {
    name ? convertToArrayPayload(name).forEach(inputName => unset(_formState.errors, inputName)) : _formState.errors = {};
    _subjects.state.next({
      errors: _formState.errors
    });
  };
  const setError = (name, error, options) => {
    const ref = (get(_fields, name, {
      _f: {}
    })._f || {}).ref;
    set(_formState.errors, name, Object.assign(Object.assign({}, error), {
      ref
    }));
    _subjects.state.next({
      name,
      errors: _formState.errors,
      isValid: false
    });
    options && options.shouldFocus && ref && ref.focus && ref.focus();
  };
  const watch = (fieldName, defaultValue) => isFunction(fieldName) ? _subjects.watch.subscribe({
    next: info => fieldName(_getWatch(undefined, defaultValue), info)
  }) : _getWatch(fieldName, defaultValue, true);
  const unregister = (name, options = {}) => {
    for (const inputName of name ? convertToArrayPayload(name) : _names.mount) {
      _names.mount.delete(inputName);
      _names.array.delete(inputName);
      if (get(_fields, inputName)) {
        if (!options.keepValue) {
          unset(_fields, inputName);
          unset(_formValues, inputName);
        }
        !options.keepError && unset(_formState.errors, inputName);
        !options.keepDirty && unset(_formState.dirtyFields, inputName);
        !options.keepTouched && unset(_formState.touchedFields, inputName);
        !formOptions.shouldUnregister && !options.keepDefaultValue && unset(_defaultValues, inputName);
      }
    }
    _subjects.watch.next({});
    _subjects.state.next(Object.assign(Object.assign({}, _formState), !options.keepDirty ? {} : {
      isDirty: _getIsDirty()
    }));
    !options.keepIsValid && _updateValid();
  };
  const registerFieldRef = (name, fieldRef, options) => {
    register(name, options);
    let field = get(_fields, name);
    const ref = isUndefined(fieldRef.value) ? fieldRef.querySelectorAll ? fieldRef.querySelectorAll('input,select,textarea')[0] || fieldRef : fieldRef : fieldRef;
    const isRadioOrCheckbox = isRadioOrCheckboxFunction(ref);
    if (ref === field._f.ref || isRadioOrCheckbox && compact(field._f.refs || []).find(option => option === ref)) {
      return;
    }
    field = {
      _f: isRadioOrCheckbox ? Object.assign(Object.assign({}, field._f), {
        refs: [...compact(field._f.refs || []).filter(ref => isHTMLElement(ref) && document.contains(ref)), ref],
        ref: {
          type: ref.type,
          name
        }
      }) : Object.assign(Object.assign({}, field._f), {
        ref
      })
    };
    set(_fields, name, field);
    _updateValidAndInputValue(name, ref);
  };
  const register = (name, options = {}) => {
    const field = get(_fields, name);
    set(_fields, name, {
      _f: Object.assign(Object.assign(Object.assign({}, field && field._f ? field._f : {
        ref: {
          name
        }
      }), {
        name,
        mount: true
      }), options)
    });
    console.log("dyno ;)", Object.assign(Object.assign(Object.assign({}, field && field._f ? field._f : {
      ref: {
        name
      }
    }), {
      name,
      mount: true
    }), options), "registerRegister after", field, name, _fields);
    if (options.value) {
      set(_formValues, name, options.value);
    }
    if (!isUndefined(options.disabled) && field && field._f && field._f.ref.disabled !== options.disabled) {
      set(_formValues, name, options.disabled ? undefined : field._f.ref.value);
    }
    _names.mount.add(name);
    !field && _updateValidAndInputValue(name, undefined, true);
    return isWindowUndefined ? {
      name: name
    } : Object.assign(Object.assign({
      name
    }, isUndefined(options.disabled) ? {} : {
      disabled: options.disabled
    }), {
      onChange: handleChange,
      onBlur: handleChange,
      ref: ref => {
        if (ref) {
          registerFieldRef(name, ref, options);
        } else {
          const field = get(_fields, name, {});
          const _shouldUnregister = formOptions.shouldUnregister || options.shouldUnregister;
          if (field._f) {
            field._f.mount = false;
          }
          _shouldUnregister && !(isNameInFieldArray(_names.array, name) && _isInAction) && _names.unMount.add(name);
        }
      }
    });
  };
  const handleSubmit = (onValid, onInvalid) => async e => {
    if (e) {
      e.preventDefault && e.preventDefault();
      e.persist && e.persist();
    }
    let hasNoPromiseError = true;
    let fieldValues = Object.assign({}, _formValues);
    _subjects.state.next({
      isSubmitting: true
    });
    try {
      if (formOptions.resolver) {
        const {
          errors,
          values
        } = await executeResolver();
        _formState.errors = errors;
        fieldValues = values;
      } else {
        await validateForm(_fields);
      }
      if (isEmptyObject(_formState.errors) && Object.keys(_formState.errors).every(name => get(fieldValues, name))) {
        _subjects.state.next({
          errors: {},
          isSubmitting: true
        });
        await onValid(fieldValues, e);
      } else {
        onInvalid && (await onInvalid(_formState.errors, e));
        formOptions.shouldFocusError && focusFieldBy(_fields, key => get(_formState.errors, key), _names.mount);
      }
    } catch (err) {
      hasNoPromiseError = false;
      throw err;
    } finally {
      _formState.isSubmitted = true;
      _subjects.state.next({
        isSubmitted: true,
        isSubmitting: false,
        isSubmitSuccessful: isEmptyObject(_formState.errors) && hasNoPromiseError,
        submitCount: _formState.submitCount + 1,
        errors: _formState.errors
      });
    }
  };
  const reset = (values, keepStateOptions = {}) => {
    const updatedValues = values || _defaultValues;
    if (isWeb && !keepStateOptions.keepValues) {
      for (const name of _names.mount) {
        const field = get(_fields, name);
        if (field && field._f) {
          const inputRef = Array.isArray(field._f.refs) ? field._f.refs[0] : field._f.ref;
          try {
            isHTMLElement(inputRef) && inputRef.closest('form').reset();
            break;
          } catch (_a) {}
        }
      }
    }
    if (!keepStateOptions.keepDefaultValues) {
      _defaultValues = Object.assign({}, updatedValues);
      _formValues = Object.assign({}, updatedValues);
    }
    if (!keepStateOptions.keepValues) {
      _fields = {};
      _formValues = {};
      _subjects.control.next({
        values: keepStateOptions.keepDefaultValues ? _defaultValues : Object.assign({}, updatedValues)
      });
      _subjects.watch.next({});
      _subjects.array.next({
        values: Object.assign({}, updatedValues),
        isReset: true
      });
    }
    _names = {
      mount: new Set(),
      unMount: new Set(),
      array: new Set(),
      watch: new Set(),
      watchAll: false
    };
    _subjects.state.next({
      submitCount: keepStateOptions.keepSubmitCount ? _formState.submitCount : 0,
      isDirty: keepStateOptions.keepDirty ? _formState.isDirty : keepStateOptions.keepDefaultValues ? deepEqual(values, _defaultValues) : false,
      isSubmitted: keepStateOptions.keepIsSubmitted ? _formState.isSubmitted : false,
      dirtyFields: keepStateOptions.keepDirty ? _formState.dirtyFields : {},
      touchedFields: keepStateOptions.keepTouched ? _formState.touchedFields : {},
      errors: keepStateOptions.keepErrors ? _formState.errors : {},
      isSubmitting: false,
      isSubmitSuccessful: false
    });
    _isMounted = !!keepStateOptions.keepIsValid;
  };
  const setFocus = name => get(_fields, name)._f.ref.focus();
  return {
    control: {
      register,
      unregister,
      _getIsDirty,
      _getWatch,
      _updateValid,
      _updateFormValues,
      _bathFieldArrayUpdate,
      _getFieldArrayValue,
      _subjects,
      _shouldUnregister: formOptions.shouldUnregister,
      _fields,
      _proxyFormState,
      get _formValues() {
        return _formValues;
      },
      set _formValues(value) {
        _formValues = value;
      },
      get _isMounted() {
        return _isMounted;
      },
      set _isMounted(value) {
        _isMounted = value;
      },
      get _defaultValues() {
        return _defaultValues;
      },
      set _defaultValues(value) {
        _defaultValues = value;
      },
      get _names() {
        return _names;
      },
      set _names(value) {
        _names = value;
      },
      _isInAction: {
        get val() {
          return _isInAction;
        },
        set val(value) {
          _isInAction = value;
        }
      },
      _formState: {
        get val() {
          return _formState;
        },
        set val(value) {
          _formState = value;
        }
      },
      _updateProps: options => {
        formOptions = Object.assign(Object.assign({}, defaultOptions), options);
      }
    },
    trigger,
    triggerBackground,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    clearErrors,
    unregister,
    setError,
    setFocus
  };
}

var live = (ref => !isHTMLElement(ref) || !document.contains(ref));

function useForm(props = {}) {
  const _formControl = useRef();
  const [formState, updateFormState] = useState({
    isDirty: false,
    isValidating: false,
    dirtyFields: {},
    isSubmitted: false,
    submitCount: 0,
    touchedFields: {},
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    errors: {}
  });
  if (_formControl.current) {
    _formControl.current.control._updateProps(props);
  } else {
    _formControl.current = Object.assign(Object.assign({}, createFormControlV3(props)), {
      formState
    });
  }
  const control = _formControl.current.control;
  useEffect(() => {
    const formStateSubscription = control._subjects.state.subscribe({
      next(formState) {
        if (shouldRenderFormState(formState, control._proxyFormState, true)) {
          control._formState.val = Object.assign(Object.assign({}, control._formState.val), formState);
          updateFormState(Object.assign({}, control._formState.val));
        }
      }
    });
    const useFieldArraySubscription = control._subjects.array.subscribe({
      next(state) {
        if (state.values && state.name && control._proxyFormState.isValid) {
          set(control._formValues, state.name, state.values);
          control._updateValid();
        }
      }
    });
    return () => {
      formStateSubscription.unsubscribe();
      useFieldArraySubscription.unsubscribe();
    };
  }, [control]);
  useEffect(() => {
    const unregisterFieldNames = [];
    if (!control._isMounted) {
      control._isMounted = true;
      control._proxyFormState.isValid && control._updateValid();
      !props.shouldUnregister && control._updateFormValues(control._defaultValues);
    }
    for (const name of control._names.unMount) {
      const field = get(control._fields, name);
      field && (field._f.refs ? field._f.refs.every(live) : live(field._f.ref)) && unregisterFieldNames.push(name);
    }
    console.log("dyno ;)", unregisterFieldNames, 'unregisterFieldNames', control._names, control);
    unregisterFieldNames.length && _formControl.current.unregister(unregisterFieldNames);
    control._names.unMount = new Set();
  });
  _formControl.current.formState = getProxyFormState(formState, control._proxyFormState);
  return _formControl.current;
}

function useWatch(props) {
  const methods = useFormContext();
  const {
    control = methods.control,
    name,
    defaultValue,
    disabled
  } = props || {};
  const _name = useRef(name);
  _name.current = name;
  const [value, updateValue] = useState(isUndefined(defaultValue) ? control._getWatch(name) : defaultValue);
  useEffect(() => {
    const watchSubscription = control._subjects.watch.subscribe({
      next: ({
        name
      }) => {
        console.log("dyno ;)", "##1 watchSubscription", name);
        return (!_name.current || !name || convertToArrayPayload(_name.current).some(fieldName => name && fieldName && (fieldName.startsWith(name) || name.startsWith(fieldName)))) && updateValue(control._getWatch(_name.current, defaultValue));
      }
    });
    disabled && watchSubscription.unsubscribe();
    return () => watchSubscription.unsubscribe();
  }, [disabled, control, defaultValue]);
  return value;
}

const rebuildHistory = (history = {}, to = 0, from = 0) => {
  const newHistory = [...history].slice(from, to);
  console.log("dyno ;)", 'rebuildHistory', newHistory, to);
  return new Set(newHistory);
};
function useHistory(init = {
  name: ""
}) {
  const [states, setStates] = useState(init);
  const [history, updateHistory] = useState(new Set());
  const [index, setIndex] = useState(0);
  const [currentPage, updateCurrentPage] = useState(init === null || init === void 0 ? void 0 : init.name);
  const state = useMemo(() => states[currentPage], [index, currentPage]);
  const setState = value => {
    if (value === undefined || value === null || value === {}) return;
    const pageName = value.name;
    const existing = _.get(states, pageName);
    if (history.has(pageName)) {
      const newHistory = rebuildHistory(history, existing["x-index"]);
      updateHistory(newHistory);
      const _copy = _.cloneDeep(_.set(states, pageName, {
        ...value,
        "x-index": existing["x-index"]
      }));
      setStates(_copy);
      setIndex(existing["x-index"]);
      updateCurrentPage(pageName);
      console.log("dyno ;)", "lolllllllllllllllllll", history, '99999', existing["x-index"], newHistory);
      return;
    }
    console.log("dyno ;)", "histlori", value, _.set(states, pageName, value), state, history.size);
    const newIndex = index + 1;
    const copy = _.cloneDeep(_.set(states, pageName, {
      ...value,
      "x-index": newIndex
    }));
    setIndex(newIndex);
    updateHistory(history.add(pageName));
    setStates(copy);
    updateCurrentPage(pageName);
    console.log("dyno ;)", 'hissssstory', history);
    console.log("dyno ;)", value, 'drooooomemppppppphistlori', existing);
    console.log("dyno ;)", states, '31231232323132', state, currentPage, _.isEqual(existing, value));
  };
  const resetState = (init = {
    name: ""
  }) => {
    setIndex(0);
    setStates({});
    updateHistory([]);
    console.log("dyno ;)", ":::::resetState", history, states, index);
  };
  const goBack = (steps = 1, reset = false) => {
    if (Number(steps)) {
      goBackByIndex(steps, reset);
      return;
    }
    console.log("dyno ;)", 'gobackbyname', steps);
    if (!states[steps]) {
      throw "gobackbyname is not available ;)";
    }
    goBackByName(steps, reset);
  };
  const goBackByIndex = (steps = 1, reset = false) => {
    console.log("dyno ;)", steps, 'stepsssssss');
    const newIndex = Math.max(0, Number(index) - (Number(steps) || 1));
    const previousPageName = Object.keys(states)[newIndex - 1];
    console.log("dyno ;)", Math.max(0, Number(index) - (Number(steps) || 1)), 'drooooomempppppppdrooooo45678mempppppppdrooooomemppppppp', index, previousPageName, states[previousPageName]);
    updateCurrentPage(previousPageName);
    setIndex(newIndex);
    if (reset) {
      const existingPage = _.get(states, previousPageName);
      const newHistory = rebuildHistory(history, newIndex);
      updateHistory(newHistory);
      console.log("dyno ;)", previousPageName, newIndex, 'resetHardddddddd', history, newHistory, existingPage["x-index"]);
    }
  };
  const goBackByName = (steps = 1, reset = false) => {
    console.log("dyno ;)", steps, 'stepsssssss');
    const existingPage = _.get(states, steps);
    const newIndex = Math.max(0, Number(index) - (Number(steps) || 1));
    const previousPageName = Object.keys(states)[newIndex - 1];
    console.log("dyno ;)", Math.max(0, Number(index) - (Number(steps) || 1)), 'drooooomempppppppdrooooo45678mempppppppdrooooomemppppppp', index, previousPageName, states[previousPageName]);
    updateCurrentPage(previousPageName);
    setIndex(newIndex);
    if (reset) {
      const _existingPage = _.get(states, previousPageName);
      const newHistory = rebuildHistory(history, newIndex);
      updateHistory(newHistory);
      console.log("dyno ;)", previousPageName, newIndex, 'resetHardddddddd', history, newHistory, _existingPage["x-index"]);
    }
  };
  const goForward = (steps = 1) => {
    setIndex(Math.min(states.length - 1, Number(index) + (Number(steps) || 1)));
  };
  const updatePage = value => {
    const existing = _.get(states, currentPage);
    existing.defaultValues = {
      ...value
    };
    console.log("dyno ;)", value, 'updatePage youuuuupppp', existing);
  };
  return {
    state: state,
    setState: setState,
    resetState: resetState,
    currentPage,
    index: index,
    lastIndex: (states === null || states === void 0 ? void 0 : states.length) - 1 || 0,
    goBack: goBack,
    goForward: goForward,
    updatePage: updatePage,
    history
  };
}

const jsonataOriginal = require('jsonata');
const htmltotext = (value, options) => {
  return `${value} yasserrrrrrrr`;
};
const registerWithJSONATA = expression => {
  if (typeof expression === 'undefined' || typeof expression.registerFunction === 'undefined') {
    throw new TypeError('Invalid JSONata Expression');
  }
  expression.registerFunction('htmltotext', (value, options) => htmltotext(value), '<s?o?:s>');
};
function jsonataExtended(expr, options) {
  const expression = jsonataOriginal(expr, options);
  registerWithJSONATA(expression);
  return expression;
}

async function transformer(data, schema) {
  const expression = jsonataExtended(schema);
  const result = await expression.evaluate(data);
  return result;
}

const useDynamoHistory = (initialArr, field, id, preventDuplicates = false, replaceDuplicate = false) => {
  if (!Array.isArray(initialArr)) {
    throw new Error('initialArr must be an array.');
  }
  const [history, setHistory] = useState(initialArr);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (history.length === 0) {
      setCurrentIndex(0);
    } else {
      const newIndex = history.findIndex(e => e[field] === id);
      setCurrentIndex(newIndex >= 0 ? newIndex : 0);
    }
  }, [id]);
  useEffect(() => {
    if (history.length > 0 && !history[0].type) {
      setHistory(prevHistory => {
        const updatedFirstObj = {
          ...prevHistory[0],
          type: 'primary'
        };
        return [updatedFirstObj, ...prevHistory.slice(1)];
      });
    }
  }, [history]);
  const getNextIndex = () => currentIndex + 1 >= history.length ? false : currentIndex + 1;
  const getPreviousIndex = () => currentIndex - 1 < 0 ? false : currentIndex - 1;
  const next = () => {
    if (history.length === 0) return false;
    const nextIndex = getNextIndex();
    return nextIndex !== false ? history[nextIndex] : false;
  };
  const current = () => currentIndex >= 0 && currentIndex < history.length ? history[currentIndex] : false;
  const previous = () => {
    if (history.length === 0) return false;
    const previousIndex = getPreviousIndex();
    return previousIndex !== false ? history[previousIndex] : false;
  };
  const goToStart = () => {
    if (history.length === 0) return;
    setCurrentIndex(0);
  };
  const goTo = (newId, removeAfter = false) => {
    if (history.length === 0) return;
    const newIndex = history.findIndex(e => e[field] === newId);
    if (newIndex >= 0) {
      setCurrentIndex(newIndex);
      if (removeAfter) {
        removeAfterIndex(newIndex);
      }
    }
  };
  const goNext = () => {
    if (history.length === 0) return;
    const nextIndex = getNextIndex();
    if (nextIndex !== false) {
      setCurrentIndex(nextIndex);
    }
  };
  const goToIndex = (index, removeAfter = false) => {
    if (history.length === 0) return;
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index);
      if (removeAfter) {
        removeAfterIndex(index);
      }
    }
  };
  const goBack = (removeAfter = false) => {
    if (history.length === 0) return;
    const previousIndex = getPreviousIndex();
    if (previousIndex !== false) {
      setCurrentIndex(previousIndex);
      if (removeAfter) {
        removeAfterIndex(previousIndex);
      }
    }
  };
  const goBackToPrimary = (removeAfter = false, skipSecondary = true) => {
    if (history.length === 0) return;
    let previousIndex = currentIndex - 1;
    if (skipSecondary) {
      while (previousIndex >= 0 && history[previousIndex].type === 'secondary') {
        previousIndex--;
      }
    }
    if (previousIndex >= 0) {
      setCurrentIndex(previousIndex);
      if (removeAfter) {
        removeAfterIndex(previousIndex);
      }
    }
  };
  const goForwardToType = (removeAfter = false, skipSecondary = true, type = "primary") => {
    if (history.length === 0) return;
    let nextIndex = currentIndex + 1;
    if (skipSecondary) {
      while (nextIndex < history.length && history[nextIndex].type !== type) {
        nextIndex++;
      }
    }
    if (nextIndex < history.length) {
      setCurrentIndex(nextIndex);
      if (removeAfter) {
        removeAfterIndex(nextIndex);
      }
    }
  };
  const goToEnd = () => {
    if (history.length === 0) return;
    setCurrentIndex(history.length - 1);
  };
  const insertObjectAtIndex = (object, insertIndex) => {
    if (insertIndex > history.length) return;
    const newArray = [...history];
    newArray.splice(insertIndex, 0, object);
    setHistory(newArray);
    setCurrentIndex(insertIndex);
  };
  const insertObject = (object, insertIndex, customIgnoreDuplicates = false, customReplaceDuplicate = undefined) => {
    if (preventDuplicates && !customIgnoreDuplicates) {
      const existingIndex = history.findIndex(e => e[field] === object[field]);
      if (existingIndex !== -1) {
        if (customReplaceDuplicate !== undefined ? customReplaceDuplicate : replaceDuplicate) {
          const newArray = [...history];
          newArray[existingIndex] = object;
          setHistory(newArray);
          setCurrentIndex(existingIndex);
        } else {
          setCurrentIndex(existingIndex);
        }
        return;
      }
    }
    const previousObject = previous();
    const objectType = previousObject && previousObject.type === 'primary' ? 'secondary' : 'primary';
    const objectWithDefaultType = {
      ...object,
      ...(!object.type && {
        type: objectType
      })
    };
    if (insertIndex !== undefined) {
      insertObjectAtIndex(objectWithDefaultType, insertIndex);
    } else {
      setHistory([...history, objectWithDefaultType]);
      setCurrentIndex(history.length);
    }
  };
  const updateCurrent = updatedObject => {
    if (history.length === 0) return;
    if (currentIndex === 0 && updatedObject.type === 'secondary') {
      updatedObject.type = 'primary';
    }
    const updatedArray = [...history];
    updatedArray[currentIndex] = updatedObject;
    setHistory(updatedArray);
  };
  const updateObjectById = updatedObject => {
    if (history.length === 0) return;
    if (currentIndex === 0 && updatedObject.type === 'secondary') {
      updatedObject.type = 'primary';
    }
    const index = history.findIndex(e => e[field] === updatedObject[field]);
    if (index !== -1) {
      const updatedArray = [...history];
      updatedArray[index] = updatedObject;
      setHistory(updatedArray);
    }
  };
  const removeObjectByIndex = removeIndex => {
    if (removeIndex >= 0 && removeIndex < history.length) {
      const newArray = [...history];
      newArray.splice(removeIndex, 1);
      setHistory(newArray);
      if (removeIndex < currentIndex) {
        setCurrentIndex(currentIndex - 1);
      }
      if (currentIndex >= history.length - 1) {
        setCurrentIndex(history.length - 2);
      }
    }
  };
  const removeObjectByName = removeName => {
    const removeIndex = history.findIndex(e => e[field] === removeName);
    removeObjectByIndex(removeIndex);
  };
  const removeAtIndex = index => {
    if (index >= 0 && index < history.length) {
      const newArr = [...history];
      newArr.splice(index, 1);
      setHistory(newArr);
      if (currentIndex >= history.length) {
        setCurrentIndex(history.length > 0 ? history.length - 1 : 0);
      }
    }
  };
  const removeByName = name => {
    const index = history.findIndex(e => e[field] === name);
    if (index !== -1) {
      removeAtIndex(index);
    }
  };
  const removeFirst = () => {
    if (history.length > 0) {
      removeAtIndex(0);
    }
  };
  const removeLast = () => {
    if (history.length > 0) {
      removeAtIndex(history.length - 1);
    }
  };
  const removeAll = () => {
    setHistory([]);
    setCurrentIndex(0);
  };
  const removeAfterIndex = index => {
    if (index >= 0 && index < history.length - 1) {
      const newArr = [...history];
      newArr.splice(index + 1);
      setHistory(newArr);
      if (currentIndex >= history.length) {
        setCurrentIndex(history.length > 0 ? history.length - 1 : 0);
      }
    }
  };
  const getHistory = () => {
    const historyDict = {};
    history.forEach((obj, index) => {
      const objId = obj[field];
      historyDict[objId] = obj;
    });
    return historyDict;
  };
  return {
    history,
    currentIndex,
    next,
    current,
    previous,
    goToStart,
    goTo,
    goNext,
    goToIndex,
    goBack,
    goToEnd,
    insertObject,
    insertObjectAtIndex,
    removeAtIndex,
    removeByName,
    removeFirst,
    removeLast,
    removeAll,
    removeAfterIndex,
    removeObjectByIndex,
    removeObjectByName,
    updateCurrent,
    goBackToPrimary,
    updateObjectById,
    goForwardToType,
    getHistory
  };
};

const dataTransformer = (data, name, obj) => local => {
  const {
    getValues,
    dataStore,
    index = 1
  } = local.sharedItems || {
    getValues: undefined
  };
  const values = {
    ...dataStore,
    ...(getValues && getValues() || {}),
    index,
    displayIndex: index + 1
  };
  if (typeof data === "string") {
    const ExpRE = /^\s*\{\{([\s\S]*)\}\}\s*$/;
    const matched = data.match(ExpRE);
    if (matched) {
      console.log("dyno ;)", name, 'me getValues()()()');
      try {
        const result = new Function('root', `return root.${matched[1]}`)({
          ...values,
          local
        });
        return result;
      } catch (error) {
        console.log(error, '{{ error transformer }}');
        return data;
      }
    }
    if (data !== undefined && data.includes("$$")) {
      console.log("dyno ;)", "blaherebla", data, dataStore, _.get(values, data.substring(2)));
      return _.get(values, data.substring(2));
    }
    if (data !== undefined && data.includes("fx")) {
      console.log("dyno ;)", data.slice(2), 'sliceeeeeee');
      try {
        const result = new Function('root', `return root.${data.slice(2)}`)({
          ...values,
          local
        });
        if (typeof result === 'function') {
          console.log("dyno ;)", result, 'rrrrrrrsulttttttttt function');
          return result(values);
        }
        if (result !== null && result !== void 0 && result.then) {
          console.log("dyno ;)", result, 'rrrrrrrsulttttttttt function.then');
          return result.then(function (response) {
            console.log("dyno ;)", response, 'rrrrrrrsulttttttttt [2] function.then result');
            return response;
          });
        }
        console.log("dyno ;)", result, 'rrrrrrrsulttttttttt [3] function.then lol');
        return result;
      } catch (error) {
        console.log("dyno ;)", name, '----->', error, 'rrrrrrrsulttttttttt errorororrororor');
      }
    }
    let patternResult = data;
    if (data !== undefined && data.includes("dx")) {
      patternResult = patternResult.replace(/dx.*?\(.*?\)/g, (_, name) => {
        try {
          console.log("dyno ;)", _, name, 'pattern waaaaaalalala 2nd', patternResult);
          const result = eval(`local.${_}`);
          if (typeof result === 'function') {
            return result(values);
          }
          return result;
        } catch (error) {
          console.log("dyno ;)", error, 'dxxxxxxxxxxxxdxdxxdxdxx');
          return _;
        }
      });
    }
    patternResult = patternResult.replace(/\$\{(.*?)\}/g, (w, name) => {
      const result = _.get(values, name) || '';
      return result !== undefined && result;
    });
    return patternResult;
  }
  return data;
};

const schemaTransformation = (data, name, obj) => local => {
  const values = {
    ...obj.sharedItems
  };
  if (data === undefined || data === null) return data;
  if (typeof data === "string") {
    if (data !== undefined && data.includes("fx")) {
      try {
        const result = eval(`extraFunctions.${data.slice(2)}`);
        if (typeof result === "function") {
          return result(values);
        }
        return result;
      } catch (error) {
        console.log("dyno ;)", error, "rrrrrrrsulttttttttt errorororrororor");
      }
    }
    if (data !== "") {
      const result = _.get(values, data.substring(2)) ?? data;
      return result;
    }
  }
  return data;
};

const flattenHelper = (currentObject, newObject, previousKeyName) => {
  for (let key in currentObject) {
    let value = currentObject[key];
    if ((value === null || value === void 0 ? void 0 : value.constructor) !== Object) {
      if (previousKeyName == null || previousKeyName == "") {
        newObject[key] = value;
      } else {
        if (key == null || key == "") {
          newObject[previousKeyName] = value;
        } else {
          newObject[previousKeyName + "." + key] = value;
        }
      }
    } else {
      if (previousKeyName == null || previousKeyName == "") {
        flattenHelper(value, newObject, key);
      } else {
        flattenHelper(value, newObject, previousKeyName + "." + key);
      }
    }
  }
};
const flattenObject = oldObject => {
  const newObject = {};
  flattenHelper(oldObject, newObject, "");
  return newObject;
};

const schemaProxy = (item, extraValues = {}, extraFunctions = {}) => {
  if (item === undefined) return {};
  const proxyHandler = {
    get(target, prop, receiver) {
      if (typeof target[prop] === "object" && target[prop] !== null) {
        console.log("dyno ;)", target[prop], "proxyHanlerrrrrrrr ;)");
        return new Proxy(target[prop], proxyHandler);
      } else {
        return schemaTransformation(target[prop], prop, target)({
          ...extraFunctions
        });
      }
    }
  };
  const proxySchema = new Proxy({
    ...flattenObject({
      ...item.action.schema
    }),
    sharedItems: {
      ...extraValues,
      ...item
    }
  }, proxyHandler);
  return proxySchema;
};

const setupProxy = (item, extraValues = {}, extraFunctions = {}) => {
  const proxyItems = schemaProxy(item, extraValues, extraFunctions);
  let newSchema = {};
  const y = Object.keys(proxyItems).map(el => {
    if (el === "sharedItems") return;
    newSchema = _.set(newSchema, el, proxyItems[el]);
    console.log("dyno ;)", el, "flattttttttten");
  });
  return _.cloneDeep(newSchema);
};

function actionsRunner(action, localFunction, item, dataStore) {
  let resultPromise = Promise.resolve(item);
  for (const functionName in action) {
    const config = action[functionName];
    const asyncFunction = localFunction[functionName];
    resultPromise = resultPromise.then(result => {
      console.log(functionName, asyncFunction, 'dyno actionsRunner', result);
      return asyncFunction(config)(dataStore)(result);
    });
  }
  return resultPromise;
}

const defaultValidationResolver = {
  noteq: async (item, value) => {
    return value !== '' && !item.value.includes(value) || false;
  },
  eq: async (item, value) => {
    return (value === null || value === void 0 ? void 0 : value.toString()) === item.value;
  },
  notEmptyAndEqual: async (item, value) => {
    return value !== '' && item.value.includes(value) || false;
  }
};

const ControlledComponentsV2 = props => {
  var _props$errors;
  const [field, setField] = useState(props.control.current && props.control.current[props.name]);
  console.log("dyno ;)", props.name, 'ControlledComponentsV2 renderrrrrrrrrr <1>', field, props.errors, props.name);
  const error = props.errors && props.errors.current && ((_props$errors = props.errors) === null || _props$errors === void 0 ? void 0 : _props$errors.current[props.name]);
  const [fields, setFields] = useState('');
  const onChange = value => {
    console.log("dyno ;)", 'valuelavue', value);
    props.updateReference(value, props.name);
    setField({
      ...field,
      value: value
    });
  };
  return props.render({
    onChange,
    value: field.value,
    field,
    error,
    index: props.index
  });
};
const IIN = React__default.memo(props => /*#__PURE__*/React__default.createElement(ControlledComponentsV2, props), (prevProps, nextProps) => {
  var _prevProps$errors, _prevProps$errors2, _nextProps$errors, _nextProps$errors2;
  const oldE = ((_prevProps$errors = prevProps.errors) === null || _prevProps$errors === void 0 ? void 0 : _prevProps$errors.current) && ((_prevProps$errors2 = prevProps.errors) === null || _prevProps$errors2 === void 0 ? void 0 : _prevProps$errors2.current[prevProps.name]) || {};
  const newE = ((_nextProps$errors = nextProps.errors) === null || _nextProps$errors === void 0 ? void 0 : _nextProps$errors.current[nextProps.name]) || {};
  const errror = _.isEqual(oldE, newE);
  const errrorlol = (_nextProps$errors2 = nextProps.errors) === null || _nextProps$errors2 === void 0 ? void 0 : _nextProps$errors2.current[prevProps.name];
  console.log("dyno ;)", prevProps, nextProps, prevProps.name + ' ControlledComponentsV2 renderrrrrrrrrr <2>', errror, 'is===', errrorlol, prevProps.name);
  if (JSON.stringify(nextProps) === JSON.stringify(prevProps)) {
    return true;
  }
  return false;
});
const renderForm = (data, updateReference, myControl, getValue, errors, ControlledComponents, components, managedCallback, parentName, sharedItems, setValue) => {
  console.log("dyno ;)", errors, 'dataerrors');
  const r = data.filter(element => element.visible).map((item, index) => {
    const {
      register,
      handleSubmit,
      watch,
      errors,
      control,
      trigger,
      setFocus,
      getValues,
      setValue,
      useFieldArray,
      useWatch,
      triggerBackground
    } = sharedItems;
    const name = parentName && `${parentName}.${item.name}` || item.name;
    let result = null;
    let child = [];
    if (item.items) {
      child = renderForm(item.items, updateReference, myControl, getValue, errors, ControlledComponents, components, managedCallback, (item === null || item === void 0 ? void 0 : item.items) && name || undefined, sharedItems);
    }
    const validation = {
      maxLength: item.maxLength && item.maxLength.value !== "" && item.maxLength || undefined,
      minLength: item.minLength && item.minLength.value !== "" && item.minLength || undefined,
      max: item.max && item.max.value !== "" && item.max || undefined,
      min: item.min && item.min.value !== "" && item.min || undefined,
      pattern: item.pattern && item.pattern.value !== "" && item.pattern || undefined,
      required: item.required && item.required.value !== "" && item.required || undefined
    };
    result = /*#__PURE__*/React__default.createElement(Controller, {
      key: item.isArray === true && `${name}container` || name,
      name: item.isArray === true && `${name}container` || name,
      control: control,
      item: item,
      rules: item.rule || validation,
      render: ({
        field
      }) => {
        if (item.isArray) {
          const {
            fields,
            append,
            remove
          } = useFieldArray({
            control,
            name: name
          });
          child = /*#__PURE__*/React__default.createElement(Fragment, null, /*#__PURE__*/React__default.createElement("ul", null, fields.map((el, index) => /*#__PURE__*/React__default.createElement("li", {
            key: el.id
          }, item.items.map((element, indx) => /*#__PURE__*/React__default.createElement(Controller, {
            name: `${name}.${index}.${element.name}`,
            control: control,
            render: ({
              field
            }) => {
              const Component = components(element.type, {
                field,
                item: element,
                name: `${name}.${index}.${element.name}`,
                indx,
                managedCallback,
                child,
                useFieldArray
              });
              return Component;
            }
          })), /*#__PURE__*/React__default.createElement("button", {
            type: "button",
            onClick: () => remove(index)
          }, "-")))), /*#__PURE__*/React__default.createElement("button", {
            type: "button",
            onClick: () => append({})
          }, "+"));
        }
        const Component = components(item.type, {
          field,
          item,
          name,
          index,
          managedCallback,
          child,
          useFieldArray,
          error: errors,
          sharedItems
        });
        return Component;
      }
    });
    return result;
  });
  return r;
};
const RenderForm = (data, updateReference, myControl, getValue, errors, ControlledComponents, components, managedCallback, parentName, control, setValue) => {
  console.log("dyno ;)", errors, 'dataerrors');
  if (data === undefined) return null;
  const r = data.filter(element => element.visible).map((item, index) => {
    const name = parentName && `${parentName}.${item.name}` || item.name;
    let result = null;
    let child = [];
    if (item.items) {
      child = RenderForm(item.items, updateReference, myControl, getValue, errors, ControlledComponents, components, managedCallback, (item === null || item === void 0 ? void 0 : item.items) && name || undefined, control);
    }
    result = /*#__PURE__*/React__default.createElement(Controller, {
      key: name,
      name: name,
      control: control,
      item: item,
      rules: item.rule || {},
      render: ({
        field
      }) => {
        const Component = components(item.type, {
          field,
          item,
          name,
          index,
          managedCallback
        });
        return Component;
      }
    });
    return result;
  });
  return r;
};
const InRenderform = React__default.memo(props => RenderForm(props), (prevProps, nextProps) => {
  if (!deepEqual(nextProps, prevProps)) {
    return true;
  }
  return false;
});
InRenderform.displayName = "RenderForm";
InRenderform.whyDidYouRender = true;
const convertIdToRef = (array, key, name, parent, isArray) => {
  const result = array.reduce((obj, item, currentIndex) => {
    const itemName = isArray === undefined && item[key] || `${parent}.0.${item[key]}`;
    const refId = name && `${name}.items[${currentIndex}]` || `[${currentIndex}]`;
    return {
      ...obj,
      [itemName]: {
        ...item,
        name: itemName,
        refId,
        ...(parent && {
          parent
        })
      },
      ...(item.items !== undefined && convertIdToRef(item.items, 'name', refId, item[key], item.isArray))
    };
  }, new Map());
  return result;
};
const resetItems = (array, key, name, parent) => {
  const result = array.reduce((obj, item, currentIndex) => {
    const refId = name && `${name}.items[${currentIndex}]` || `[${currentIndex}]`;
    return {
      ...obj,
      [item[key]]: {
        ...item,
        refId,
        value: "",
        ...(parent && {
          parent
        })
      },
      ...(item.items !== undefined && convertIdToRef(item.items, 'name', refId, item[key]))
    };
  }, new Map());
  return result;
};
const prepareWtchingComponents = (items, key) => {
  const initialValue = new Map();
  Object.keys(items).forEach(key => {
    if (items[key].preCondition) {
      const preConditionObj = convertArrayToObject(items[key].preCondition, 'value');
      const keys = Object.keys(preConditionObj);
      for (let index = 0; index < keys.length; index++) {
        const internalItem = preConditionObj[keys[index]];
        initialValue.set(internalItem.name, [...(initialValue.get(internalItem.name) && initialValue.get(internalItem.name) || []), {
          refId: items[key].refId,
          ...internalItem
        }]);
      }
    }
  });
  return initialValue;
};
const convertArrayToObject = (array, key, value) => {
  const initialValue = {};
  if (!Array.isArray(array)) return;
  const givenArray = array.concat();
  return givenArray.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: value && item[value] || value === undefined && item || ''
    };
  }, initialValue);
};
let renderCount = 0;
const FormBuilderV1 = React__default.forwardRef(({
  items,
  validationResolver: _validationResolver = defaultValidationResolver,
  ControlledComponents,
  components,
  managedCallback,
  defaultValues: _defaultValues = {}
}, ref) => {
  console.log("dyno ;)", _defaultValues, "defaultValues");
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors
    },
    control,
    trigger,
    setFocus,
    getValues,
    setValue,
    triggerBackground
  } = useForm({
    mode: 'onChange',
    defaultValues: _defaultValues
  });
  const sharedItems = {
    register,
    handleSubmit,
    watch,
    errors,
    control,
    trigger,
    setFocus,
    getValues,
    setValue,
    useFieldArray,
    useWatch,
    triggerBackground
  };
  const myComponents = React__default.useRef();
  const watchingComponents = React__default.useRef();
  const preConditionItems = React__default.useRef();
  const [data, setData] = useState();
  React__default.useEffect(() => {
    if (items === undefined) return;
    myComponents.current = convertIdToRef(items, 'name');
    watchingComponents.current = prepareWtchingComponents(myComponents.current);
    console.log("dyno ;)", myComponents, 'myComponentsmyComponents');
    console.log("dyno ;)", watchingComponents, 'prepareWtchingComponents', [...watchingComponents.current.keys()]);
    const subscription = watch(async (value, {
      name,
      type
    }) => {
      if (watchingComponents.current.get(name)) {
        console.log("dyno ;)", "checkPreCondition ;) checkPreCondition", value, name, type, data, items);
        const [a, b] = await checkPreCondition(name, value[name], items);
        if (!deepEqual(data, b) && a) {
          setData([...b]);
          return;
        }
      }
    });
    setData(items);
  }, items);
  const resetValues = () => {
    myComponents.current = resetItems(items, 'name');
    setData(items);
  };
  const getValuesPOC = async () => {
    if (Object.keys(errors).length > 0) return false;
    const result = await trigger();
    console.log("dyno ;)", "SUBMITFORM SUBMITFORM result trigger", result, errors);
    if (result === true) {
      return await getValues();
    } else {
      return false;
    }
  };
  ref.current = {
    getValues: getValuesPOC,
    resetValues: resetValues
  };
  const validationOnce = async (name, value, result) => {
    const validatedItem = myComponents.current[name];
    let n = result;
    const originalErrors = {
      ...errors.current
    } || {};
    const newErrors = errors.current || {};
    if (value !== '') {
      const _error = value === '313';
      if (_error) {
        newErrors[name] = {
          error: _error,
          errorMsg: validatedItem.errorMsg && validatedItem.errorMsg || '313 cant be here.'
        };
      } else {
        delete newErrors[name];
      }
    } else {
      delete newErrors[name];
    }
    errors.current = {
      ...newErrors
    };
    console.log("dyno ;)", errors, "errrrrrrrrr", newErrors);
    return [!_.isEqual(originalErrors, newErrors), [...n], newErrors[name]];
  };
  const updateReference = async (value, name) => {
    myComponents.current[name].value = value;
    console.log("dyno ;)", myComponents.current, 'getValues', await getValuesPOC());
    const [hasValidationChanged, result, error] = await validationOnce(name, value, [...data]);
    const [hasPreconditionChanged, preResult] = await checkPreCondition(name, value, result);
    if (hasValidationChanged === true || hasPreconditionChanged === true) {
      console.log("dyno ;)", 'lololololololololololoolol', hasValidationChanged, hasPreconditionChanged, errors);
      setData([...preResult]);
    }
  };
  const checkPreCondition = async (name, value, result) => {
    const hasCondition = watchingComponents.current.get(name);
    console.log("dyno ;)", data, "checkPreConditionInside", name, myComponents.current, hasCondition, watchingComponents.current);
    let n = [...result];
    let updated = false;
    if (hasCondition !== undefined) {
      await hasCondition.map(async item => {
        const realValue = value["value"] || value;
        const touched = (item === null || item === void 0 ? void 0 : item.type) && (await _validationResolver[item.type](item, realValue));
        if (_.get({
          a: n
        }, `a${item.refId}.visible`) !== touched) {
          n = _.set({
            a: n
          }, `a${item.refId}.visible`, touched).a;
          updated = true;
          console.log("dyno ;)", 'hashas', await _.get({
            a: n
          }, `a${item.refId}.visible`), await touched, hasCondition, updated);
        }
      });
    }
    return [updated, [...n]];
  };
  console.log("dyno ;)", 'renderCount', renderCount++);
  return data && renderForm(data, updateReference, myComponents, getValues, {
    ...errors
  }, ControlledComponents, components, managedCallback, undefined, sharedItems) || null;
});
FormBuilderV1.whyDidYouRender = true;
FormBuilderV1.displayName = "FormBuilderV1";

const renderComponentInd = (name, data, {
  updateReference,
  myComponents,
  getValues,
  errors,
  ControlledComponents,
  components,
  managedCallback,
  undefined: undefined$1,
  sharedItems,
  index,
  parent,
  givenName: _givenName = undefined$1
}) => {
  const selectedComponent = {
    ...data[name],
    givenName: _givenName
  };
  if (selectedComponent === undefined$1) return null;
  if ((selectedComponent === null || selectedComponent === void 0 ? void 0 : selectedComponent.visible) === false) return null;
  return renderComponentForm(selectedComponent, updateReference, myComponents, getValues, {
    ...errors
  }, ControlledComponents, components, managedCallback, undefined$1, sharedItems, index, data, parent);
};
const renderComponentForm = (item, updateReference, myControl, getValue, errorss, ControlledComponents, components, managedCallback, parentName, sharedItems, index, data, parent) => {
  console.log("dyno ;)", errorss, 'dataerrors');
  const {
    register,
    handleSubmit,
    watch,
    errors,
    control,
    trigger,
    setFocus,
    getValues,
    setValue,
    useFieldArray,
    useWatch,
    triggerBackground
  } = sharedItems;
  const name = parentName && `${parentName}.${item.name}` || item.givenName && item.givenName || item.name;
  let result = null;
  let child = [];
  if (item.items) {
    child = item.items.map((name, idx) => renderComponentInd(name, data, {
      updateReference,
      myControl,
      getValue,
      errors,
      ControlledComponents,
      components,
      managedCallback,
      parentName: (item === null || item === void 0 ? void 0 : item.items) && name || undefined,
      sharedItems,
      index: idx,
      data,
      parent: {
        name: item.name,
        index,
        id: item.id
      },
      itemName: name
    }));
  }
  const validation = {
    maxLength: item.maxLength && item.maxLength.value !== "" && item.maxLength || undefined,
    minLength: item.minLength && item.minLength.value !== "" && item.minLength || undefined,
    max: item.max && item.max.value !== "" && item.max || undefined,
    min: item.min && item.min.value !== "" && item.min || undefined,
    pattern: item.pattern && item.pattern.value !== "" && item.pattern || undefined,
    required: item.required && item.required.value !== "" && item.required || undefined
  };
  result = /*#__PURE__*/React__default.createElement(Controller, {
    key: item.isArray === true && `${name}container` || name,
    name: item.isArray === true && `${name}container` || name,
    control: control,
    item: item,
    rules: item.rule || validation,
    render: ({
      field
    }) => {
      if (item.isArray) {
        console.log("dyno ;)", name, item.items, "useFieldArray");
        const {
          fields,
          append,
          remove
        } = useFieldArray({
          control,
          name: name
        });
        child = /*#__PURE__*/React__default.createElement(Fragment, null, /*#__PURE__*/React__default.createElement("ul", null, fields.map((el, index) => /*#__PURE__*/React__default.createElement("li", {
          key: el.id
        }, item.items.map((element, indx) => /*#__PURE__*/React__default.createElement(Controller, {
          key: `${name}.${index}.${data[element].name}`,
          name: `${name}.${index}.${data[element].name}`,
          control: control,
          render: ({
            field
          }) => {
            console.log("dyno ;)", `${name}.${index}.${element}`, '`${name}.${index}.${element}`');
            return renderComponentInd(element, data, {
              updateReference,
              myControl,
              getValue,
              errors,
              ControlledComponents,
              components,
              managedCallback,
              parentName: (item === null || item === void 0 ? void 0 : item.items) && name || undefined,
              sharedItems,
              index: index,
              data,
              parent: {
                name: item.name,
                index,
                id: item.id
              },
              givenName: `${name}.${index}.${data[element].name}`
            });
          }
        })), /*#__PURE__*/React__default.createElement("button", {
          type: "button",
          onClick: () => remove(index)
        }, "-")))), /*#__PURE__*/React__default.createElement("button", {
          type: "button",
          onClick: () => append({})
        }, "+"));
      }
      const Component = components(item.type, {
        field,
        item,
        name,
        index,
        managedCallback,
        child,
        useFieldArray,
        error: errors,
        sharedItems,
        parent
      });
      return Component;
    }
  });
  return result;
};
const convertIdToRef$1 = (array, key, name, parent, isArray) => {
  const result = array.reduce((obj, item, currentIndex) => {
    const itemName = isArray === undefined && item[key] || `${parent}.0.${item[key]}`;
    const refId = name && `${name}.items[${currentIndex}]` || `[${currentIndex}]`;
    return {
      ...obj,
      [itemName]: {
        ...item,
        name: itemName,
        refId,
        ...(parent && {
          parent
        })
      },
      ...(item.items !== undefined && convertIdToRef$1(item.items, 'name', refId, item[key], item.isArray))
    };
  }, new Map());
  return result;
};
const resetItems$1 = (array, key, name, parent) => {
  const result = array.reduce((obj, item, currentIndex) => {
    const refId = name && `${name}.items[${currentIndex}]` || `[${currentIndex}]`;
    return {
      ...obj,
      [item[key]]: {
        ...item,
        refId,
        value: "",
        ...(parent && {
          parent
        })
      },
      ...(item.items !== undefined && convertIdToRef$1(item.items, 'name', refId, item[key]))
    };
  }, new Map());
  return result;
};
const prepareWtchingComponents$1 = (items, key) => {
  const initialValue = new Map();
  Object.keys(items).forEach(key => {
    if (items[key].preCondition) {
      const preConditionObj = convertArrayToObject$1(items[key].preCondition, 'value');
      const keys = Object.keys(preConditionObj);
      for (let index = 0; index < keys.length; index++) {
        const internalItem = preConditionObj[keys[index]];
        console.log("dyno ;)", items[key], 'items[key]');
        initialValue.set(internalItem.name, [...(initialValue.get(internalItem.name) && initialValue.get(internalItem.name) || []), {
          refId: items[key].id,
          ...internalItem
        }]);
      }
    }
  });
  return initialValue;
};
const convertArrayToObject$1 = (array, key, value) => {
  const initialValue = {};
  if (!Array.isArray(array)) return;
  const givenArray = array.concat();
  return givenArray.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: value && item[value] || value === undefined && item || ''
    };
  }, initialValue);
};
let renderCount$1 = 0;
const FormBuilderNext = React__default.forwardRef(({
  items,
  validationResolver,
  ControlledComponents,
  components,
  managedCallback,
  shouldUnregister: _shouldUnregister = true,
  defaultValues: _defaultValues = {}
}, ref) => {
  var _data$root, _data$root$items;
  console.log("dyno ;)", _defaultValues, "defaultValues");
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors
    },
    control,
    trigger,
    setFocus,
    getValues,
    setValue,
    triggerBackground,
    unregister
  } = useForm({
    mode: 'onChange',
    shouldUnregister: true,
    defaultValues: _defaultValues
  });
  const sharedItems = {
    register,
    handleSubmit,
    watch,
    errors,
    control,
    trigger,
    setFocus,
    getValues,
    setValue,
    useFieldArray,
    useWatch,
    triggerBackground,
    unregister
  };
  const myComponents = React__default.useRef();
  const watchingComponents = React__default.useRef();
  const preConditionItems = React__default.useRef();
  const [data, setData] = useState();
  React__default.useEffect(() => {
    if (items === undefined) return;
    myComponents.current = items;
    watchingComponents.current = prepareWtchingComponents$1(myComponents.current);
    console.log("dyno ;)", myComponents, 'myComponentsmyComponents');
    console.log("dyno ;)", watchingComponents, 'prepareWtchingComponents', [...watchingComponents.current.keys()]);
    const subscription = watch(async (value, {
      name,
      type
    }) => {
      if (watchingComponents.current.get(name)) {
        console.log("dyno ;)", "checkPreCondition ;) checkPreCondition", value, name, type, data, items);
        const [a, b] = await checkPreCondition(name, value[name], items);
        if (!deepEqual(data, b) && a) {
          setData({
            ...b
          });
          return;
        }
      }
    });
    setData(items);
  }, [items]);
  const resetValues = () => {
    myComponents.current = resetItems$1(items, 'name');
    setData(items);
  };
  const getValuesPOC = async () => {
    if (Object.keys(errors).length > 0) return false;
    const result = await trigger();
    console.log("dyno ;)", "SUBMITFORM SUBMITFORM result trigger", result, errors);
    if (result === true) {
      return await getValues();
    } else {
      return false;
    }
  };
  ref.current = {
    getValues: getValuesPOC,
    resetValues: resetValues,
    setValue: setValue
  };
  const validationOnce = async (name, value, result) => {
    const validatedItem = myComponents.current[name];
    let n = result;
    const originalErrors = {
      ...errors.current
    } || {};
    const newErrors = errors.current || {};
    if (value !== '') {
      const _error = value === '313';
      if (_error) {
        newErrors[name] = {
          error: _error,
          errorMsg: validatedItem.errorMsg && validatedItem.errorMsg || '313 cant be here.'
        };
      } else {
        delete newErrors[name];
      }
    } else {
      delete newErrors[name];
    }
    errors.current = {
      ...newErrors
    };
    console.log("dyno ;)", errors, "errrrrrrrrr", newErrors);
    return [!_.isEqual(originalErrors, newErrors), [...n], newErrors[name]];
  };
  const updateReference = async (value, name) => {
    myComponents.current[name].value = value;
    console.log("dyno ;)", myComponents.current, 'getValues', await getValuesPOC());
    const [hasValidationChanged, result, error] = await validationOnce(name, value, {
      ...data
    });
    const [hasPreconditionChanged, preResult] = await checkPreCondition(name, value, data);
    if (hasValidationChanged === true || hasPreconditionChanged === true) {
      console.log("dyno ;)", 'lololololololololololoolol', hasValidationChanged, hasPreconditionChanged, errors);
      setData({
        ...preResult
      });
    }
  };
  const checkPreCondition = async (name, value, result) => {
    const hasCondition = watchingComponents.current.get(name);
    console.log("dyno ;)", data, "checkPreConditionInside", name, myComponents.current, hasCondition, watchingComponents.current);
    let n = {
      ...result
    };
    let updated = false;
    if (hasCondition !== undefined) {
      await hasCondition.map(async item => {
        const realValue = value && value["value"] || value;
        const touched = (item === null || item === void 0 ? void 0 : item.type) && (await validationResolver[item.type](item, realValue));
        const i = n[item.refId];
        console.log("dyno ;)", n["accountNo"], "accountNoaccountNo", '-----', i);
        if (i !== undefined && i.visible !== touched) {
          n[item.refId].visible = touched;
          updated = true;
        }
      });
    }
    return [updated, n];
  };
  console.log("dyno ;)", 'renderCount', renderCount$1++);
  return data && ((_data$root = data.root) === null || _data$root === void 0 ? void 0 : (_data$root$items = _data$root.items) === null || _data$root$items === void 0 ? void 0 : _data$root$items.map((name, index) => renderComponentInd(name, data, {
    updateReference,
    myComponents,
    getValues,
    errors,
    ControlledComponents,
    components,
    managedCallback,
    undefined,
    sharedItems,
    index
  }))) || null;
});
FormBuilderNext.whyDidYouRender = true;
FormBuilderNext.displayName = "FormBuilderNext";

const defaultOptions$1 = {
  mode: VALIDATION_MODE.onSubmit,
  reValidateMode: VALIDATION_MODE.onChange,
  shouldFocusError: true
};
const isWindowUndefined$1 = typeof window === 'undefined';
function createFormControlV4(props = {}) {
  let formOptions = Object.assign(Object.assign({}, defaultOptions$1), props);
  console.log("dyno ;)", formOptions, 'formOptions');
  let _delayCallback;
  let _formState = {
    isDirty: false,
    isValidating: false,
    dirtyFields: {},
    isSubmitted: false,
    submitCount: 0,
    touchedFields: {},
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    errors: {}
  };
  const _proxyFormState = {
    isDirty: false,
    dirtyFields: false,
    touchedFields: false,
    isValidating: false,
    isValid: false,
    errors: false
  };
  let _fields = {};
  let _formValues = {};
  let _defaultValues = formOptions.defaultValues || {};
  let _isInAction = false;
  let _isMounted = false;
  const _subjects = {
    watch: new Subject(),
    control: new Subject(),
    array: new Subject(),
    state: new Subject()
  };
  let _names = {
    mount: new Set(),
    unMount: new Set(),
    array: new Set(),
    watch: new Set(),
    watchAll: false
  };
  const validationMode = getValidationModes(formOptions.mode);
  const isValidateAllFieldCriteria = formOptions.criteriaMode === VALIDATION_MODE.all;
  const isFieldWatched = name => _names.watchAll || _names.watch.has(name) || _names.watch.has((name.match(/\w+/) || [])[0]);
  const updateErrorState = (name, error) => {
    set(_formState.errors, name, error);
    _subjects.state.next({
      errors: _formState.errors
    });
  };
  const shouldRenderBaseOnValid = async () => {
    const isValid = await validateForm(_fields, true);
    if (isValid !== _formState.isValid) {
      _formState.isValid = isValid;
      _subjects.state.next({
        isValid
      });
    }
  };
  const shouldRenderBaseOnError = async (shouldSkipRender, name, error, fieldState, isValidFromResolver, isWatched) => {
    const previousError = get(_formState.errors, name);
    const isValid = !!(_proxyFormState.isValid && (formOptions.resolver ? isValidFromResolver : shouldRenderBaseOnValid()));
    if (props.delayError && error) {
      _delayCallback = _delayCallback || debounce(updateErrorState, props.delayError);
      _delayCallback(name, error);
    } else {
      error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
    }
    if ((isWatched || (error ? !deepEqual(previousError, error) : previousError) || !isEmptyObject(fieldState) || _formState.isValid !== isValid) && !shouldSkipRender) {
      const updatedFormState = Object.assign(Object.assign(Object.assign({}, fieldState), _proxyFormState.isValid && formOptions.resolver ? {
        isValid
      } : {}), {
        errors: _formState.errors,
        name
      });
      _formState = Object.assign(Object.assign({}, _formState), updatedFormState);
      _subjects.state.next(isWatched ? {
        name
      } : updatedFormState);
    }
    _subjects.state.next({
      isValidating: false
    });
  };
  const setFieldValue = (name, value, options = {}, shouldRender) => {
    const field = get(_fields, name);
    if (field) {
      const _f = field._f;
      if (_f) {
        set(_formValues, name, getFieldValueAs(value, _f));
        const fieldValue = isWeb && isHTMLElement(_f.ref) && isNullOrUndefined(value) ? '' : value;
        if (isFileInput(_f.ref) && !isString(fieldValue)) {
          _f.ref.files = fieldValue;
        } else if (isMultipleSelect(_f.ref)) {
          [..._f.ref.options].forEach(selectRef => selectRef.selected = fieldValue.includes(selectRef.value));
        } else if (_f.refs) {
          if (isCheckBoxInput(_f.ref)) {
            _f.refs.length > 1 ? _f.refs.forEach(checkboxRef => checkboxRef.checked = Array.isArray(fieldValue) ? !!fieldValue.find(data => data === checkboxRef.value) : fieldValue === checkboxRef.value) : _f.refs[0].checked = !!fieldValue;
          } else {
            _f.refs.forEach(radioRef => radioRef.checked = radioRef.value === fieldValue);
          }
        } else {
          _f.ref.value = fieldValue;
        }
        if (shouldRender) {
          _subjects.control.next({
            values: getValues(),
            name
          });
        }
        (options.shouldDirty || options.shouldTouch) && updateTouchAndDirtyState(name, fieldValue, options.shouldTouch);
        options.shouldValidate && trigger(name);
      }
    }
  };
  const updateTouchAndDirtyState = (name, inputValue, isCurrentTouched, shouldRender = true) => {
    const state = {
      name
    };
    let isChanged = false;
    if (_proxyFormState.isDirty) {
      const previousIsDirty = _formState.isDirty;
      _formState.isDirty = _getIsDirty();
      state.isDirty = _formState.isDirty;
      isChanged = previousIsDirty !== state.isDirty;
    }
    if (_proxyFormState.dirtyFields && !isCurrentTouched) {
      const isPreviousFieldDirty = get(_formState.dirtyFields, name);
      const isCurrentFieldDirty = !deepEqual(get(_defaultValues, name), inputValue);
      isCurrentFieldDirty ? set(_formState.dirtyFields, name, true) : unset(_formState.dirtyFields, name);
      state.dirtyFields = _formState.dirtyFields;
      isChanged = isChanged || isPreviousFieldDirty !== get(_formState.dirtyFields, name);
    }
    const isPreviousFieldTouched = get(_formState.touchedFields, name);
    if (isCurrentTouched && !isPreviousFieldTouched) {
      set(_formState.touchedFields, name, isCurrentTouched);
      state.touchedFields = _formState.touchedFields;
      isChanged = isChanged || _proxyFormState.touchedFields && isPreviousFieldTouched !== isCurrentTouched;
    }
    isChanged && shouldRender && _subjects.state.next(state);
    return isChanged ? state : {};
  };
  const executeResolver = async name => {
    return formOptions.resolver ? await formOptions.resolver(Object.assign({}, _formValues), formOptions.context, getResolverOptions(name || _names.mount, _fields, formOptions.criteriaMode, formOptions.shouldUseNativeValidation)) : {};
  };
  const executeResolverValidation = async names => {
    const {
      errors
    } = await executeResolver();
    if (names) {
      for (const name of names) {
        const error = get(errors, name);
        error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
      }
    } else {
      _formState.errors = errors;
    }
    return errors;
  };
  const validateForm = async (_fields, shouldCheckValid, context = {
    valid: true,
    triggerAll: true
  }, formId = "ALL") => {
    for (const name in _fields) {
      const field = _fields[name];
      if (field) {
        const _f = field._f;
        const val = omit(field, '_f');
        if (_f) {
          if (_f.formId === formId || formId === "ALL") {
            const fieldError = await validateField(field, get(_formValues, _f.name), isValidateAllFieldCriteria, formOptions.shouldUseNativeValidation);
            if (shouldCheckValid) {
              if (fieldError[_f.name]) {
                context.valid = false;
                break;
              }
            } else {
              if (fieldError[_f.name]) {
                context.valid = false;
              }
              fieldError[_f.name] ? set(_formState.errors, _f.name, fieldError[_f.name]) : unset(_formState.errors, _f.name);
              if (context.triggerAll === false && Object.keys(_formState.errors).length == 1) break;
            }
          }
        }
        val && (await validateForm(val, shouldCheckValid, context));
      }
    }
    return context.valid;
  };
  const validateFormBackground = async (_fields, shouldCheckValid, context = {
    valid: true
  }, formId = "ALL") => {
    let localErrors = {};
    for (const name in _fields) {
      const field = _fields[name];
      if (field) {
        const _f = field._f;
        const val = omit(field, '_f');
        if (_f) {
          if (_f.formId === formId || formId === "ALL") {
            const fieldError = await validateField(field, get(_formValues, _f.name), isValidateAllFieldCriteria, formOptions.shouldUseNativeValidation);
            if (shouldCheckValid) {
              if (fieldError[_f.name]) {
                context.valid = false;
                break;
              }
            } else {
              if (fieldError[_f.name]) {
                context.valid = false;
              }
              fieldError[_f.name] ? set(localErrors, _f.name, fieldError[_f.name]) : unset(localErrors, _f.name);
            }
          }
        }
        val && (await validateForm(val, shouldCheckValid, context));
      }
    }
    return localErrors;
  };
  const handleChange = async ({
    type,
    target,
    target: {
      value,
      name,
      type: inputType
    }
  }) => {
    let error;
    let isValid;
    const field = get(_fields, name);
    if (field) {
      let inputValue = inputType ? getFieldValue(field) : undefined;
      inputValue = isUndefined(inputValue) ? value : inputValue;
      const isBlurEvent = type === EVENTS.BLUR;
      const {
        isOnBlur: isReValidateOnBlur,
        isOnChange: isReValidateOnChange
      } = getValidationModes(formOptions.reValidateMode);
      const shouldSkipValidation = !hasValidation(field._f, field._f.mount) && !formOptions.resolver && !get(_formState.errors, name) || skipValidation(Object.assign({
        isBlurEvent,
        isTouched: !!get(_formState.touchedFields, name),
        isSubmitted: _formState.isSubmitted,
        isReValidateOnBlur,
        isReValidateOnChange
      }, validationMode));
      const isWatched = !isBlurEvent && isFieldWatched(name);
      if (!isUndefined(inputValue)) {
        set(_formValues, name, inputValue);
      }
      const fieldState = updateTouchAndDirtyState(name, inputValue, isBlurEvent, false);
      const shouldRender = field._f.watch || !isEmptyObject(fieldState) || isWatched;
      console.log("dyno ;)", shouldRender, `heyyyyyyyyyyy { ${name} } watch me or not?!`, field._f.watch, "shouldSkipValidation:", shouldSkipValidation, "isBlurEvent:", isBlurEvent, '------;)---- is watching hahaha:', isWatched);
      if (shouldSkipValidation) {
        !isBlurEvent && _subjects.watch.next({
          name,
          type
        });
        return shouldRender && _subjects.state.next(isWatched ? {
          name
        } : Object.assign(Object.assign({}, fieldState), {
          name
        }));
      }
      _subjects.state.next({
        isValidating: true
      });
      if (formOptions.resolver) {
        const {
          errors
        } = await executeResolver([name]);
        error = get(errors, name);
        if (isCheckBoxInput(target) && !error) {
          const parentNodeName = getNodeParentName(name);
          const valError = get(errors, parentNodeName, {});
          valError.type && valError.message && (error = valError);
          if (valError || get(_formState.errors, parentNodeName)) {
            name = parentNodeName;
          }
        }
        isValid = isEmptyObject(errors);
      } else {
        error = (await validateField(field, get(_formValues, name), isValidateAllFieldCriteria, formOptions.shouldUseNativeValidation))[name];
      }
      !isBlurEvent && _subjects.watch.next({
        name,
        type,
        values: getValues()
      });
      shouldRenderBaseOnError(false, name, error, fieldState, isValid, isWatched);
    }
  };
  const _updateValidAndInputValue = (name, ref, shouldSkipValueAs) => {
    const field = get(_fields, name);
    if (field) {
      const fieldValue = get(_formValues, name);
      const isValueUndefined = isUndefined(fieldValue);
      const defaultValue = isValueUndefined ? get(_defaultValues, name) : fieldValue;
      if (isUndefined(defaultValue) || ref && ref.defaultChecked || shouldSkipValueAs) {
        ref && ref.visible && set(_formValues, name, shouldSkipValueAs ? defaultValue : getFieldValue(field));
      } else {
        setFieldValue(name, defaultValue);
      }
    }
    _isMounted && _proxyFormState.isValid && _updateValid();
  };
  const _getIsDirty = (name, data) => {
    name && data && set(_formValues, name, data);
    return !deepEqual(Object.assign({}, getValues()), _defaultValues);
  };
  const _updateValid = async () => {
    const isValid = formOptions.resolver ? isEmptyObject((await executeResolver()).errors) : await validateForm(_fields, true);
    if (isValid !== _formState.isValid) {
      _formState.isValid = isValid;
      _subjects.state.next({
        isValid
      });
    }
  };
  const setValues = (name, value, options) => Object.entries(value).forEach(([fieldKey, fieldValue]) => {
    const fieldName = `${name}.${fieldKey}`;
    const field = get(_fields, fieldName);
    const isFieldArray = _names.array.has(name);
    (isFieldArray || !isPrimitive(fieldValue) || field && !field._f) && !isDateObject(fieldValue) ? setValues(fieldName, fieldValue, options) : setFieldValue(fieldName, fieldValue, options, true);
  });
  const _getWatch = (fieldNames, defaultValue, isGlobal) => {
    const fieldValues = Object.assign({}, _isMounted ? Object.assign({}, Object.assign(Object.assign({}, _defaultValues), _formValues)) : isUndefined(defaultValue) ? _defaultValues : defaultValue);
    if (!fieldNames) {
      isGlobal && (_names.watchAll = true);
      return fieldValues;
    }
    const resultChanges = [];
    const result = new Map();
    for (const fieldName of convertToArrayPayload(fieldNames)) {
      isGlobal && _names.watch.add(fieldName);
      resultChanges.push(get(fieldValues, fieldName));
      result.set(fieldName, get(fieldValues, fieldName));
    }
    return Array.isArray(fieldNames) ? [resultChanges, result] : isObject(result[0]) ? Object.assign({}, result[0]) : Array.isArray(result[0]) ? [...result[0]] : result[0];
  };
  const _updateFormValues = (defaultValues, name = '') => {
    console.log("dyno ;)", defaultValues, "_updateFormValues");
    for (const key in defaultValues) {
      const value = defaultValues[key];
      const fieldName = name + (name ? '.' : '') + key;
      const field = get(_fields, fieldName);
      if (!field || !field._f) {
        if (isObject(value) || Array.isArray(value)) {
          _updateFormValues(value, fieldName);
        } else if (!field) {
          set(_formValues, fieldName, value);
        }
      }
    }
  };
  const _bathFieldArrayUpdate = (keyName, name, method, args, updatedFieldArrayValues = [], shouldSet = true, shouldSetFields = true) => {
    _isInAction = true;
    if (shouldSetFields && get(_fields, name)) {
      const output = method(get(_fields, name), args.argA, args.argB);
      shouldSet && set(_fields, name, output);
    }
    set(_formValues, name, updatedFieldArrayValues);
    if (Array.isArray(get(_formState.errors, name))) {
      const output = method(get(_formState.errors, name), args.argA, args.argB);
      shouldSet && set(_formState.errors, name, output);
      unsetEmptyArray(_formState.errors, name);
    }
    if (_proxyFormState.touchedFields && get(_formState.touchedFields, name)) {
      const output = method(get(_formState.touchedFields, name), args.argA, args.argB);
      shouldSet && set(_formState.touchedFields, name, output);
      unsetEmptyArray(_formState.touchedFields, name);
    }
    if (_proxyFormState.dirtyFields || _proxyFormState.isDirty) {
      set(_formState.dirtyFields, name, setFieldArrayDirtyFields(omitKey(updatedFieldArrayValues, keyName), get(_defaultValues, name, []), get(_formState.dirtyFields, name, [])));
      updatedFieldArrayValues && set(_formState.dirtyFields, name, setFieldArrayDirtyFields(omitKey(updatedFieldArrayValues, keyName), get(_defaultValues, name, []), get(_formState.dirtyFields, name, [])));
      unsetEmptyArray(_formState.dirtyFields, name);
    }
    _subjects.state.next({
      isDirty: _getIsDirty(name, omitKey(updatedFieldArrayValues, keyName)),
      dirtyFields: _formState.dirtyFields,
      errors: _formState.errors,
      isValid: _formState.isValid
    });
  };
  const _getFieldArrayValue = name => get(_isMounted ? _formValues : _defaultValues, name, []);
  const setValue = (name, value, options = {}) => {
    const field = get(_fields, name);
    const isFieldArray = _names.array.has(name);
    set(_formValues, name, value);
    if (isFieldArray) {
      _subjects.array.next({
        values: value,
        name,
        isReset: true
      });
      if ((_proxyFormState.isDirty || _proxyFormState.dirtyFields) && options.shouldDirty) {
        set(_formState.dirtyFields, name, setFieldArrayDirtyFields(value, get(_defaultValues, name, []), get(_formState.dirtyFields, name, [])));
        _subjects.state.next({
          name,
          dirtyFields: _formState.dirtyFields,
          isDirty: _getIsDirty(name, value)
        });
      }
    } else {
      field && !field._f && !isNullOrUndefined(value) ? setValues(name, value, options) : setFieldValue(name, value, options, true);
    }
    isFieldWatched(name) && _subjects.state.next({});
    _subjects.watch.next({
      name
    });
  };
  const trigger = async (name, options = {}) => {
    const fieldNames = convertToArrayPayload(name);
    let isValid;
    _subjects.state.next({
      isValidating: true
    });
    if (formOptions.resolver) {
      const schemaResult = await executeResolverValidation(isUndefined(name) ? name : fieldNames);
      isValid = name ? fieldNames.every(name => !get(schemaResult, name)) : isEmptyObject(schemaResult);
    } else {
      if (name) {
        isValid = (await Promise.all(fieldNames.map(async fieldName => {
          const field = get(_fields, fieldName);
          return await validateForm(field._f ? {
            [fieldName]: field
          } : field);
        }))).every(Boolean);
      } else {
        await validateForm(_fields);
        isValid = isEmptyObject(_formState.errors);
      }
    }
    _subjects.state.next(Object.assign(Object.assign({}, isString(name) ? {
      name
    } : {}), {
      errors: _formState.errors,
      isValidating: false
    }));
    if (options.shouldFocus && !isValid) {
      focusFieldBy(_fields, key => get(_formState.errors, key), name ? fieldNames : _names.mount);
    }
    _proxyFormState.isValid && _updateValid();
    return isValid;
  };
  const triggerCustom = async (options = {
    triggerAll: false
  }, name) => {
    const fieldNames = convertToArrayPayload(name);
    let isValid;
    _subjects.state.next({
      isValidating: true
    });
    if (formOptions.resolver) {
      const schemaResult = await executeResolverValidation(isUndefined(name) ? name : fieldNames);
      isValid = name ? fieldNames.every(name => !get(schemaResult, name)) : isEmptyObject(schemaResult);
    } else {
      if (name) {
        isValid = (await Promise.all(fieldNames.map(async fieldName => {
          const field = get(_fields, fieldName);
          return await validateForm(field._f ? {
            [fieldName]: field
          } : field);
        }))).every(Boolean);
      } else {
        await validateForm(_fields, false, {
          triggerAll: options.triggerAll
        });
        isValid = isEmptyObject(_formState.errors);
      }
    }
    _subjects.state.next(Object.assign(Object.assign({}, isString(name) ? {
      name
    } : {}), {
      errors: _formState.errors,
      isValidating: false
    }));
    if (options.shouldFocus && !isValid) {
      focusFieldBy(_fields, key => get(_formState.errors, key), name ? fieldNames : _names.mount);
    }
    _proxyFormState.isValid && _updateValid();
    return isValid;
  };
  const triggerBackground = async (name, options = {}) => {
    const fieldNames = convertToArrayPayload(name);
    let isValid;
    console.log("dyno ;)", "trigger", _formState.errors);
    if (formOptions.resolver) {
      const schemaResult = await executeResolverValidation(isUndefined(name) ? name : fieldNames);
      isValid = name ? fieldNames.every(name => !get(schemaResult, name)) : isEmptyObject(schemaResult);
    } else {
      if (name) {
        isValid = (await Promise.all(fieldNames.map(async fieldName => {
          const field = get(_fields, fieldName);
          return await validateForm(field._f ? {
            [fieldName]: field
          } : field);
        }))).every(Boolean);
      } else {
        isValid = await validateForm(_fields, true);
      }
    }
    if (options.shouldFocus && !isValid) {
      focusFieldBy(_fields, key => get(_formState.errors, key), name ? fieldNames : _names.mount);
    }
    _proxyFormState.isValid && _updateValid();
    return isValid;
  };
  const triggerBackgroundOptimised = (formId = "ALL") => async (list = false) => {
    let isValid;
    console.log("dyno ;)", "triggerBackgroundtriggerBackground", _formState.errors);
    if (formOptions.resolver) {
      const schemaResult = await executeResolverValidation(fieldNames);
      isValid = isEmptyObject(schemaResult);
    } else {
      if (list) {
        isValid = await validateFormBackground(_fields, false, {
          valid: true
        });
      } else {
        isValid = await validateForm(_fields, true, {
          valid: true
        }, formId);
      }
    }
    _proxyFormState.isValid && _updateValid();
    return isValid;
  };
  const getValues = fieldNames => {
    const values = Object.assign(Object.assign({}, _defaultValues), _formValues);
    return isUndefined(fieldNames) ? values : isString(fieldNames) ? get(values, fieldNames) : fieldNames.map(name => get(values, name));
  };
  const clearErrors = name => {
    name ? convertToArrayPayload(name).forEach(inputName => unset(_formState.errors, inputName)) : _formState.errors = {};
    _subjects.state.next({
      errors: _formState.errors
    });
  };
  const setError = (name, error, options) => {
    const ref = (get(_fields, name, {
      _f: {}
    })._f || {}).ref;
    set(_formState.errors, name, Object.assign(Object.assign({}, error), {
      ref
    }));
    _subjects.state.next({
      name,
      errors: _formState.errors,
      isValid: false
    });
    options && options.shouldFocus && ref && ref.focus && ref.focus();
  };
  const watch = (fieldName, defaultValue) => isFunction(fieldName) ? _subjects.watch.subscribe({
    next: info => fieldName(_getWatch(undefined, defaultValue), info)
  }) : _getWatch(fieldName, defaultValue, true);
  const unregister = (name, options = {}) => {
    for (const inputName of name ? convertToArrayPayload(name) : _names.mount) {
      _names.mount.delete(inputName);
      _names.array.delete(inputName);
      if (get(_fields, inputName)) {
        if (!options.keepValue) {
          unset(_fields, inputName);
          unset(_formValues, inputName);
        }
        !options.keepError && unset(_formState.errors, inputName);
        !options.keepDirty && unset(_formState.dirtyFields, inputName);
        !options.keepTouched && unset(_formState.touchedFields, inputName);
        !formOptions.shouldUnregister && !options.keepDefaultValue && unset(_defaultValues, inputName);
      }
    }
    _subjects.watch.next({});
    _subjects.state.next(Object.assign(Object.assign({}, _formState), !options.keepDirty ? {} : {
      isDirty: _getIsDirty()
    }));
    !options.keepIsValid && _updateValid();
  };
  const registerFieldRef = (name, fieldRef, options) => {
    register(name, options);
    let field = get(_fields, name);
    const ref = isUndefined(fieldRef.value) ? fieldRef.querySelectorAll ? fieldRef.querySelectorAll('input,select,textarea')[0] || fieldRef : fieldRef : fieldRef;
    const isRadioOrCheckbox = isRadioOrCheckboxFunction(ref);
    if (ref === field._f.ref || isRadioOrCheckbox && compact(field._f.refs || []).find(option => option === ref)) {
      return;
    }
    field = {
      _f: isRadioOrCheckbox ? Object.assign(Object.assign({}, field._f), {
        refs: [...compact(field._f.refs || []).filter(ref => isHTMLElement(ref) && document.contains(ref)), ref],
        ref: {
          type: ref.type,
          name
        }
      }) : Object.assign(Object.assign({}, field._f), {
        ref
      })
    };
    set(_fields, name, field);
    _updateValidAndInputValue(name, ref);
  };
  const register = (name, options = {}) => {
    const field = get(_fields, name);
    set(_fields, name, {
      _f: Object.assign(Object.assign(Object.assign({}, field && field._f ? field._f : {
        ref: {
          name
        }
      }), {
        name,
        mount: true
      }), options)
    });
    console.log("dyno ;)", Object.assign(Object.assign(Object.assign({}, field && field._f ? field._f : {
      ref: {
        name
      }
    }), {
      name,
      mount: true
    }), options), "registerRegister after", field, name, _fields);
    if (options.value) {
      set(_formValues, name, options.value);
    }
    if (!isUndefined(options.disabled) && field && field._f && field._f.ref.disabled !== options.disabled) {
      set(_formValues, name, options.disabled ? undefined : field._f.ref.value);
    }
    _names.mount.add(name);
    !field && _updateValidAndInputValue(name, undefined, true);
    return isWindowUndefined$1 ? {
      name: name
    } : Object.assign(Object.assign({
      name
    }, isUndefined(options.disabled) ? {} : {
      disabled: options.disabled
    }), {
      onChange: handleChange,
      onBlur: handleChange,
      ref: ref => {
        if (ref) {
          registerFieldRef(name, ref, options);
        } else {
          const field = get(_fields, name, {});
          const _shouldUnregister = formOptions.shouldUnregister || options.shouldUnregister;
          if (field._f) {
            field._f.mount = false;
          }
          _shouldUnregister && !(isNameInFieldArray(_names.array, name) && _isInAction) && _names.unMount.add(name);
        }
      }
    });
  };
  const handleSubmit = (onValid, onInvalid) => async e => {
    if (e) {
      e.preventDefault && e.preventDefault();
      e.persist && e.persist();
    }
    let hasNoPromiseError = true;
    let fieldValues = Object.assign({}, _formValues);
    _subjects.state.next({
      isSubmitting: true
    });
    try {
      if (formOptions.resolver) {
        const {
          errors,
          values
        } = await executeResolver();
        _formState.errors = errors;
        fieldValues = values;
      } else {
        await validateForm(_fields);
      }
      if (isEmptyObject(_formState.errors) && Object.keys(_formState.errors).every(name => get(fieldValues, name))) {
        _subjects.state.next({
          errors: {},
          isSubmitting: true
        });
        await onValid(fieldValues, e);
      } else {
        onInvalid && (await onInvalid(_formState.errors, e));
        formOptions.shouldFocusError && focusFieldBy(_fields, key => get(_formState.errors, key), _names.mount);
      }
    } catch (err) {
      hasNoPromiseError = false;
      throw err;
    } finally {
      _formState.isSubmitted = true;
      _subjects.state.next({
        isSubmitted: true,
        isSubmitting: false,
        isSubmitSuccessful: isEmptyObject(_formState.errors) && hasNoPromiseError,
        submitCount: _formState.submitCount + 1,
        errors: _formState.errors
      });
    }
  };
  const reset = (values, keepStateOptions = {}) => {
    const updatedValues = values || _defaultValues;
    if (isWeb && !keepStateOptions.keepValues) {
      for (const name of _names.mount) {
        const field = get(_fields, name);
        if (field && field._f) {
          const inputRef = Array.isArray(field._f.refs) ? field._f.refs[0] : field._f.ref;
          try {
            isHTMLElement(inputRef) && inputRef.closest('form').reset();
            break;
          } catch (_a) {}
        }
      }
    }
    if (!keepStateOptions.keepDefaultValues) {
      _defaultValues = Object.assign({}, updatedValues);
      _formValues = Object.assign({}, updatedValues);
    }
    if (!keepStateOptions.keepValues) {
      _fields = {};
      _formValues = {};
      _subjects.control.next({
        values: keepStateOptions.keepDefaultValues ? _defaultValues : Object.assign({}, updatedValues)
      });
      _subjects.watch.next({});
      _subjects.array.next({
        values: Object.assign({}, updatedValues),
        isReset: true
      });
    }
    _names = {
      mount: new Set(),
      unMount: new Set(),
      array: new Set(),
      watch: new Set(),
      watchAll: false
    };
    _subjects.state.next({
      submitCount: keepStateOptions.keepSubmitCount ? _formState.submitCount : 0,
      isDirty: keepStateOptions.keepDirty ? _formState.isDirty : keepStateOptions.keepDefaultValues ? deepEqual(values, _defaultValues) : false,
      isSubmitted: keepStateOptions.keepIsSubmitted ? _formState.isSubmitted : false,
      dirtyFields: keepStateOptions.keepDirty ? _formState.dirtyFields : {},
      touchedFields: keepStateOptions.keepTouched ? _formState.touchedFields : {},
      errors: keepStateOptions.keepErrors ? _formState.errors : {},
      isSubmitting: false,
      isSubmitSuccessful: false
    });
    _isMounted = !!keepStateOptions.keepIsValid;
  };
  const setFocus = name => get(_fields, name)._f.ref.focus();
  return {
    control: {
      register,
      unregister,
      _getIsDirty,
      _getWatch,
      _updateValid,
      _updateFormValues,
      _bathFieldArrayUpdate,
      _getFieldArrayValue,
      _subjects,
      _shouldUnregister: formOptions.shouldUnregister,
      _fields,
      _proxyFormState,
      get _formValues() {
        return _formValues;
      },
      set _formValues(value) {
        _formValues = value;
      },
      get _isMounted() {
        return _isMounted;
      },
      set _isMounted(value) {
        _isMounted = value;
      },
      get _defaultValues() {
        return _defaultValues;
      },
      set _defaultValues(value) {
        _defaultValues = value;
      },
      get _names() {
        return _names;
      },
      set _names(value) {
        _names = value;
      },
      _isInAction: {
        get val() {
          return _isInAction;
        },
        set val(value) {
          _isInAction = value;
        }
      },
      _formState: {
        get val() {
          return _formState;
        },
        set val(value) {
          _formState = value;
        }
      },
      _updateProps: options => {
        formOptions = Object.assign(Object.assign({}, defaultOptions$1), options);
      }
    },
    trigger,
    triggerBackground,
    triggerBackgroundOptimised,
    triggerCustom,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    clearErrors,
    unregister,
    setError,
    setFocus
  };
}

function useForm$1(props = {}) {
  const _formControl = useRef();
  const [formState, updateFormState] = useState({
    isDirty: false,
    isValidating: false,
    dirtyFields: {},
    isSubmitted: false,
    submitCount: 0,
    touchedFields: {},
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    errors: {}
  });
  if (_formControl.current) {
    _formControl.current.control._updateProps(props);
  } else {
    _formControl.current = Object.assign(Object.assign({}, createFormControlV4(props)), {
      formState
    });
  }
  const control = _formControl.current.control;
  useEffect(() => {
    const formStateSubscription = control._subjects.state.subscribe({
      next(formState) {
        if (shouldRenderFormState(formState, control._proxyFormState, true)) {
          control._formState.val = Object.assign(Object.assign({}, control._formState.val), formState);
          updateFormState(Object.assign({}, control._formState.val));
        }
      }
    });
    const useFieldArraySubscription = control._subjects.array.subscribe({
      next(state) {
        if (state.values && state.name && control._proxyFormState.isValid) {
          set(control._formValues, state.name, state.values);
          control._updateValid();
        }
      }
    });
    return () => {
      formStateSubscription.unsubscribe();
      useFieldArraySubscription.unsubscribe();
    };
  }, [control]);
  useEffect(() => {
    const unregisterFieldNames = [];
    if (!control._isMounted) {
      control._isMounted = true;
      control._proxyFormState.isValid && control._updateValid();
      !props.shouldUnregister && control._updateFormValues(control._defaultValues);
    }
    for (const name of control._names.unMount) {
      const field = get(control._fields, name);
      field && (field._f.refs ? field._f.refs.every(live) : live(field._f.ref)) && unregisterFieldNames.push(name);
    }
    console.log("dyno ;)", unregisterFieldNames, 'unregisterFieldNames', control._names, control);
    unregisterFieldNames.length && _formControl.current.unregister(unregisterFieldNames);
    control._names.unMount = new Set();
  });
  _formControl.current.formState = getProxyFormState(formState, control._proxyFormState);
  return _formControl.current;
}

const renderComponentInd$1 = (name, data, {
  updateReference,
  myComponents,
  getValues,
  errors,
  ControlledComponents,
  components,
  managedCallback,
  undefined: undefined$1,
  sharedItems,
  index,
  parent,
  givenName: _givenName = undefined$1,
  dataTransformer
}) => {
  const selectedComponent = {
    ...data[name],
    givenName: _givenName
  };
  if (selectedComponent === undefined$1) return null;
  const proxyHandler = {
    get(target, prop, receiver) {
      if (typeof target[prop] === "object" && target[prop] !== null) {
        console.log("dyno ;)", target[prop], "proxyHanlerrrrrrrr me ;)");
        return new Proxy(target[prop], proxyHandler);
      }
      return dataTransformer(target[prop], prop, target)({
        ...sharedItems.localFunction,
        sharedItems: {
          ...sharedItems,
          index
        }
      });
    }
  };
  const proxyItem = new Proxy({
    ...selectedComponent,
    sharedItems: sharedItems
  }, proxyHandler);
  if ((proxyItem === null || proxyItem === void 0 ? void 0 : proxyItem.visible) === false) return null;
  return renderComponentForm$1(proxyItem, updateReference, myComponents, getValues, {
    ...errors
  }, ControlledComponents, components, managedCallback, undefined$1, sharedItems, index, data, parent, dataTransformer);
};
const renderComponentForm$1 = (item, updateReference, myControl, getValue, errorss, ControlledComponents, components, managedCallback, parentName, sharedItems, index, data, parent, dataTransformer) => {
  console.log("dyno ;)", errorss, 'dataerrors');
  const {
    register,
    handleSubmit,
    watch,
    errors,
    control,
    trigger,
    setFocus,
    getValues,
    setValue,
    useFieldArray,
    useWatch,
    triggerBackground
  } = sharedItems;
  const name = parentName && `${parentName}.${item.name}` || item.givenName && item.givenName || item.name;
  let result = null;
  let child = [];
  if (item.items) {
    child = item.items.map((name, idx) => renderComponentInd$1(name, data, {
      updateReference,
      myControl,
      getValue,
      errors,
      ControlledComponents,
      components,
      managedCallback,
      parentName: (item === null || item === void 0 ? void 0 : item.items) && name || undefined,
      sharedItems,
      index: idx,
      data,
      parent: {
        name: item.name,
        index,
        id: item.id
      },
      itemName: name,
      dataTransformer
    }));
  }
  const validation = {
    maxLength: item.maxLength && item.maxLength.value !== "" && item.maxLength || undefined,
    minLength: item.minLength && item.minLength.value !== "" && item.minLength || undefined,
    max: item.max && item.max.value !== "" && item.max || undefined,
    min: item.min && item.min.value !== "" && item.min || undefined,
    pattern: item.pattern && item.pattern.value !== "" && item.pattern || undefined,
    required: item.required && item.required.value !== "" && item.required || undefined
  };
  const {
    validate = {}
  } = (item === null || item === void 0 ? void 0 : item.rule) || {
    validate: {}
  };
  if (item !== null && item !== void 0 && item.rule) {
    console.log("dyno ;)", validate, 'validate[', sharedItems === null || sharedItems === void 0 ? void 0 : sharedItems.localFunction);
    Object.keys(validate).forEach(key => {
      if (typeof validate[key] === "function") return;
      validate[key] = sharedItems === null || sharedItems === void 0 ? void 0 : sharedItems.localFunction[key](validate[key])({
        ...sharedItems,
        getItem: () => item
      });
      console.log("dyno ;)", validate, 'validate[ within', validate[key]);
    });
    console.log("dyno ;)", validate, 'validate[ after');
  }
  result = /*#__PURE__*/React__default.createElement(Controller, {
    key: item.isArray === true && `${name}container` || name,
    name: item.isArray === true && `${name}container` || name,
    control: control,
    item: {
      ...item,
      index
    },
    rules: {
      ...item.rule
    } || validation,
    render: ({
      field
    }) => {
      if (item.isArray) {
        console.log("dyno ;)", name, item.items, "useFieldArray");
        const {
          fields,
          append,
          remove
        } = useFieldArray({
          control,
          name: name,
          rules: {
            ...item.rule
          } || validation
        });
        child = /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("ul", null, fields.map((el, index) => /*#__PURE__*/React__default.createElement("li", {
          key: el.id
        }, item.items.map((element, indx) => /*#__PURE__*/React__default.createElement(Controller, {
          key: `${name}.${index}.${data[element].name}`,
          name: `${name}.${index}.${data[element].name}`,
          control: control,
          render: ({
            field
          }) => {
            console.log("dyno ;)", `${name}.${index}.${element}`, '`${name}.${index}.${element}`');
            return renderComponentInd$1(element, {
              ...data,
              index
            }, {
              updateReference,
              myControl,
              getValue,
              errors,
              ControlledComponents,
              components,
              managedCallback,
              parentName: (item === null || item === void 0 ? void 0 : item.items) && name || undefined,
              sharedItems: {
                ...sharedItems,
                append,
                remove: () => remove(index)
              },
              index: index,
              data,
              parent: {
                name: item.name,
                index,
                id: item.id
              },
              givenName: `${name}.${index}.${data[element].name}`,
              dataTransformer
            });
          }
        })), /*#__PURE__*/React__default.createElement("button", {
          type: "button",
          onClick: () => remove(index)
        }, "-")))), /*#__PURE__*/React__default.createElement("button", {
          type: "button",
          onClick: () => append({})
        }, "+"));
      }
      const Component = components(item.type, {
        field,
        item,
        name,
        index,
        managedCallback,
        child,
        useFieldArray,
        error: errors,
        sharedItems,
        parent
      });
      return Component;
    }
  });
  return result;
};
const convertIdToRef$2 = (array, key, name, parent, isArray) => {
  const result = array.reduce((obj, item, currentIndex) => {
    const itemName = isArray === undefined && item[key] || `${parent}.0.${item[key]}`;
    const refId = name && `${name}.items[${currentIndex}]` || `[${currentIndex}]`;
    return {
      ...obj,
      [itemName]: {
        ...item,
        name: itemName,
        refId,
        ...(parent && {
          parent
        })
      },
      ...(item.items !== undefined && convertIdToRef$2(item.items, 'name', refId, item[key], item.isArray))
    };
  }, new Map());
  return result;
};
const resetItems$2 = (array, key, name, parent) => {
  const result = array.reduce((obj, item, currentIndex) => {
    const refId = name && `${name}.items[${currentIndex}]` || `[${currentIndex}]`;
    return {
      ...obj,
      [item[key]]: {
        ...item,
        refId,
        value: "",
        ...(parent && {
          parent
        })
      },
      ...(item.items !== undefined && convertIdToRef$2(item.items, 'name', refId, item[key]))
    };
  }, new Map());
  return result;
};
const prepareWtchingComponents$2 = (items, key) => {
  const initialValue = new Map();
  Object.keys(items).forEach(key => {
    if (items[key].watch) {
      initialValue.set(items[key].name);
    }
    if (items[key].preCondition) {
      const preConditionObj = convertArrayToObject$2(items[key].preCondition, 'value');
      const keys = Object.keys(preConditionObj);
      for (let index = 0; index < keys.length; index++) {
        const internalItem = preConditionObj[keys[index]];
        console.log("dyno ;)", items[key], 'items[key]');
        initialValue.set(internalItem.name, [...(initialValue.get(internalItem.name) && initialValue.get(internalItem.name) || []), {
          refId: items[key].id,
          ...internalItem
        }]);
      }
    }
  });
  return initialValue;
};
const convertArrayToObject$2 = (array, key, value) => {
  const initialValue = {};
  if (!Array.isArray(array)) return;
  const givenArray = array.concat();
  return givenArray.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: value && item[value] || value === undefined && item || ''
    };
  }, initialValue);
};
let renderCount$2 = 0;
const FormBuilderNext$1 = React__default.forwardRef(({
  items,
  validationResolver,
  ControlledComponents,
  components,
  managedCallback,
  localFunction,
  shouldUnregister: _shouldUnregister = true,
  defaultValues: _defaultValues = {},
  devMode: _devMode = false,
  dataTransformer: _dataTransformer = dataTransformer,
  dataStore
}, ref) => {
  var _data$root, _data$root$items;
  if (!_devMode) {
    console.log = function () {
      const log = console.log;
      return function () {
        const args = Array.from(arguments);
        if (!args.includes("dyno ;)")) {
          log.apply(console, args);
        }
      };
    }();
  }
  const proxyHandler = {
    get(target, prop, receiver) {
      if (typeof target[prop] === "object" && target[prop] !== null) {
        console.log("dyno ;)", target[prop], "dddproxyHanlerrrrrrrr me ;)");
        return new Proxy(target[prop], proxyHandler);
      }
      return _dataTransformer(target[prop], prop, target)({
        ...localFunction,
        sharedItems: {
          dataStore
        }
      });
    }
  };
  const proxyDefaultValues = new Proxy({
    ..._defaultValues
  }, proxyHandler);
  console.log("dyno ;)", _defaultValues, "defaultValues", {
    ...proxyDefaultValues
  }, dataStore);
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isDirty,
      isValid
    },
    control,
    trigger,
    setFocus,
    getValues,
    setValue,
    triggerBackground,
    triggerBackgroundOptimised,
    triggerCustom,
    unregister,
    clearErrors,
    reset
  } = useForm$1({
    mode: 'onChange',
    shouldUnregister: true,
    reValidateMode: 'onChange',
    defaultValues: {
      ...proxyDefaultValues
    }
  });
  React__default.useEffect(() => {
    reset({
      ...proxyDefaultValues
    });
  }, [_defaultValues]);
  const sharedItems = {
    register,
    handleSubmit,
    watch,
    errors,
    control,
    trigger,
    setFocus,
    getValues,
    setValue,
    useFieldArray,
    useWatch,
    triggerBackground,
    triggerBackgroundOptimised,
    unregister,
    localFunction: {
      ...localFunction,
      reset: reset,
      triggerBackground: () => !_.isEmpty(errors),
      getValues,
      triggerBackgroundOptimised: formId => {
        const result = triggerBackgroundOptimised(formId)().then(r => r);
        console.log('yasssss', result);
        return result;
      },
      triggerGroup: async resources => {
        const localErrors = await triggerBackgroundOptimised()(true);
        let result = true;
        for (let i = 0; i < resources.length; i++) {
          const item = resources[i];
          const isItemExist = localErrors[item];
          if (isItemExist) {
            result = false;
            break;
          }
        }
        return result;
      }
    },
    dataStore,
    clearErrors
  };
  const myComponents = React__default.useRef();
  const watchingComponents = React__default.useRef();
  const preConditionItems = React__default.useRef();
  const [data, setData] = useState();
  React__default.useEffect(() => {
    if (items === undefined) return;
    myComponents.current = items;
    watchingComponents.current = prepareWtchingComponents$2(myComponents.current);
    console.log("dyno ;)", myComponents, 'myComponentsmyComponents');
    console.log("dyno ;)", watchingComponents, 'prepareWtchingComponents', [...watchingComponents.current.keys()]);
    const subscription = watch(async (value, {
      name,
      type
    }) => {
      if (watchingComponents.current.get(name)) {
        const allValues = Object.assign(value, dataStore);
        console.log("dyno ;)", "origincheckPreCondition ;) checkPreCondition", value, name, type, data, items);
        const [a, b] = await checkPreCondition(name, allValues[name], items);
        if (!deepEqual(data, b) && a) {
          setData({
            ...b
          });
          return;
        }
      } else if (watchingComponents.current.has(name)) {
        console.log("dyno ;)", watchingComponents.current.has(name), "before checkPreCondition ;) checkPreCondition", value, name, type, {
          data
        }, items);
        setData({
          ...items
        });
        return;
      }
    });
    setData(items);
  }, [items]);
  const resetValues = () => {
    myComponents.current = resetItems$2(items, 'name');
    setData(items);
  };
  const getValuesPOC = async (options = {
    triggerAll: false
  }) => {
    if (Object.keys(errors).length > 0) return false;
    const result = await triggerCustom(options);
    console.log("dyno ;)", "SUBMITFORM SUBMITFORM result trigger", result, errors, options);
    if (result === true) {
      return await getValues();
    } else {
      return false;
    }
  };
  ref.current = {
    getValuesByGroup: async props => {
      const valid = await sharedItems.localFunction.triggerGroup(props);
      if (valid) {
        const result = await getValues();
        return result;
      }
      return valid;
    },
    getValues: options => getValuesPOC(options),
    getGroupValuesBackground: async props => {
      console.log(props, 'getValuesBackgroundgetValuesBackgroundgetValuesBackground');
      if (Array.isArray(props)) {
        const valid = await sharedItems.localFunction.triggerGroup(props);
        if (valid) {
          const result = await getValues();
          return result;
        }
        return valid;
      }
      return getValuesPOC();
    },
    getValuesBackground: async (validation = true) => {
      if (validation) {
        if (Object.keys(errors).length > 0) return false;
        const _result = await triggerBackgroundOptimised()(true);
        console.log("dyno ;)", "SUBMITFORM SUBMITFORM result trigger", _result, errors);
        if (_.isEmpty(_result)) {
          return await getValues();
        } else {
          return false;
        }
      }
      const result = await getValues();
      return result;
    },
    resetValues: resetValues,
    setValue: setValue,
    errors: errors,
    reset,
    clearErrors,
    localFunction: sharedItems.localFunction
  };
  const validationOnce = async (name, value, result) => {
    const validatedItem = myComponents.current[name];
    let n = result;
    const originalErrors = {
      ...errors.current
    } || {};
    const newErrors = errors.current || {};
    if (value !== '') {
      const _error = value === '313';
      if (_error) {
        newErrors[name] = {
          error: _error,
          errorMsg: validatedItem.errorMsg && validatedItem.errorMsg || '313 cant be here.'
        };
      } else {
        delete newErrors[name];
      }
    } else {
      delete newErrors[name];
    }
    errors.current = {
      ...newErrors
    };
    console.log("dyno ;)", errors, "errrrrrrrrr", newErrors);
    return [!_.isEqual(originalErrors, newErrors), [...n], newErrors[name]];
  };
  const updateReference = async (value, name) => {
    myComponents.current[name].value = value;
    console.log("dyno ;)", myComponents.current, 'getValues', await getValuesPOC());
    const [hasValidationChanged, result, error] = await validationOnce(name, value, {
      ...data
    });
    const [hasPreconditionChanged, preResult] = await checkPreCondition(name, value, data);
    if (hasValidationChanged === true || hasPreconditionChanged === true) {
      console.log("dyno ;)", 'lololololololololololoolol', hasValidationChanged, hasPreconditionChanged, errors);
      setData({
        ...preResult
      });
    }
  };
  const checkPreCondition = async (name, value, result) => {
    const hasCondition = watchingComponents.current.get(name);
    console.log("dyno ;)", data, "checkPreConditionInside", name, myComponents.current, hasCondition, watchingComponents.current);
    let n = {
      ...result
    };
    let updated = false;
    if (hasCondition !== undefined) {
      await hasCondition.map(async item => {
        const realValue = value && value["value"] || value;
        const touched = (item === null || item === void 0 ? void 0 : item.type) && (await validationResolver[item.type](item, realValue));
        const i = n[item.refId];
        console.log("dyno ;)", n["accountNo"], "accountNoaccountNo", '-----', i);
        if (i !== undefined && i.visible !== touched) {
          n[item.refId].visible = touched;
          updated = true;
        }
      });
    }
    return [updated, n];
  };
  console.log("dyno ;)", 'renderCount', renderCount$2++);
  return data && ((_data$root = data.root) === null || _data$root === void 0 ? void 0 : (_data$root$items = _data$root.items) === null || _data$root$items === void 0 ? void 0 : _data$root$items.map((name, index) => renderComponentInd$1(name, data, {
    updateReference,
    myComponents,
    getValues,
    errors,
    ControlledComponents,
    components,
    managedCallback,
    undefined,
    sharedItems,
    index,
    dataTransformer: _dataTransformer
  }))) || null;
});
FormBuilderNext$1.whyDidYouRender = true;
FormBuilderNext$1.displayName = "FormBuilderNext";

export { Controller, FormBuilderV1 as DynoBuilder, FormBuilderNext, FormBuilderNext$1 as FormBuilderV4, FormProvider, actionsRunner, appendErrors, get, set, setupProxy, transformer, useController, useDynamoHistory, useFieldArray, useForm, useFormContext, useFormState, useHistory, useWatch };
//# sourceMappingURL=index.modern.js.map
