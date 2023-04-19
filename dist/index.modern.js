import React__default, { createContext, useContext, createElement, useRef, useState, useEffect, useCallback, isValidElement, useMemo } from 'react';
import _ from 'lodash';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var isCheckBoxInput = (function (element) {
  return element.type === 'checkbox';
});

var isDateObject = (function (data) {
  return data instanceof Date;
});

var isNullOrUndefined = (function (value) {
  return value == null;
});

var isObjectType = function isObjectType(value) {
  return typeof value === 'object';
};
var isObject = (function (value) {
  return !isNullOrUndefined(value) && !Array.isArray(value) && isObjectType(value) && !isDateObject(value);
});

var getControllerValue = (function (event) {
  return isObject(event) && event.target ? isCheckBoxInput(event.target) ? event.target.checked : event.target.value : event;
});

var getNodeParentName = (function (name) {
  return name.substring(0, name.search(/.\d/)) || name;
});

var isNameInFieldArray = (function (names, name) {
  return [].concat(names).some(function (current) {
    return getNodeParentName(name) === current;
  });
});

var compact = (function (value) {
  return value.filter(Boolean);
});

var isUndefined = (function (val) {
  return val === undefined;
});

var get = (function (obj, path, defaultValue) {
  if (isObject(obj) && path) {
    var result = compact(path.split(/[,[\].]+?/)).reduce(function (result, key) {
      return isNullOrUndefined(result) ? result : result[key];
    }, obj);
    return isUndefined(result) || result === obj ? isUndefined(obj[path]) ? defaultValue : obj[path] : result;
  }
  return undefined;
});

var EVENTS = {
  BLUR: 'blur',
  CHANGE: 'change'
};
var VALIDATION_MODE = {
  onBlur: 'onBlur',
  onChange: 'onChange',
  onSubmit: 'onSubmit',
  onTouched: 'onTouched',
  all: 'all'
};
var INPUT_VALIDATION_RULES = {
  max: 'max',
  min: 'min',
  maxLength: 'maxLength',
  minLength: 'minLength',
  pattern: 'pattern',
  required: 'required',
  validate: 'validate'
};

var omit = (function (source, key) {
  var copy = Object.assign({}, source);
  delete copy[key];
  return copy;
});

var FormContext = createContext(null);
FormContext.displayName = 'RHFContext';
var useFormContext = function useFormContext() {
  return useContext(FormContext);
};
var FormProvider = function FormProvider(props) {
  return createElement(FormContext.Provider, {
    value: omit(props, 'children')
  }, props.children);
};

var getProxyFormState = (function (formState, _proxyFormState, localProxyFormState, isRoot) {
  if (isRoot === void 0) {
    isRoot = true;
  }
  function createGetter(prop) {
    return function () {
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
  var result = {};
  for (var key in formState) {
    Object.defineProperty(result, key, {
      get: createGetter(key)
    });
  }
  return result;
});

var isEmptyObject = (function (value) {
  return isObject(value) && !Object.keys(value).length;
});

var shouldRenderFormState = (function (formStateData, _proxyFormState, isRoot) {
  var formState = omit(formStateData, 'name');
  return isEmptyObject(formState) || Object.keys(formState).length >= Object.keys(_proxyFormState).length || Object.keys(formState).find(function (key) {
    return _proxyFormState[key] === (!isRoot || VALIDATION_MODE.all);
  });
});

var convertToArrayPayload = (function (value) {
  return Array.isArray(value) ? value : [value];
});

function useFormState(props) {
  var methods = useFormContext();
  var _ref = props || {},
    _ref$control = _ref.control,
    control = _ref$control === void 0 ? methods.control : _ref$control,
    disabled = _ref.disabled,
    name = _ref.name;
  var nameRef = useRef(name);
  var _React$useState = useState(control._formState.val),
    formState = _React$useState[0],
    updateFormState = _React$useState[1];
  var _localProxyFormState = useRef({
    isDirty: false,
    dirtyFields: false,
    touchedFields: false,
    isValidating: false,
    isValid: false,
    errors: false
  });
  nameRef.current = name;
  useEffect(function () {
    var formStateSubscription = control._subjects.state.subscribe({
      next: function next(formState) {
        return (!nameRef.current || !formState.name || convertToArrayPayload(nameRef.current).includes(formState.name)) && shouldRenderFormState(formState, _localProxyFormState.current) && updateFormState(Object.assign(Object.assign({}, control._formState.val), formState));
      }
    });
    disabled && formStateSubscription.unsubscribe();
    return function () {
      return formStateSubscription.unsubscribe();
    };
  }, [disabled, control]);
  return getProxyFormState(formState, control._proxyFormState, _localProxyFormState.current, false);
}

function useController(props) {
  var methods = useFormContext();
  var name = props.name,
    _props$control = props.control,
    control = _props$control === void 0 ? methods.control : _props$control,
    shouldUnregister = props.shouldUnregister,
    item = props.item;
  console.log("dyno ;)", item, "useController");
  var _React$useState = useState(get(control._formValues, name, get(control._defaultValues, name, props.defaultValue))),
    value = _React$useState[0],
    setInputStateValue = _React$useState[1];
  var formState = useFormState({
    control: control || methods.control,
    name: name
  });
  var registerProps = control.register(name, Object.assign(Object.assign({}, _extends({}, props.rules, {
    item: _extends({}, item)
  })), {
    value: value
  }));
  var updateMounted = useCallback(function (name, value) {
    var field = get(control._fields, name);
    if (field) {
      field._f.mount = value;
    }
  }, [control]);
  useEffect(function () {
    var controllerSubscription = control._subjects.control.subscribe({
      next: function next(data) {
        return (!data.name || name === data.name) && setInputStateValue(get(data.values, name));
      }
    });
    updateMounted(name, true);
    return function () {
      controllerSubscription.unsubscribe();
      var _shouldUnregisterField = control._shouldUnregister || shouldUnregister;
      if (isNameInFieldArray(control._names.array, name) ? _shouldUnregisterField && !control._isInAction.val : _shouldUnregisterField) {
        control.unregister(name);
      } else {
        updateMounted(name, false);
      }
    };
  }, [name, control, shouldUnregister, updateMounted]);
  return {
    field: {
      onChange: function onChange(event) {
        var value = getControllerValue(event);
        setInputStateValue(value);
        registerProps.onChange({
          target: {
            value: value,
            name: name
          },
          type: EVENTS.CHANGE
        });
      },
      onBlur: function onBlur() {
        registerProps.onBlur({
          target: {
            name: name
          },
          type: EVENTS.BLUR
        });
      },
      name: name,
      value: value,
      ref: function ref(elm) {
        return elm && registerProps.ref({
          focus: function focus() {
            return elm.focus && elm.focus();
          },
          setCustomValidity: function setCustomValidity(message) {
            return elm.setCustomValidity(message);
          },
          reportValidity: function reportValidity() {
            return elm.reportValidity();
          }
        });
      }
    },
    formState: formState,
    fieldState: {
      invalid: !!get(formState.errors, name),
      isDirty: !!get(formState.dirtyFields, name),
      isTouched: !!get(formState.touchedFields, name),
      error: get(formState.errors, name)
    }
  };
}

var Controller = function Controller(props) {
  return props.render(useController(props));
};

var appendErrors = (function (name, validateAllFieldCriteria, errors, type, message) {
  var _Object$assign;
  return validateAllFieldCriteria ? Object.assign(Object.assign({}, errors[name]), {
    types: Object.assign(Object.assign({}, errors[name] && errors[name].types ? errors[name].types : {}), (_Object$assign = {}, _Object$assign[type] = message || true, _Object$assign))
  }) : {};
});

var isKey = (function (value) {
  return /^\w*$/.test(value);
});

var stringToPath = (function (input) {
  return compact(input.replace(/["|']|\]/g, '').split(/\.|\[/));
});

function set(object, path, value) {
  var index = -1;
  var tempPath = isKey(path) ? [path] : stringToPath(path);
  var length = tempPath.length;
  var lastIndex = length - 1;
  while (++index < length) {
    var key = tempPath[index];
    var newValue = value;
    if (index !== lastIndex) {
      var objValue = object[key];
      newValue = isObject(objValue) || Array.isArray(objValue) ? objValue : !isNaN(+tempPath[index + 1]) ? [] : {};
    }
    object[key] = newValue;
    object = object[key];
  }
  return object;
}

var focusFieldBy = function focusFieldBy(fields, callback, fieldsNames) {
  for (var _iterator = _createForOfIteratorHelperLoose(fieldsNames || Object.keys(fields)), _step; !(_step = _iterator()).done;) {
    var key = _step.value;
    var field = get(fields, key);
    if (field) {
      var _f = field._f;
      var current = omit(field, '_f');
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

var getFocusFieldName = (function (name, index, options) {
  return options && !options.shouldFocus ? options.focusName || name + "." + options.focusIndex + "." : name + "." + index + ".";
});

var generateId = (function () {
  var d = typeof performance === 'undefined' ? Date.now() : performance.now() * 1000;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16 + d) % 16 | 0;
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
});

var mapIds = (function (values, keyName) {
  if (values === void 0) {
    values = [];
  }
  return values.map(function (value) {
    var _Object$assign;
    return Object.assign((_Object$assign = {}, _Object$assign[keyName] = value && value[keyName] || generateId(), _Object$assign), value);
  });
});

function append(data, value) {
  return [].concat(convertToArrayPayload(data), convertToArrayPayload(value));
}

var fillEmptyArray = (function (value) {
  return Array.isArray(value) ? Array(value.length).fill(undefined) : undefined;
});

function insert(data, index, value) {
  return [].concat(data.slice(0, index), convertToArrayPayload(value), data.slice(index));
}

var moveArrayAt = (function (data, from, to) {
  if (Array.isArray(data)) {
    if (isUndefined(data[to])) {
      data[to] = undefined;
    }
    data.splice(to, 0, data.splice(from, 1)[0]);
    return data;
  }
  return [];
});

var omitKey = (function (fields, keyName) {
  return fields.map(function (field) {
    if (field === void 0) {
      field = {};
    }
    return omit(field, keyName);
  });
});

function prepend(data, value) {
  return [].concat(convertToArrayPayload(value), convertToArrayPayload(data));
}

function removeAtIndexes(data, indexes) {
  var i = 0;
  var temp = [].concat(data);
  for (var _iterator = _createForOfIteratorHelperLoose(indexes), _step; !(_step = _iterator()).done;) {
    var index = _step.value;
    temp.splice(index - i, 1);
    i++;
  }
  return compact(temp).length ? temp : [];
}
var removeArrayAt = (function (data, index) {
  return isUndefined(index) ? [] : removeAtIndexes(data, convertToArrayPayload(index).sort(function (a, b) {
    return a - b;
  }));
});

var swapArrayAt = (function (data, indexA, indexB) {
  data[indexA] = [data[indexB], data[indexB] = data[indexA]][0];
});

var isBoolean = (function (value) {
  return typeof value === 'boolean';
});

function baseGet(object, updatePath) {
  var length = updatePath.slice(0, -1).length;
  var index = 0;
  while (index < length) {
    object = isUndefined(object) ? index++ : object[updatePath[index++]];
  }
  return object;
}
function unset(object, path) {
  var updatePath = isKey(path) ? [path] : stringToPath(path);
  var childObject = updatePath.length == 1 ? object : baseGet(object, updatePath);
  var key = updatePath[updatePath.length - 1];
  var previousObjRef;
  if (childObject) {
    delete childObject[key];
  }
  for (var k = 0; k < updatePath.slice(0, -1).length; k++) {
    var index = -1;
    var objectRef = void 0;
    var currentPaths = updatePath.slice(0, -(k + 1));
    var currentPathsLength = currentPaths.length - 1;
    if (k > 0) {
      previousObjRef = object;
    }
    while (++index < currentPaths.length) {
      var item = currentPaths[index];
      objectRef = objectRef ? objectRef[item] : object[item];
      if (currentPathsLength === index && (isObject(objectRef) && isEmptyObject(objectRef) || Array.isArray(objectRef) && !objectRef.filter(function (data) {
        return isObject(data) && !isEmptyObject(data) || isBoolean(data);
      }).length)) {
        previousObjRef ? delete previousObjRef[item] : delete object[item];
      }
      previousObjRef = objectRef;
    }
  }
  return object;
}

var updateAt = (function (fieldValues, index, value) {
  fieldValues[index] = value;
  return fieldValues;
});

var useFieldArray = function useFieldArray(props) {
  var methods = useFormContext();
  var _props$control = props.control,
    control = _props$control === void 0 ? methods.control : _props$control,
    name = props.name,
    _props$keyName = props.keyName,
    keyName = _props$keyName === void 0 ? 'id' : _props$keyName,
    shouldUnregister = props.shouldUnregister;
  var _focusName = useRef('');
  var _React$useState = useState(mapIds(control._getFieldArrayValue(name), keyName)),
    fields = _React$useState[0],
    setFields = _React$useState[1];
  control._names.array.add(name);
  var append$1 = function append$1(value, options) {
    var appendValue = convertToArrayPayload(value);
    var updatedFieldArrayValues = append(control._getFieldArrayValue(name), appendValue);
    control._bathFieldArrayUpdate(keyName, name, append, {
      argA: fillEmptyArray(value)
    }, updatedFieldArrayValues, false);
    setFields(mapIds(updatedFieldArrayValues, keyName));
    _focusName.current = getFocusFieldName(name, updatedFieldArrayValues.length - appendValue.length, options);
  };
  var prepend$1 = function prepend$1(value, options) {
    var updatedFieldArrayValues = prepend(control._getFieldArrayValue(name), convertToArrayPayload(value));
    control._bathFieldArrayUpdate(keyName, name, prepend, {
      argA: fillEmptyArray(value)
    }, updatedFieldArrayValues);
    setFields(mapIds(updatedFieldArrayValues, keyName));
    _focusName.current = getFocusFieldName(name, 0, options);
  };
  var remove = function remove(index) {
    var updatedFieldArrayValues = removeArrayAt(control._getFieldArrayValue(name), index);
    control._bathFieldArrayUpdate(keyName, name, removeArrayAt, {
      argA: index
    }, updatedFieldArrayValues);
    setFields(mapIds(updatedFieldArrayValues, keyName));
  };
  var insert$1 = function insert$1(index, value, options) {
    var updatedFieldArrayValues = insert(control._getFieldArrayValue(name), index, convertToArrayPayload(value));
    control._bathFieldArrayUpdate(keyName, name, insert, {
      argA: index,
      argB: fillEmptyArray(value)
    }, updatedFieldArrayValues);
    setFields(mapIds(updatedFieldArrayValues, keyName));
    _focusName.current = getFocusFieldName(name, index, options);
  };
  var swap = function swap(indexA, indexB) {
    var fieldValues = control._getFieldArrayValue(name);
    swapArrayAt(fieldValues, indexA, indexB);
    control._bathFieldArrayUpdate(keyName, name, swapArrayAt, {
      argA: indexA,
      argB: indexB
    }, fieldValues, false);
    setFields(mapIds(fieldValues, keyName));
  };
  var move = function move(from, to) {
    var fieldValues = control._getFieldArrayValue(name);
    moveArrayAt(fieldValues, from, to);
    control._bathFieldArrayUpdate(keyName, name, moveArrayAt, {
      argA: from,
      argB: to
    }, fieldValues, false);
    setFields(mapIds(fieldValues, keyName));
  };
  var update = function update(index, value) {
    var fieldValues = control._getFieldArrayValue(name);
    var updatedFieldArrayValues = updateAt(fieldValues, index, value);
    control._bathFieldArrayUpdate(keyName, name, updateAt, {
      argA: index,
      argB: value
    }, fieldValues, true, false);
    setFields(mapIds(updatedFieldArrayValues, keyName));
  };
  useEffect(function () {
    control._isInAction.val = false;
    if (control._names.watchAll) {
      control._subjects.state.next({});
    } else {
      for (var _iterator = _createForOfIteratorHelperLoose(control._names.watch), _step; !(_step = _iterator()).done;) {
        var watchField = _step.value;
        if (name.startsWith(watchField)) {
          control._subjects.state.next({});
          break;
        }
      }
    }
    control._subjects.watch.next({
      name: name,
      values: control._formValues
    });
    _focusName.current && focusFieldBy(control._fields, function (key) {
      return key.startsWith(_focusName.current);
    });
    _focusName.current = '';
    control._subjects.array.next({
      name: name,
      values: omitKey([].concat(fields), keyName)
    });
    control._proxyFormState.isValid && control._updateValid();
  }, [fields, name, control, keyName]);
  useEffect(function () {
    var fieldArraySubscription = control._subjects.array.subscribe({
      next: function next(payload) {
        if (payload.isReset) {
          unset(control._fields, payload.name || name);
          unset(control._formValues, payload.name || name);
          payload.name ? set(control._formValues, payload.name, payload.values) : payload.values && (control._formValues = payload.values);
          setFields(mapIds(get(control._formValues, name), keyName));
        }
      }
    });
    !get(control._formValues, name) && set(control._formValues, name, []);
    return function () {
      fieldArraySubscription.unsubscribe();
      if (control._shouldUnregister || shouldUnregister) {
        control.unregister(name);
        unset(control._formValues, name);
      } else {
        var fieldArrayValues = get(control._formValues, name);
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

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/(function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

function _isSettledPact(thenable) {
	return thenable instanceof _Pact && thenable.s & 1;
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
	var i = -1, pact, reject;
	function _cycle(result) {
		try {
			while (++i < array.length && (!check || !check())) {
				result = body(i);
				if (result && result.then) {
					if (_isSettledPact(result)) {
						result = result.v;
					} else {
						result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
						return;
					}
				}
			}
			if (pact) {
				_settle(pact, 1, result);
			} else {
				pact = result;
			}
		} catch (e) {
			_settle(pact || (pact = new _Pact()), 2, e);
		}
	}
	_cycle();
	return pact;
}

// Asynchronously iterate through an object's properties (including properties inherited from the prototype)
// Uses a snapshot of the object's properties
function _forIn(target, body, check) {
	var keys = [];
	for (var key in target) {
		keys.push(key);
	}
	return _forTo(keys, function(i) { return body(keys[i]); }, check);
}

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

// Asynchronously await a promise and pass the result to a finally continuation
function _finallyRethrows(body, finalizer) {
	try {
		var result = body();
	} catch (e) {
		return finalizer(true, e);
	}
	if (result && result.then) {
		return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
	}
	return finalizer(false, result);
}

var debounce = (function (callback, wait) {
  var timer = 0;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(timer);
    timer = window.setTimeout(function () {
      return callback.apply(void 0, args);
    }, wait);
  };
});

var isPrimitive = (function (value) {
  return isNullOrUndefined(value) || !isObjectType(value);
});

function deepEqual(object1, object2) {
  if (isPrimitive(object1) || isPrimitive(object2) || isDateObject(object1) || isDateObject(object2)) {
    return object1 === object2;
  }
  var keys1 = Object.keys(object1);
  var keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (var _i = 0, _keys = keys1; _i < _keys.length; _i++) {
    var key = _keys[_i];
    var val1 = object1[key];
    if (!keys2.includes(key)) {
      return false;
    }
    if (key !== 'ref') {
      var val2 = object2[key];
      if ((isObject(val1) || Array.isArray(val1)) && (isObject(val2) || Array.isArray(val2)) ? !deepEqual(val1, val2) : val1 !== val2) {
        return false;
      }
    }
  }
  return true;
}

var getValidationModes = (function (mode) {
  return {
    isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,
    isOnBlur: mode === VALIDATION_MODE.onBlur,
    isOnChange: mode === VALIDATION_MODE.onChange,
    isOnAll: mode === VALIDATION_MODE.all,
    isOnTouch: mode === VALIDATION_MODE.onTouched
  };
});

var isFileInput = (function (element) {
  return element.type === 'file';
});

var isFunction = (function (value) {
  return typeof value === 'function';
});

var isHTMLElement = (function (value) {
  return value instanceof HTMLElement;
});

var isMultipleSelect = (function (element) {
  return element.type === "select-multiple";
});

var isRadioInput = (function (element) {
  return element.type === 'radio';
});

var isRadioOrCheckboxFunction = (function (ref) {
  return isRadioInput(ref) || isCheckBoxInput(ref);
});

var isString = (function (value) {
  return typeof value === 'string';
});

var isWeb = typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined' && typeof document !== 'undefined';

var Subscription = /*#__PURE__*/function () {
  function Subscription() {
    this.tearDowns = [];
  }
  var _proto = Subscription.prototype;
  _proto.add = function add(tearDown) {
    this.tearDowns.push(tearDown);
  };
  _proto.unsubscribe = function unsubscribe() {
    for (var _iterator = _createForOfIteratorHelperLoose(this.tearDowns), _step; !(_step = _iterator()).done;) {
      var teardown = _step.value;
      teardown();
    }
    this.tearDowns = [];
  };
  return Subscription;
}();
var Subscriber = /*#__PURE__*/function () {
  function Subscriber(observer, subscription) {
    var _this = this;
    this.observer = observer;
    this.closed = false;
    subscription.add(function () {
      return _this.closed = true;
    });
  }
  var _proto2 = Subscriber.prototype;
  _proto2.next = function next(value) {
    if (!this.closed) {
      this.observer.next(value);
    }
  };
  return Subscriber;
}();
var Subject = /*#__PURE__*/function () {
  function Subject() {
    this.observers = [];
  }
  var _proto3 = Subject.prototype;
  _proto3.next = function next(value) {
    for (var _iterator2 = _createForOfIteratorHelperLoose(this.observers), _step2; !(_step2 = _iterator2()).done;) {
      var observer = _step2.value;
      observer.next(value);
    }
  };
  _proto3.subscribe = function subscribe(observer) {
    var subscription = new Subscription();
    var subscriber = new Subscriber(observer, subscription);
    this.observers.push(subscriber);
    return subscription;
  };
  _proto3.unsubscribe = function unsubscribe() {
    this.observers = [];
  };
  return Subject;
}();

var defaultResult = {
  value: false,
  isValid: false
};
var validResult = {
  value: true,
  isValid: true
};
var getCheckboxValue = (function (options) {
  if (Array.isArray(options)) {
    if (options.length > 1) {
      var values = options.filter(function (option) {
        return option && option.checked && !option.disabled;
      }).map(function (option) {
        return option.value;
      });
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

var getFieldValueAs = (function (value, _ref) {
  var valueAsNumber = _ref.valueAsNumber,
    valueAsDate = _ref.valueAsDate,
    setValueAs = _ref.setValueAs;
  return isUndefined(value) ? value : valueAsNumber ? value === '' ? NaN : +value : valueAsDate ? new Date(value) : setValueAs ? setValueAs(value) : value;
});

var getMultipleSelectValue = (function (options) {
  return [].concat(options).filter(function (_ref) {
    var selected = _ref.selected;
    return selected;
  }).map(function (_ref2) {
    var value = _ref2.value;
    return value;
  });
});

var defaultReturn = {
  isValid: false,
  value: null
};
var getRadioValue = (function (options) {
  return Array.isArray(options) ? options.reduce(function (previous, option) {
    return option && option.checked && !option.disabled ? {
      isValid: true,
      value: option.value
    } : previous;
  }, defaultReturn) : defaultReturn;
});

function getFieldValue(field) {
  if (field && field._f) {
    var ref = field._f.ref;
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

var getResolverOptions = (function (fieldsNames, _fieldss, criteriaMode, shouldUseNativeValidation) {
  var fields = {};
  for (var _iterator = _createForOfIteratorHelperLoose(fieldsNames), _step; !(_step = _iterator()).done;) {
    var name = _step.value;
    var field = get(_fieldss, name);
    field && set(fields, name, field._f);
  }
  return {
    criteriaMode: criteriaMode,
    names: [].concat(fieldsNames),
    fields: fields,
    shouldUseNativeValidation: shouldUseNativeValidation
  };
});

var hasValidation = (function (options, mounted) {
  return mounted && options && (options.required || options.min || options.max || options.maxLength || options.minLength || options.pattern || options.validate);
});

function deepMerge(target, source) {
  if (isPrimitive(target) || isPrimitive(source)) {
    return source;
  }
  for (var key in source) {
    var targetValue = target[key];
    var sourceValue = source[key];
    try {
      target[key] = isObject(targetValue) && isObject(sourceValue) || Array.isArray(targetValue) && Array.isArray(sourceValue) ? deepMerge(targetValue, sourceValue) : sourceValue;
    } catch (_a) {}
  }
  return target;
}

function setDirtyFields(values, defaultValues, dirtyFields, parentNode, parentName) {
  var index = -1;
  while (++index < values.length) {
    for (var key in values[index]) {
      if (Array.isArray(values[index][key])) {
        !dirtyFields[index] && (dirtyFields[index] = {});
        dirtyFields[index][key] = [];
        setDirtyFields(values[index][key], get(defaultValues[index] || {}, key, []), dirtyFields[index][key], dirtyFields[index], key);
      } else {
        var _Object$assign;
        !isNullOrUndefined(defaultValues) && deepEqual(get(defaultValues[index] || {}, key), values[index][key]) ? set(dirtyFields[index] || {}, key) : dirtyFields[index] = Object.assign(Object.assign({}, dirtyFields[index]), (_Object$assign = {}, _Object$assign[key] = true, _Object$assign));
      }
    }
    parentNode && !dirtyFields.length && delete parentNode[parentName];
  }
  return dirtyFields;
}
var setFieldArrayDirtyFields = (function (values, defaultValues, dirtyFields) {
  return deepMerge(setDirtyFields(values, defaultValues, dirtyFields.slice(0, values.length)), setDirtyFields(defaultValues, values, dirtyFields.slice(0, values.length)));
});

var skipValidation = (function (_ref) {
  var isOnBlur = _ref.isOnBlur,
    isOnChange = _ref.isOnChange,
    isOnTouch = _ref.isOnTouch,
    isTouched = _ref.isTouched,
    isReValidateOnBlur = _ref.isReValidateOnBlur,
    isReValidateOnChange = _ref.isReValidateOnChange,
    isBlurEvent = _ref.isBlurEvent,
    isSubmitted = _ref.isSubmitted,
    isOnAll = _ref.isOnAll;
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

var unsetEmptyArray = (function (ref, name) {
  return !compact(get(ref, name, [])).length && unset(ref, name);
});

var isMessage = (function (value) {
  return isString(value) || isValidElement(value);
});

var isRegex = (function (value) {
  return value instanceof RegExp;
});

function getValidateError(result, ref, type) {
  if (type === void 0) {
    type = 'validate';
  }
  if (isMessage(result) || Array.isArray(result) && result.every(isMessage) || isBoolean(result) && !result) {
    return {
      type: type,
      message: isMessage(result) ? result : '',
      ref: ref
    };
  }
}

var getValueAndMessage = (function (validationData) {
  return isObject(validationData) && !isRegex(validationData) ? validationData : {
    value: validationData,
    message: ''
  };
});

var validateField = (function (field, inputValue, validateAllFieldCriteria, shouldUseNativeValidation) {
  try {
    var _temp4 = function _temp4(_result3) {
      if (_exit) return _result3;
      setCustomValidty(true);
      return error;
    };
    var _exit = false;
    var _field$_f = field._f,
      ref = _field$_f.ref,
      refs = _field$_f.refs,
      required = _field$_f.required,
      maxLength = _field$_f.maxLength,
      minLength = _field$_f.minLength,
      min = _field$_f.min,
      max = _field$_f.max,
      pattern = _field$_f.pattern,
      validate = _field$_f.validate,
      name = _field$_f.name,
      valueAsNumber = _field$_f.valueAsNumber,
      mount = _field$_f.mount;
    if (!mount) {
      return Promise.resolve({});
    }
    var inputRef = refs ? refs[0] : ref;
    var setCustomValidty = function setCustomValidty(message) {
      if (shouldUseNativeValidation && inputRef.reportValidity) {
        inputRef.setCustomValidity(isBoolean(message) ? '' : message || ' ');
        inputRef.reportValidity();
      }
    };
    var error = {};
    var isRadio = isRadioInput(ref);
    var isCheckBox = isCheckBoxInput(ref);
    var isRadioOrCheckbox = isRadio || isCheckBox;
    var isEmpty = (valueAsNumber || isFileInput(ref)) && !ref.value || inputValue === '' || Array.isArray(inputValue) && !inputValue.length;
    var appendErrorsCurry = appendErrors.bind(null, name, validateAllFieldCriteria, error);
    var getMinMaxMessage = function getMinMaxMessage(exceedMax, maxLengthMessage, minLengthMessage, maxType, minType) {
      if (maxType === void 0) {
        maxType = INPUT_VALIDATION_RULES.maxLength;
      }
      if (minType === void 0) {
        minType = INPUT_VALIDATION_RULES.minLength;
      }
      var message = exceedMax ? maxLengthMessage : minLengthMessage;
      error[name] = Object.assign({
        type: exceedMax ? maxType : minType,
        message: message,
        ref: ref
      }, appendErrorsCurry(exceedMax ? maxType : minType, message));
    };
    if (required && (!isRadioOrCheckbox && (isEmpty || isNullOrUndefined(inputValue)) || isBoolean(inputValue) && !inputValue || isCheckBox && !getCheckboxValue(refs).isValid || isRadio && !getRadioValue(refs).isValid)) {
      var _ref = isMessage(required) ? {
          value: !!required,
          message: required
        } : getValueAndMessage(required),
        value = _ref.value,
        message = _ref.message;
      if (value) {
        error[name] = Object.assign({
          type: INPUT_VALIDATION_RULES.required,
          message: message,
          ref: inputRef
        }, appendErrorsCurry(INPUT_VALIDATION_RULES.required, message));
        if (!validateAllFieldCriteria) {
          setCustomValidty(message);
          return Promise.resolve(error);
        }
      }
    }
    if (!isEmpty && (!isNullOrUndefined(min) || !isNullOrUndefined(max))) {
      var exceedMax;
      var exceedMin;
      var maxOutput = getValueAndMessage(max);
      var minOutput = getValueAndMessage(min);
      if (!isNaN(inputValue)) {
        var valueNumber = ref.valueAsNumber || parseFloat(inputValue);
        if (!isNullOrUndefined(maxOutput.value)) {
          exceedMax = valueNumber > maxOutput.value;
        }
        if (!isNullOrUndefined(minOutput.value)) {
          exceedMin = valueNumber < minOutput.value;
        }
      } else {
        var valueDate = ref.valueAsDate || new Date(inputValue);
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
          return Promise.resolve(error);
        }
      }
    }
    if ((maxLength || minLength) && !isEmpty && isString(inputValue)) {
      var maxLengthOutput = getValueAndMessage(maxLength);
      var minLengthOutput = getValueAndMessage(minLength);
      var _exceedMax = !isNullOrUndefined(maxLengthOutput.value) && inputValue.length > maxLengthOutput.value;
      var _exceedMin = !isNullOrUndefined(minLengthOutput.value) && inputValue.length < minLengthOutput.value;
      if (_exceedMax || _exceedMin) {
        getMinMaxMessage(_exceedMax, maxLengthOutput.message, minLengthOutput.message);
        if (!validateAllFieldCriteria) {
          setCustomValidty(error[name].message);
          return Promise.resolve(error);
        }
      }
    }
    if (pattern && !isEmpty && isString(inputValue)) {
      var _getValueAndMessage = getValueAndMessage(pattern),
        patternValue = _getValueAndMessage.value,
        _message = _getValueAndMessage.message;
      console.log("dyno ;)", isRegex(new RegExp(patternValue)), !inputValue.match(patternValue), patternValue, "patternValue");
      if (isRegex(new RegExp(patternValue)) && !inputValue.match(patternValue)) {
        error[name] = Object.assign({
          type: INPUT_VALIDATION_RULES.pattern,
          message: _message,
          ref: ref
        }, appendErrorsCurry(INPUT_VALIDATION_RULES.pattern, _message));
        if (!validateAllFieldCriteria) {
          setCustomValidty(_message);
          return Promise.resolve(error);
        }
      }
    }
    var _temp3 = function () {
      if (validate) {
        return function () {
          if (isFunction(validate)) {
            return Promise.resolve(validate(inputValue)).then(function (result) {
              var validateError = getValidateError(result, inputRef);
              if (validateError) {
                error[name] = Object.assign(Object.assign({}, validateError), appendErrorsCurry(INPUT_VALIDATION_RULES.validate, validateError.message));
                if (!validateAllFieldCriteria) {
                  setCustomValidty(validateError.message);
                  _exit = true;
                  return error;
                }
              }
            });
          } else return function () {
            if (isObject(validate)) {
              var _temp2 = function _temp2() {
                if (!isEmptyObject(_validationResult)) {
                  error[name] = Object.assign({
                    ref: inputRef
                  }, _validationResult);
                  if (!validateAllFieldCriteria) {
                    _exit = true;
                    return error;
                  }
                }
              };
              var _interrupt = false;
              var _validationResult = {};
              var _temp = _forIn(validate, function (key) {
                if (!isEmptyObject(_validationResult) && !validateAllFieldCriteria) {
                  _interrupt = true;
                  return;
                }
                return Promise.resolve(validate[key](inputValue)).then(function (_validate$key) {
                  var validateError = getValidateError(_validate$key, inputRef, key);
                  if (validateError) {
                    _validationResult = Object.assign(Object.assign({}, validateError), appendErrorsCurry(key, validateError.message));
                    setCustomValidty(validateError.message);
                    if (validateAllFieldCriteria) {
                      error[name] = _validationResult;
                    }
                  }
                });
              }, function () {
                return _interrupt;
              });
              return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
            }
          }();
        }();
      }
    }();
    return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3));
  } catch (e) {
    return Promise.reject(e);
  }
});

var defaultOptions = {
  mode: VALIDATION_MODE.onSubmit,
  reValidateMode: VALIDATION_MODE.onChange,
  shouldFocusError: true
};
var isWindowUndefined = typeof window === 'undefined';
function createFormControlV3(props) {
  if (props === void 0) {
    props = {};
  }
  var formOptions = Object.assign(Object.assign({}, defaultOptions), props);
  var _delayCallback;
  var _formState = {
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
  var _proxyFormState = {
    isDirty: false,
    dirtyFields: false,
    touchedFields: false,
    isValidating: false,
    isValid: false,
    errors: false
  };
  var _fields = {};
  var _formValues = {};
  var _defaultValues = formOptions.defaultValues || {};
  var _isInAction = false;
  var _isMounted = false;
  var _subjects = {
    watch: new Subject(),
    control: new Subject(),
    array: new Subject(),
    state: new Subject()
  };
  var _names = {
    mount: new Set(),
    unMount: new Set(),
    array: new Set(),
    watch: new Set(),
    watchAll: false
  };
  var validationMode = getValidationModes(formOptions.mode);
  var isValidateAllFieldCriteria = formOptions.criteriaMode === VALIDATION_MODE.all;
  var isFieldWatched = function isFieldWatched(name) {
    return _names.watchAll || _names.watch.has(name) || _names.watch.has((name.match(/\w+/) || [])[0]);
  };
  var updateErrorState = function updateErrorState(name, error) {
    set(_formState.errors, name, error);
    _subjects.state.next({
      errors: _formState.errors
    });
  };
  var shouldRenderBaseOnValid = function shouldRenderBaseOnValid() {
    return Promise.resolve(validateForm(_fields, true)).then(function (isValid) {
      if (isValid !== _formState.isValid) {
        _formState.isValid = isValid;
        _subjects.state.next({
          isValid: isValid
        });
      }
    });
  };
  var shouldRenderBaseOnError = function shouldRenderBaseOnError(shouldSkipRender, name, error, fieldState, isValidFromResolver, isWatched) {
    try {
      var previousError = get(_formState.errors, name);
      var isValid = !!(_proxyFormState.isValid && (formOptions.resolver ? isValidFromResolver : shouldRenderBaseOnValid()));
      if (props.delayError && error) {
        _delayCallback = _delayCallback || debounce(updateErrorState, props.delayError);
        _delayCallback(name, error);
      } else {
        error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
      }
      if ((isWatched || (error ? !deepEqual(previousError, error) : previousError) || !isEmptyObject(fieldState) || _formState.isValid !== isValid) && !shouldSkipRender) {
        var updatedFormState = Object.assign(Object.assign(Object.assign({}, fieldState), _proxyFormState.isValid && formOptions.resolver ? {
          isValid: isValid
        } : {}), {
          errors: _formState.errors,
          name: name
        });
        _formState = Object.assign(Object.assign({}, _formState), updatedFormState);
        _subjects.state.next(isWatched ? {
          name: name
        } : updatedFormState);
      }
      _subjects.state.next({
        isValidating: false
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var setFieldValue = function setFieldValue(name, value, options, shouldRender) {
    if (options === void 0) {
      options = {};
    }
    var field = get(_fields, name);
    if (field) {
      var _f = field._f;
      if (_f) {
        set(_formValues, name, getFieldValueAs(value, _f));
        var fieldValue = isWeb && isHTMLElement(_f.ref) && isNullOrUndefined(value) ? '' : value;
        if (isFileInput(_f.ref) && !isString(fieldValue)) {
          _f.ref.files = fieldValue;
        } else if (isMultipleSelect(_f.ref)) {
          [].concat(_f.ref.options).forEach(function (selectRef) {
            return selectRef.selected = fieldValue.includes(selectRef.value);
          });
        } else if (_f.refs) {
          if (isCheckBoxInput(_f.ref)) {
            _f.refs.length > 1 ? _f.refs.forEach(function (checkboxRef) {
              return checkboxRef.checked = Array.isArray(fieldValue) ? !!fieldValue.find(function (data) {
                return data === checkboxRef.value;
              }) : fieldValue === checkboxRef.value;
            }) : _f.refs[0].checked = !!fieldValue;
          } else {
            _f.refs.forEach(function (radioRef) {
              return radioRef.checked = radioRef.value === fieldValue;
            });
          }
        } else {
          _f.ref.value = fieldValue;
        }
        if (shouldRender) {
          _subjects.control.next({
            values: getValues(),
            name: name
          });
        }
        (options.shouldDirty || options.shouldTouch) && updateTouchAndDirtyState(name, fieldValue, options.shouldTouch);
        options.shouldValidate && trigger(name);
      }
    }
  };
  var updateTouchAndDirtyState = function updateTouchAndDirtyState(name, inputValue, isCurrentTouched, shouldRender) {
    if (shouldRender === void 0) {
      shouldRender = true;
    }
    var state = {
      name: name
    };
    var isChanged = false;
    if (_proxyFormState.isDirty) {
      var previousIsDirty = _formState.isDirty;
      _formState.isDirty = _getIsDirty();
      state.isDirty = _formState.isDirty;
      isChanged = previousIsDirty !== state.isDirty;
    }
    if (_proxyFormState.dirtyFields && !isCurrentTouched) {
      var isPreviousFieldDirty = get(_formState.dirtyFields, name);
      var isCurrentFieldDirty = !deepEqual(get(_defaultValues, name), inputValue);
      isCurrentFieldDirty ? set(_formState.dirtyFields, name, true) : unset(_formState.dirtyFields, name);
      state.dirtyFields = _formState.dirtyFields;
      isChanged = isChanged || isPreviousFieldDirty !== get(_formState.dirtyFields, name);
    }
    var isPreviousFieldTouched = get(_formState.touchedFields, name);
    if (isCurrentTouched && !isPreviousFieldTouched) {
      set(_formState.touchedFields, name, isCurrentTouched);
      state.touchedFields = _formState.touchedFields;
      isChanged = isChanged || _proxyFormState.touchedFields && isPreviousFieldTouched !== isCurrentTouched;
    }
    isChanged && shouldRender && _subjects.state.next(state);
    return isChanged ? state : {};
  };
  var executeResolver = function executeResolver(name) {
    try {
      var _formOptions$resolver2 = formOptions.resolver;
      return Promise.resolve(_formOptions$resolver2 ? formOptions.resolver(Object.assign({}, _formValues), formOptions.context, getResolverOptions(name || _names.mount, _fields, formOptions.criteriaMode, formOptions.shouldUseNativeValidation)) : {});
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var executeResolverValidation = function executeResolverValidation(names) {
    return Promise.resolve(executeResolver()).then(function (_ref) {
      var errors = _ref.errors;
      if (names) {
        for (var _iterator = _createForOfIteratorHelperLoose(names), _step; !(_step = _iterator()).done;) {
          var name = _step.value;
          var error = get(errors, name);
          error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
        }
      } else {
        _formState.errors = errors;
      }
      return errors;
    });
  };
  var validateForm = function validateForm(_fields, shouldCheckValid, context) {
    if (context === void 0) {
      context = {
        valid: true
      };
    }
    try {
      var _temp6 = function _temp6() {
        return context.valid;
      };
      var _interrupt = false;
      var _temp5 = _forIn(_fields, function (name) {
        var field = _fields[name];
        var _temp4 = function () {
          if (field) {
            var _temp3 = function _temp3() {
              function _temp(_validateForm) {
                _validateForm;
              }
              return _val ? Promise.resolve(validateForm(_val, shouldCheckValid, context)).then(_temp) : _temp(_val);
            };
            var _f = field._f;
            var _val = omit(field, '_f');
            var _temp2 = function () {
              if (_f) {
                return Promise.resolve(validateField(field, get(_formValues, _f.name), isValidateAllFieldCriteria, formOptions.shouldUseNativeValidation)).then(function (fieldError) {
                  console.log("dyno ;)", fieldError, "fieldError");
                  if (shouldCheckValid) {
                    if (fieldError[_f.name]) {
                      context.valid = false;
                      _interrupt = true;
                    }
                  } else {
                    if (fieldError[_f.name]) {
                      context.valid = false;
                    }
                    fieldError[_f.name] ? set(_formState.errors, _f.name, fieldError[_f.name]) : unset(_formState.errors, _f.name);
                  }
                });
              }
            }();
            return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
          }
        }();
        if (_temp4 && _temp4.then) return _temp4.then(function () {});
      }, function () {
        return _interrupt;
      });
      return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var handleChange = function handleChange(_ref2) {
    var type = _ref2.type,
      target = _ref2.target,
      _ref2$target = _ref2.target,
      value = _ref2$target.value,
      name = _ref2$target.name,
      inputType = _ref2$target.type;
    try {
      var error;
      var isValid;
      var field = get(_fields, name);
      return Promise.resolve(function () {
        if (field) {
          var _temp8 = function _temp8() {
            !_isBlurEvent && _subjects.watch.next({
              name: name,
              type: type,
              values: getValues()
            });
            shouldRenderBaseOnError(false, name, error, _fieldState, isValid, _isWatched);
          };
          var inputValue = inputType ? getFieldValue(field) : undefined;
          inputValue = isUndefined(inputValue) ? value : inputValue;
          var _isBlurEvent = type === EVENTS.BLUR;
          var _getValidationModes = getValidationModes(formOptions.reValidateMode),
            isReValidateOnBlur = _getValidationModes.isOnBlur,
            isReValidateOnChange = _getValidationModes.isOnChange;
          var shouldSkipValidation = !hasValidation(field._f, field._f.mount) && !formOptions.resolver && !get(_formState.errors, name) || skipValidation(Object.assign({
            isBlurEvent: _isBlurEvent,
            isTouched: !!get(_formState.touchedFields, name),
            isSubmitted: _formState.isSubmitted,
            isReValidateOnBlur: isReValidateOnBlur,
            isReValidateOnChange: isReValidateOnChange
          }, validationMode));
          var _isWatched = !_isBlurEvent && isFieldWatched(name);
          if (!isUndefined(inputValue)) {
            set(_formValues, name, inputValue);
          }
          var _fieldState = updateTouchAndDirtyState(name, inputValue, _isBlurEvent, false);
          var shouldRender = !isEmptyObject(_fieldState) || _isWatched;
          if (shouldSkipValidation) {
            !_isBlurEvent && _subjects.watch.next({
              name: name,
              type: type
            });
            return shouldRender && _subjects.state.next(_isWatched ? {
              name: name
            } : Object.assign(Object.assign({}, _fieldState), {
              name: name
            }));
          }
          _subjects.state.next({
            isValidating: true
          });
          var _temp7 = function () {
            if (formOptions.resolver) {
              return Promise.resolve(executeResolver([name])).then(function (_ref3) {
                var errors = _ref3.errors;
                error = get(errors, name);
                if (isCheckBoxInput(target) && !error) {
                  var parentNodeName = getNodeParentName(name);
                  var valError = get(errors, parentNodeName, {});
                  valError.type && valError.message && (error = valError);
                  if (valError || get(_formState.errors, parentNodeName)) {
                    name = parentNodeName;
                  }
                }
                isValid = isEmptyObject(errors);
              });
            } else {
              return Promise.resolve(validateField(field, get(_formValues, name), isValidateAllFieldCriteria, formOptions.shouldUseNativeValidation)).then(function (_validateField) {
                error = _validateField[name];
              });
            }
          }();
          return _temp7 && _temp7.then ? _temp7.then(_temp8) : _temp8(_temp7);
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var _updateValidAndInputValue = function _updateValidAndInputValue(name, ref, shouldSkipValueAs) {
    var field = get(_fields, name);
    if (field) {
      var fieldValue = get(_formValues, name);
      var isValueUndefined = isUndefined(fieldValue);
      var defaultValue = isValueUndefined ? get(_defaultValues, name) : fieldValue;
      if (isUndefined(defaultValue) || ref && ref.defaultChecked || shouldSkipValueAs) {
        ref && ref.visible && set(_formValues, name, shouldSkipValueAs ? defaultValue : getFieldValue(field));
      } else {
        setFieldValue(name, defaultValue);
      }
    }
    _isMounted && _proxyFormState.isValid && _updateValid();
  };
  var _getIsDirty = function _getIsDirty(name, data) {
    name && data && set(_formValues, name, data);
    return !deepEqual(Object.assign({}, getValues()), _defaultValues);
  };
  var _updateValid = function _updateValid() {
    try {
      var _formOptions$resolver3 = formOptions.resolver;
      return Promise.resolve(_formOptions$resolver3 ? executeResolver() : validateForm(_fields, true)).then(function (_executeResolver) {
        var isValid = _executeResolver;
        if (isValid !== _formState.isValid) {
          _formState.isValid = isValid;
          _subjects.state.next({
            isValid: isValid
          });
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var setValues = function setValues(name, value, options) {
    return Object.entries(value).forEach(function (_ref4) {
      var fieldKey = _ref4[0],
        fieldValue = _ref4[1];
      var fieldName = name + "." + fieldKey;
      var field = get(_fields, fieldName);
      var isFieldArray = _names.array.has(name);
      (isFieldArray || !isPrimitive(fieldValue) || field && !field._f) && !isDateObject(fieldValue) ? setValues(fieldName, fieldValue, options) : setFieldValue(fieldName, fieldValue, options, true);
    });
  };
  var _getWatch = function _getWatch(fieldNames, defaultValue, isGlobal) {
    var fieldValues = Object.assign({}, _isMounted ? Object.assign({}, Object.assign(Object.assign({}, _defaultValues), _formValues)) : isUndefined(defaultValue) ? _defaultValues : defaultValue);
    if (!fieldNames) {
      isGlobal && (_names.watchAll = true);
      return fieldValues;
    }
    var resultChanges = [];
    var result = new Map();
    for (var _iterator2 = _createForOfIteratorHelperLoose(convertToArrayPayload(fieldNames)), _step2; !(_step2 = _iterator2()).done;) {
      var fieldName = _step2.value;
      isGlobal && _names.watch.add(fieldName);
      resultChanges.push(get(fieldValues, fieldName));
      result.set(fieldName, get(fieldValues, fieldName));
    }
    return Array.isArray(fieldNames) ? [resultChanges, result] : isObject(result[0]) ? Object.assign({}, result[0]) : Array.isArray(result[0]) ? [].concat(result[0]) : result[0];
  };
  var _updateFormValues = function _updateFormValues(defaultValues, name) {
    if (name === void 0) {
      name = '';
    }
    console.log("dyno ;)", defaultValues, "_updateFormValues");
    for (var key in defaultValues) {
      var value = defaultValues[key];
      var fieldName = name + (name ? '.' : '') + key;
      var field = get(_fields, fieldName);
      if (!field || !field._f) {
        if (isObject(value) || Array.isArray(value)) {
          _updateFormValues(value, fieldName);
        } else if (!field) {
          set(_formValues, fieldName, value);
        }
      }
    }
  };
  var _bathFieldArrayUpdate = function _bathFieldArrayUpdate(keyName, name, method, args, updatedFieldArrayValues, shouldSet, shouldSetFields) {
    if (updatedFieldArrayValues === void 0) {
      updatedFieldArrayValues = [];
    }
    if (shouldSet === void 0) {
      shouldSet = true;
    }
    if (shouldSetFields === void 0) {
      shouldSetFields = true;
    }
    _isInAction = true;
    if (shouldSetFields && get(_fields, name)) {
      var output = method(get(_fields, name), args.argA, args.argB);
      shouldSet && set(_fields, name, output);
    }
    set(_formValues, name, updatedFieldArrayValues);
    if (Array.isArray(get(_formState.errors, name))) {
      var _output = method(get(_formState.errors, name), args.argA, args.argB);
      shouldSet && set(_formState.errors, name, _output);
      unsetEmptyArray(_formState.errors, name);
    }
    if (_proxyFormState.touchedFields && get(_formState.touchedFields, name)) {
      var _output2 = method(get(_formState.touchedFields, name), args.argA, args.argB);
      shouldSet && set(_formState.touchedFields, name, _output2);
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
  var _getFieldArrayValue = function _getFieldArrayValue(name) {
    return get(_isMounted ? _formValues : _defaultValues, name, []);
  };
  var setValue = function setValue(name, value, options) {
    if (options === void 0) {
      options = {};
    }
    var field = get(_fields, name);
    var isFieldArray = _names.array.has(name);
    set(_formValues, name, value);
    if (isFieldArray) {
      _subjects.array.next({
        values: value,
        name: name,
        isReset: true
      });
      if ((_proxyFormState.isDirty || _proxyFormState.dirtyFields) && options.shouldDirty) {
        set(_formState.dirtyFields, name, setFieldArrayDirtyFields(value, get(_defaultValues, name, []), get(_formState.dirtyFields, name, [])));
        _subjects.state.next({
          name: name,
          dirtyFields: _formState.dirtyFields,
          isDirty: _getIsDirty(name, value)
        });
      }
    } else {
      field && !field._f && !isNullOrUndefined(value) ? setValues(name, value, options) : setFieldValue(name, value, options, true);
    }
    isFieldWatched(name) && _subjects.state.next({});
    _subjects.watch.next({
      name: name
    });
  };
  var trigger = function trigger(name, options) {
    if (options === void 0) {
      options = {};
    }
    try {
      var _temp11 = function _temp11() {
        _subjects.state.next(Object.assign(Object.assign({}, isString(name) ? {
          name: name
        } : {}), {
          errors: _formState.errors,
          isValidating: false
        }));
        if (options.shouldFocus && !isValid) {
          focusFieldBy(_fields, function (key) {
            return get(_formState.errors, key);
          }, name ? fieldNames : _names.mount);
        }
        _proxyFormState.isValid && _updateValid();
        return isValid;
      };
      var fieldNames = convertToArrayPayload(name);
      var isValid;
      _subjects.state.next({
        isValidating: true
      });
      var _temp10 = function () {
        if (formOptions.resolver) {
          return Promise.resolve(executeResolverValidation(isUndefined(name) ? name : fieldNames)).then(function (schemaResult) {
            isValid = name ? fieldNames.every(function (name) {
              return !get(schemaResult, name);
            }) : isEmptyObject(schemaResult);
          });
        } else {
          var _temp9 = function () {
            if (name) {
              return Promise.resolve(Promise.all(fieldNames.map(function (fieldName) {
                try {
                  var _ref5;
                  var field = get(_fields, fieldName);
                  return Promise.resolve(validateForm(field._f ? (_ref5 = {}, _ref5[fieldName] = field, _ref5) : field));
                } catch (e) {
                  return Promise.reject(e);
                }
              }))).then(function (_Promise$all) {
                isValid = _Promise$all.every(Boolean);
              });
            } else {
              return Promise.resolve(validateForm(_fields)).then(function () {
                isValid = isEmptyObject(_formState.errors);
              });
            }
          }();
          if (_temp9 && _temp9.then) return _temp9.then(function () {});
        }
      }();
      return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(_temp11) : _temp11(_temp10));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var triggerBackground = function triggerBackground(name, options) {
    if (options === void 0) {
      options = {};
    }
    try {
      var _temp14 = function _temp14() {
        if (options.shouldFocus && !isValid) {
          focusFieldBy(_fields, function (key) {
            return get(_formState.errors, key);
          }, name ? fieldNames : _names.mount);
        }
        _proxyFormState.isValid && _updateValid();
        console.log("dyno ;)", "trigger", _formState.errors, "end");
        return isValid;
      };
      var fieldNames = convertToArrayPayload(name);
      var isValid;
      console.log("dyno ;)", "trigger", _formState.errors);
      var _temp13 = function () {
        if (formOptions.resolver) {
          return Promise.resolve(executeResolverValidation(isUndefined(name) ? name : fieldNames)).then(function (schemaResult) {
            isValid = name ? fieldNames.every(function (name) {
              return !get(schemaResult, name);
            }) : isEmptyObject(schemaResult);
          });
        } else {
          var _temp12 = function () {
            if (name) {
              return Promise.resolve(Promise.all(fieldNames.map(function (fieldName) {
                try {
                  var _ref6;
                  var field = get(_fields, fieldName);
                  return Promise.resolve(validateForm(field._f ? (_ref6 = {}, _ref6[fieldName] = field, _ref6) : field));
                } catch (e) {
                  return Promise.reject(e);
                }
              }))).then(function (_Promise$all2) {
                isValid = _Promise$all2.every(Boolean);
              });
            } else {
              return Promise.resolve(validateForm(_fields, true)).then(function (_validateForm3) {
                isValid = _validateForm3;
              });
            }
          }();
          if (_temp12 && _temp12.then) return _temp12.then(function () {});
        }
      }();
      return Promise.resolve(_temp13 && _temp13.then ? _temp13.then(_temp14) : _temp14(_temp13));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var getValues = function getValues(fieldNames) {
    console.log("dyno ;)", _formValues, _fields, "fdfdfdfdfdfd");
    var values = Object.assign(Object.assign({}, _defaultValues), _formValues);
    return isUndefined(fieldNames) ? values : isString(fieldNames) ? get(values, fieldNames) : fieldNames.map(function (name) {
      return get(values, name);
    });
  };
  var clearErrors = function clearErrors(name) {
    name ? convertToArrayPayload(name).forEach(function (inputName) {
      return unset(_formState.errors, inputName);
    }) : _formState.errors = {};
    _subjects.state.next({
      errors: _formState.errors
    });
  };
  var setError = function setError(name, error, options) {
    var ref = (get(_fields, name, {
      _f: {}
    })._f || {}).ref;
    set(_formState.errors, name, Object.assign(Object.assign({}, error), {
      ref: ref
    }));
    _subjects.state.next({
      name: name,
      errors: _formState.errors,
      isValid: false
    });
    options && options.shouldFocus && ref && ref.focus && ref.focus();
  };
  var watch = function watch(fieldName, defaultValue) {
    return isFunction(fieldName) ? _subjects.watch.subscribe({
      next: function next(info) {
        return fieldName(_getWatch(undefined, defaultValue), info);
      }
    }) : _getWatch(fieldName, defaultValue, true);
  };
  var unregister = function unregister(name, options) {
    if (options === void 0) {
      options = {};
    }
    for (var _iterator3 = _createForOfIteratorHelperLoose(name ? convertToArrayPayload(name) : _names.mount), _step3; !(_step3 = _iterator3()).done;) {
      var inputName = _step3.value;
      _names.mount["delete"](inputName);
      _names.array["delete"](inputName);
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
  var registerFieldRef = function registerFieldRef(name, fieldRef, options) {
    register(name, options);
    var field = get(_fields, name);
    var ref = isUndefined(fieldRef.value) ? fieldRef.querySelectorAll ? fieldRef.querySelectorAll('input,select,textarea')[0] || fieldRef : fieldRef : fieldRef;
    var isRadioOrCheckbox = isRadioOrCheckboxFunction(ref);
    if (ref === field._f.ref || isRadioOrCheckbox && compact(field._f.refs || []).find(function (option) {
      return option === ref;
    })) {
      return;
    }
    field = {
      _f: isRadioOrCheckbox ? Object.assign(Object.assign({}, field._f), {
        refs: [].concat(compact(field._f.refs || []).filter(function (ref) {
          return isHTMLElement(ref) && document.contains(ref);
        }), [ref]),
        ref: {
          type: ref.type,
          name: name
        }
      }) : Object.assign(Object.assign({}, field._f), {
        ref: ref
      })
    };
    set(_fields, name, field);
    _updateValidAndInputValue(name, ref);
  };
  var register = function register(name, options) {
    if (options === void 0) {
      options = {};
    }
    var field = get(_fields, name);
    set(_fields, name, {
      _f: Object.assign(Object.assign(Object.assign({}, field && field._f ? field._f : {
        ref: {
          name: name
        }
      }), {
        name: name,
        mount: true
      }), options)
    });
    console.log("dyno ;)", Object.assign(Object.assign(Object.assign({}, field && field._f ? field._f : {
      ref: {
        name: name
      }
    }), {
      name: name,
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
      name: name
    }, isUndefined(options.disabled) ? {} : {
      disabled: options.disabled
    }), {
      onChange: handleChange,
      onBlur: handleChange,
      ref: function ref(_ref7) {
        if (_ref7) {
          registerFieldRef(name, _ref7, options);
        } else {
          var _field = get(_fields, name, {});
          var _shouldUnregister = formOptions.shouldUnregister || options.shouldUnregister;
          if (_field._f) {
            _field._f.mount = false;
          }
          _shouldUnregister && !(isNameInFieldArray(_names.array, name) && _isInAction) && _names.unMount.add(name);
        }
      }
    });
  };
  var handleSubmit = function handleSubmit(onValid, onInvalid) {
    return function (e) {
      try {
        if (e) {
          e.preventDefault && e.preventDefault();
          e.persist && e.persist();
        }
        var hasNoPromiseError = true;
        var fieldValues = Object.assign({}, _formValues);
        _subjects.state.next({
          isSubmitting: true
        });
        return Promise.resolve(_finallyRethrows(function () {
          return _catch(function () {
            function _temp18() {
              var _temp16 = function () {
                if (isEmptyObject(_formState.errors) && Object.keys(_formState.errors).every(function (name) {
                  return get(fieldValues, name);
                })) {
                  _subjects.state.next({
                    errors: {},
                    isSubmitting: true
                  });
                  return Promise.resolve(onValid(fieldValues, e)).then(function () {});
                } else {
                  var _temp15 = function _temp15(_onInvalid) {
                    _onInvalid;
                    formOptions.shouldFocusError && focusFieldBy(_fields, function (key) {
                      return get(_formState.errors, key);
                    }, _names.mount);
                  };
                  return onInvalid ? Promise.resolve(onInvalid(_formState.errors, e)).then(_temp15) : _temp15(onInvalid);
                }
              }();
              if (_temp16 && _temp16.then) return _temp16.then(function () {});
            }
            var _temp17 = function () {
              if (formOptions.resolver) {
                return Promise.resolve(executeResolver()).then(function (_ref8) {
                  var errors = _ref8.errors,
                    values = _ref8.values;
                  _formState.errors = errors;
                  fieldValues = values;
                });
              } else {
                return Promise.resolve(validateForm(_fields)).then(function () {});
              }
            }();
            return _temp17 && _temp17.then ? _temp17.then(_temp18) : _temp18(_temp17);
          }, function (err) {
            hasNoPromiseError = false;
            throw err;
          });
        }, function (_wasThrown, _result2) {
          _formState.isSubmitted = true;
          _subjects.state.next({
            isSubmitted: true,
            isSubmitting: false,
            isSubmitSuccessful: isEmptyObject(_formState.errors) && hasNoPromiseError,
            submitCount: _formState.submitCount + 1,
            errors: _formState.errors
          });
          if (_wasThrown) throw _result2;
          return _result2;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  };
  var reset = function reset(values, keepStateOptions) {
    if (keepStateOptions === void 0) {
      keepStateOptions = {};
    }
    var updatedValues = values || _defaultValues;
    if (isWeb && !keepStateOptions.keepValues) {
      for (var _iterator4 = _createForOfIteratorHelperLoose(_names.mount), _step4; !(_step4 = _iterator4()).done;) {
        var name = _step4.value;
        var field = get(_fields, name);
        if (field && field._f) {
          var inputRef = Array.isArray(field._f.refs) ? field._f.refs[0] : field._f.ref;
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
  var setFocus = function setFocus(name) {
    return get(_fields, name)._f.ref.focus();
  };
  return {
    control: {
      register: register,
      unregister: unregister,
      _getIsDirty: _getIsDirty,
      _getWatch: _getWatch,
      _updateValid: _updateValid,
      _updateFormValues: _updateFormValues,
      _bathFieldArrayUpdate: _bathFieldArrayUpdate,
      _getFieldArrayValue: _getFieldArrayValue,
      _subjects: _subjects,
      _shouldUnregister: formOptions.shouldUnregister,
      _fields: _fields,
      _proxyFormState: _proxyFormState,
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
      _updateProps: function _updateProps(options) {
        formOptions = Object.assign(Object.assign({}, defaultOptions), options);
      }
    },
    trigger: trigger,
    triggerBackground: triggerBackground,
    register: register,
    handleSubmit: handleSubmit,
    watch: watch,
    setValue: setValue,
    getValues: getValues,
    reset: reset,
    clearErrors: clearErrors,
    unregister: unregister,
    setError: setError,
    setFocus: setFocus
  };
}

var live = (function (ref) {
  return !isHTMLElement(ref) || !document.contains(ref);
});

function useForm(props) {
  if (props === void 0) {
    props = {};
  }
  var _formControl = useRef();
  var _React$useState = useState({
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
    }),
    formState = _React$useState[0],
    updateFormState = _React$useState[1];
  if (_formControl.current) {
    _formControl.current.control._updateProps(props);
  } else {
    _formControl.current = Object.assign(Object.assign({}, createFormControlV3(props)), {
      formState: formState
    });
  }
  var control = _formControl.current.control;
  useEffect(function () {
    var formStateSubscription = control._subjects.state.subscribe({
      next: function next(formState) {
        if (shouldRenderFormState(formState, control._proxyFormState, true)) {
          control._formState.val = Object.assign(Object.assign({}, control._formState.val), formState);
          updateFormState(Object.assign({}, control._formState.val));
        }
      }
    });
    var useFieldArraySubscription = control._subjects.array.subscribe({
      next: function next(state) {
        if (state.values && state.name && control._proxyFormState.isValid) {
          set(control._formValues, state.name, state.values);
          control._updateValid();
        }
      }
    });
    return function () {
      formStateSubscription.unsubscribe();
      useFieldArraySubscription.unsubscribe();
    };
  }, [control]);
  useEffect(function () {
    var unregisterFieldNames = [];
    if (!control._isMounted) {
      control._isMounted = true;
      control._proxyFormState.isValid && control._updateValid();
      !props.shouldUnregister && control._updateFormValues(control._defaultValues);
    }
    for (var _iterator = _createForOfIteratorHelperLoose(control._names.unMount), _step; !(_step = _iterator()).done;) {
      var name = _step.value;
      var field = get(control._fields, name);
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
  var methods = useFormContext();
  var _ref = props || {},
    _ref$control = _ref.control,
    control = _ref$control === void 0 ? methods.control : _ref$control,
    name = _ref.name,
    defaultValue = _ref.defaultValue,
    disabled = _ref.disabled;
  var _name = useRef(name);
  _name.current = name;
  var _React$useState = useState(isUndefined(defaultValue) ? control._getWatch(name) : defaultValue),
    value = _React$useState[0],
    updateValue = _React$useState[1];
  useEffect(function () {
    var watchSubscription = control._subjects.watch.subscribe({
      next: function next(_ref2) {
        var name = _ref2.name;
        console.log("dyno ;)", "##1 watchSubscription", name);
        return (!_name.current || !name || convertToArrayPayload(_name.current).some(function (fieldName) {
          return name && fieldName && (fieldName.startsWith(name) || name.startsWith(fieldName));
        })) && updateValue(control._getWatch(_name.current, defaultValue));
      }
    });
    disabled && watchSubscription.unsubscribe();
    return function () {
      return watchSubscription.unsubscribe();
    };
  }, [disabled, control, defaultValue]);
  return value;
}

var rebuildHistory = function rebuildHistory(history, to, from) {
  if (history === void 0) {
    history = {};
  }
  if (to === void 0) {
    to = 0;
  }
  if (from === void 0) {
    from = 0;
  }
  var newHistory = [].concat(history).slice(from, to);
  console.log("dyno ;)", 'rebuildHistory', newHistory, to);
  return new Set(newHistory);
};
function useHistory(init) {
  var _init;
  if (init === void 0) {
    init = {
      name: ""
    };
  }
  var _useState = useState(init),
    states = _useState[0],
    setStates = _useState[1];
  var _useState2 = useState(new Set()),
    history = _useState2[0],
    updateHistory = _useState2[1];
  var _useState3 = useState(0),
    index = _useState3[0],
    setIndex = _useState3[1];
  var _useState4 = useState((_init = init) === null || _init === void 0 ? void 0 : _init.name),
    currentPage = _useState4[0],
    updateCurrentPage = _useState4[1];
  var state = useMemo(function () {
    return states[currentPage];
  }, [index, currentPage]);
  var setState = function setState(value) {
    if (value === undefined || value === null || value === {}) return;
    var pageName = value.name;
    var existing = _.get(states, pageName);
    if (history.has(pageName)) {
      var newHistory = rebuildHistory(history, existing["x-index"]);
      updateHistory(newHistory);
      var _copy = _.cloneDeep(_.set(states, pageName, _extends({}, value, {
        "x-index": existing["x-index"]
      })));
      setStates(_copy);
      setIndex(existing["x-index"]);
      updateCurrentPage(pageName);
      console.log("dyno ;)", "lolllllllllllllllllll", history, '99999', existing["x-index"], newHistory);
      return;
    }
    console.log("dyno ;)", "histlori", value, _.set(states, pageName, value), state, history.size);
    var newIndex = index + 1;
    var copy = _.cloneDeep(_.set(states, pageName, _extends({}, value, {
      "x-index": newIndex
    })));
    setIndex(newIndex);
    updateHistory(history.add(pageName));
    setStates(copy);
    updateCurrentPage(pageName);
    console.log("dyno ;)", 'hissssstory', history);
    console.log("dyno ;)", value, 'drooooomemppppppphistlori', existing);
    console.log("dyno ;)", states, '31231232323132', state, currentPage, _.isEqual(existing, value));
  };
  var resetState = function resetState(init) {
    setIndex(0);
    setStates({});
    updateHistory([]);
    console.log("dyno ;)", ":::::resetState", history, states, index);
  };
  var goBack = function goBack(steps, reset) {
    if (steps === void 0) {
      steps = 1;
    }
    if (reset === void 0) {
      reset = false;
    }
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
  var goBackByIndex = function goBackByIndex(steps, reset) {
    if (steps === void 0) {
      steps = 1;
    }
    if (reset === void 0) {
      reset = false;
    }
    console.log("dyno ;)", steps, 'stepsssssss');
    var newIndex = Math.max(0, Number(index) - (Number(steps) || 1));
    var previousPageName = Object.keys(states)[newIndex - 1];
    console.log("dyno ;)", Math.max(0, Number(index) - (Number(steps) || 1)), 'drooooomempppppppdrooooo45678mempppppppdrooooomemppppppp', index, previousPageName, states[previousPageName]);
    updateCurrentPage(previousPageName);
    setIndex(newIndex);
    if (reset) {
      var existingPage = _.get(states, previousPageName);
      var newHistory = rebuildHistory(history, newIndex);
      updateHistory(newHistory);
      console.log("dyno ;)", previousPageName, newIndex, 'resetHardddddddd', history, newHistory, existingPage["x-index"]);
    }
  };
  var goBackByName = function goBackByName(steps, reset) {
    if (steps === void 0) {
      steps = 1;
    }
    if (reset === void 0) {
      reset = false;
    }
    console.log("dyno ;)", steps, 'stepsssssss');
    var existingPage = _.get(states, steps);
    var newIndex = Math.max(0, Number(index) - (Number(steps) || 1));
    var previousPageName = Object.keys(states)[newIndex - 1];
    console.log("dyno ;)", Math.max(0, Number(index) - (Number(steps) || 1)), 'drooooomempppppppdrooooo45678mempppppppdrooooomemppppppp', index, previousPageName, states[previousPageName]);
    updateCurrentPage(previousPageName);
    setIndex(newIndex);
    if (reset) {
      var _existingPage = _.get(states, previousPageName);
      var newHistory = rebuildHistory(history, newIndex);
      updateHistory(newHistory);
      console.log("dyno ;)", previousPageName, newIndex, 'resetHardddddddd', history, newHistory, _existingPage["x-index"]);
    }
  };
  var goForward = function goForward(steps) {
    if (steps === void 0) {
      steps = 1;
    }
    setIndex(Math.min(states.length - 1, Number(index) + (Number(steps) || 1)));
  };
  var updatePage = function updatePage(value) {
    var existing = _.get(states, currentPage);
    existing.defaultValues = _extends({}, value);
    console.log("dyno ;)", value, 'updatePage youuuuupppp', existing);
  };
  return {
    state: state,
    setState: setState,
    resetState: resetState,
    currentPage: currentPage,
    index: index,
    lastIndex: (states === null || states === void 0 ? void 0 : states.length) - 1 || 0,
    goBack: goBack,
    goForward: goForward,
    updatePage: updatePage,
    history: history
  };
}

var jsonataOriginal = require('jsonata');
var htmltotext = function htmltotext(value, options) {
  return value + " yasserrrrrrrr";
};
var registerWithJSONATA = function registerWithJSONATA(expression) {
  if (typeof expression === 'undefined' || typeof expression.registerFunction === 'undefined') {
    throw new TypeError('Invalid JSONata Expression');
  }
  expression.registerFunction('htmltotext', function (value, options) {
    return htmltotext(value);
  }, '<s?o?:s>');
};
function jsonataExtended(expr, options) {
  var expression = jsonataOriginal(expr, options);
  registerWithJSONATA(expression);
  return expression;
}

var transformer = function transformer(data, schema) {
  try {
    var expression = jsonataExtended(schema);
    return Promise.resolve(expression.evaluate(data));
  } catch (e) {
    return Promise.reject(e);
  }
};

var dataTransformer = function dataTransformer(data, name, obj) {
  return function (local) {
    var _ref = local.sharedItems || {
        getValues: undefined
      },
      getValues = _ref.getValues,
      dataStore = _ref.dataStore;
    var values = _extends({}, dataStore, getValues && getValues() || {});
    console.log("dyno ;)", data, values, 'getValues()()()');
    if (typeof data === "string") {
      if (data !== undefined && data.includes("$$")) {
        console.log("dyno ;)", "blaherebla", data, values);
        return _.get(values, data.substring(2));
      }
      if (data !== undefined && data.includes("fx")) {
        console.log("dyno ;)", data.slice(2), 'sliceeeeeee');
        try {
          var result = eval("local." + data.slice(2));
          console.log("dyno ;)", result, 'rrrrrrrsulttttttttt');
          if (typeof result === 'function') {
            return result(values);
          }
          if (result !== null && result !== void 0 && result.then) {
            return result.then(function (response) {
              return !response;
            });
          }
          return result;
        } catch (error) {
          console.log("dyno ;)", error, 'rrrrrrrsulttttttttt errorororrororor');
        }
      }
      var patternResult = data;
      if (data !== undefined && data.includes("dx")) {
        patternResult = patternResult.replace(/dx.*?\(.*?\)/g, function (_, name) {
          try {
            console.log("dyno ;)", _, name, 'pattern waaaaaalalala 2nd', patternResult);
            var _result = eval("local." + _);
            if (typeof _result === 'function') {
              return _result(values);
            }
            return _result;
          } catch (error) {
            console.log("dyno ;)", error, 'dxxxxxxxxxxxxdxdxxdxdxx');
            return _;
          }
        });
      }
      patternResult = patternResult.replace(/\$\{(.*?)\}/g, function (_, name) {
        var result = values[name] || '';
        console.log("dyno ;)", values, 'valuesssssssssssssssssRGEX');
        console.log("dyno ;)", name, '------>>>>>>------', result, 'pattern waaaaaalalala only', patternResult);
        return result !== undefined && result;
      });
      return patternResult;
    }
    return data;
  };
};

var schemaTransformation = function schemaTransformation(data, name, obj) {
  return function (local) {
    var values = _extends({}, obj.sharedItems);
    if (data === undefined || data === null) return data;
    if (typeof data === "string") {
      if (data !== undefined && data.includes("fx")) {
        try {
          var result = eval("extraFunctions." + data.slice(2));
          if (typeof result === "function") {
            return result(values);
          }
          return result;
        } catch (error) {
          console.log("dyno ;)", error, "rrrrrrrsulttttttttt errorororrororor");
        }
      }
      if (data !== "") {
        var _$get;
        var _result = (_$get = _.get(values, data.substring(2))) != null ? _$get : data;
        return _result;
      }
    }
    return data;
  };
};

var flattenHelper = function flattenHelper(currentObject, newObject, previousKeyName) {
  for (var key in currentObject) {
    var value = currentObject[key];
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
var flattenObject = function flattenObject(oldObject) {
  var newObject = {};
  flattenHelper(oldObject, newObject, "");
  return newObject;
};

var schemaProxy = function schemaProxy(item, extraValues, extraFunctions) {
  if (extraValues === void 0) {
    extraValues = {};
  }
  if (extraFunctions === void 0) {
    extraFunctions = {};
  }
  if (item === undefined) return {};
  var proxyHandler = {
    get: function get(target, prop, receiver) {
      if (typeof target[prop] === "object" && target[prop] !== null) {
        console.log("dyno ;)", target[prop], "proxyHanlerrrrrrrr ;)");
        return new Proxy(target[prop], proxyHandler);
      } else {
        return schemaTransformation(target[prop], prop, target)(_extends({}, extraFunctions));
      }
    }
  };
  var proxySchema = new Proxy(_extends({}, flattenObject(_extends({}, item.action.schema)), {
    sharedItems: _extends({}, extraValues, item)
  }), proxyHandler);
  return proxySchema;
};

var setupProxy = function setupProxy(item, extraValues, extraFunctions) {
  if (extraValues === void 0) {
    extraValues = {};
  }
  if (extraFunctions === void 0) {
    extraFunctions = {};
  }
  var proxyItems = schemaProxy(item, extraValues, extraFunctions);
  var newSchema = {};
  var y = Object.keys(proxyItems).map(function (el) {
    if (el === "sharedItems") return;
    newSchema = _.set(newSchema, el, proxyItems[el]);
    console.log("dyno ;)", el, "flattttttttten");
  });
  return _.cloneDeep(newSchema);
};

var defaultValidationResolver = {
  noteq: function (item, value) {
    try {
      return Promise.resolve(value !== '' && !item.value.includes(value) || false);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  eq: function (item, value) {
    try {
      return Promise.resolve((value === null || value === void 0 ? void 0 : value.toString()) === item.value);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  notEmptyAndEqual: function (item, value) {
    try {
      return Promise.resolve(value !== '' && item.value.includes(value) || false);
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

var ControlledComponentsV2 = function ControlledComponentsV2(props) {
  var _props$errors;
  var _useState2 = useState(props.control.current && props.control.current[props.name]),
    field = _useState2[0],
    setField = _useState2[1];
  console.log("dyno ;)", props.name, 'ControlledComponentsV2 renderrrrrrrrrr <1>', field, props.errors, props.name);
  var error = props.errors && props.errors.current && ((_props$errors = props.errors) === null || _props$errors === void 0 ? void 0 : _props$errors.current[props.name]);
  var _useState3 = useState('');
  var onChange = function onChange(value) {
    console.log("dyno ;)", 'valuelavue', value);
    props.updateReference(value, props.name);
    setField(_extends({}, field, {
      value: value
    }));
  };
  return props.render({
    onChange: onChange,
    value: field.value,
    field: field,
    error: error,
    index: props.index
  });
};
var IIN = React__default.memo(function (props) {
  return /*#__PURE__*/React__default.createElement(ControlledComponentsV2, props);
}, function (prevProps, nextProps) {
  var _prevProps$errors, _prevProps$errors2, _nextProps$errors, _nextProps$errors2;
  var oldE = ((_prevProps$errors = prevProps.errors) === null || _prevProps$errors === void 0 ? void 0 : _prevProps$errors.current) && ((_prevProps$errors2 = prevProps.errors) === null || _prevProps$errors2 === void 0 ? void 0 : _prevProps$errors2.current[prevProps.name]) || {};
  var newE = ((_nextProps$errors = nextProps.errors) === null || _nextProps$errors === void 0 ? void 0 : _nextProps$errors.current[nextProps.name]) || {};
  var errror = _.isEqual(oldE, newE);
  var errrorlol = (_nextProps$errors2 = nextProps.errors) === null || _nextProps$errors2 === void 0 ? void 0 : _nextProps$errors2.current[prevProps.name];
  console.log("dyno ;)", prevProps, nextProps, prevProps.name + ' ControlledComponentsV2 renderrrrrrrrrr <2>', errror, 'is===', errrorlol, prevProps.name);
  if (JSON.stringify(nextProps) === JSON.stringify(prevProps)) {
    return true;
  }
  return false;
});
var renderForm = function renderForm(data, updateReference, myControl, getValue, errors, ControlledComponents, components, managedCallback, parentName, sharedItems, setValue) {
  console.log("dyno ;)", errors, 'dataerrors');
  var r = data.filter(function (element) {
    return element.visible;
  }).map(function (item, index) {
    var errors = sharedItems.errors,
      control = sharedItems.control,
      useFieldArray = sharedItems.useFieldArray;
    var name = parentName && parentName + "." + item.name || item.name;
    var result = null;
    var child = [];
    if (item.items) {
      child = renderForm(item.items, updateReference, myControl, getValue, errors, ControlledComponents, components, managedCallback, (item === null || item === void 0 ? void 0 : item.items) && name || undefined, sharedItems);
    }
    var validation = {
      maxLength: item.maxLength && item.maxLength.value !== "" && item.maxLength || undefined,
      minLength: item.minLength && item.minLength.value !== "" && item.minLength || undefined,
      max: item.max && item.max.value !== "" && item.max || undefined,
      min: item.min && item.min.value !== "" && item.min || undefined,
      pattern: item.pattern && item.pattern.value !== "" && item.pattern || undefined,
      required: item.required && item.required.value !== "" && item.required || undefined
    };
    result = /*#__PURE__*/React__default.createElement(Controller, {
      key: item.isArray === true && name + "container" || name,
      name: item.isArray === true && name + "container" || name,
      control: control,
      item: item,
      rules: item.rule || validation,
      render: function render(_ref) {
        var field = _ref.field;
        if (item.isArray) {
          var _useFieldArray = useFieldArray({
              control: control,
              name: name
            }),
            fields = _useFieldArray.fields,
            append = _useFieldArray.append,
            remove = _useFieldArray.remove;
          child = /*#__PURE__*/React__default.createElement(Fragment, null, /*#__PURE__*/React__default.createElement("ul", null, fields.map(function (el, index) {
            return /*#__PURE__*/React__default.createElement("li", {
              key: el.id
            }, item.items.map(function (element, indx) {
              return /*#__PURE__*/React__default.createElement(Controller, {
                name: name + "." + index + "." + element.name,
                control: control,
                render: function render(_ref2) {
                  var field = _ref2.field;
                  var Component = components(element.type, {
                    field: field,
                    item: element,
                    name: name + "." + index + "." + element.name,
                    indx: indx,
                    managedCallback: managedCallback,
                    child: child,
                    useFieldArray: useFieldArray
                  });
                  return Component;
                }
              });
            }), /*#__PURE__*/React__default.createElement("button", {
              type: "button",
              onClick: function onClick() {
                return remove(index);
              }
            }, "-"));
          })), /*#__PURE__*/React__default.createElement("button", {
            type: "button",
            onClick: function onClick() {
              return append({});
            }
          }, "+"));
        }
        var Component = components(item.type, {
          field: field,
          item: item,
          name: name,
          index: index,
          managedCallback: managedCallback,
          child: child,
          useFieldArray: useFieldArray,
          error: errors,
          sharedItems: sharedItems
        });
        return Component;
      }
    });
    return result;
  });
  return r;
};
var RenderForm = function RenderForm(data, updateReference, myControl, getValue, errors, ControlledComponents, components, managedCallback, parentName, control, setValue) {
  console.log("dyno ;)", errors, 'dataerrors');
  if (data === undefined) return null;
  var r = data.filter(function (element) {
    return element.visible;
  }).map(function (item, index) {
    var name = parentName && parentName + "." + item.name || item.name;
    var result = null;
    var child = [];
    if (item.items) {
      child = RenderForm(item.items, updateReference, myControl, getValue, errors, ControlledComponents, components, managedCallback, (item === null || item === void 0 ? void 0 : item.items) && name || undefined, control);
    }
    result = /*#__PURE__*/React__default.createElement(Controller, {
      key: name,
      name: name,
      control: control,
      item: item,
      rules: item.rule || {},
      render: function render(_ref3) {
        var field = _ref3.field;
        var Component = components(item.type, {
          field: field,
          item: item,
          name: name,
          index: index,
          managedCallback: managedCallback
        });
        return Component;
      }
    });
    return result;
  });
  return r;
};
var InRenderform = React__default.memo(function (props) {
  return RenderForm(props);
}, function (prevProps, nextProps) {
  if (!deepEqual(nextProps, prevProps)) {
    return true;
  }
  return false;
});
InRenderform.displayName = "RenderForm";
InRenderform.whyDidYouRender = true;
var convertIdToRef = function convertIdToRef(array, key, name, parent, isArray) {
  var result = array.reduce(function (obj, item, currentIndex) {
    var _extends2;
    var itemName = isArray === undefined && item[key] || parent + ".0." + item[key];
    var refId = name && name + ".items[" + currentIndex + "]" || "[" + currentIndex + "]";
    return _extends({}, obj, (_extends2 = {}, _extends2[itemName] = _extends({}, item, {
      name: itemName,
      refId: refId
    }, parent && {
      parent: parent
    }), _extends2), item.items !== undefined && convertIdToRef(item.items, 'name', refId, item[key], item.isArray));
  }, new Map());
  return result;
};
var resetItems = function resetItems(array, key, name, parent) {
  var result = array.reduce(function (obj, item, currentIndex) {
    var _extends3;
    var refId = name && name + ".items[" + currentIndex + "]" || "[" + currentIndex + "]";
    return _extends({}, obj, (_extends3 = {}, _extends3[item[key]] = _extends({}, item, {
      refId: refId,
      value: ""
    }, parent && {
      parent: parent
    }), _extends3), item.items !== undefined && convertIdToRef(item.items, 'name', refId, item[key]));
  }, new Map());
  return result;
};
var prepareWtchingComponents = function prepareWtchingComponents(items, key) {
  var initialValue = new Map();
  Object.keys(items).forEach(function (key) {
    if (items[key].preCondition) {
      var preConditionObj = convertArrayToObject(items[key].preCondition, 'value');
      var keys = Object.keys(preConditionObj);
      for (var index = 0; index < keys.length; index++) {
        var internalItem = preConditionObj[keys[index]];
        initialValue.set(internalItem.name, [].concat(initialValue.get(internalItem.name) && initialValue.get(internalItem.name) || [], [_extends({
          refId: items[key].refId
        }, internalItem)]));
      }
    }
  });
  return initialValue;
};
var convertArrayToObject = function convertArrayToObject(array, key, value) {
  var initialValue = {};
  if (!Array.isArray(array)) return;
  var givenArray = array.concat();
  return givenArray.reduce(function (obj, item) {
    var _extends5;
    return _extends({}, obj, (_extends5 = {}, _extends5[item[key]] = value && item[value] || value === undefined && item || '', _extends5));
  }, initialValue);
};
var renderCount = 0;
var FormBuilderV1 = React__default.forwardRef(function (_ref4, ref) {
  var items = _ref4.items,
    _ref4$validationResol = _ref4.validationResolver,
    validationResolver = _ref4$validationResol === void 0 ? defaultValidationResolver : _ref4$validationResol,
    ControlledComponents = _ref4.ControlledComponents,
    components = _ref4.components,
    managedCallback = _ref4.managedCallback,
    _ref4$defaultValues = _ref4.defaultValues,
    defaultValues = _ref4$defaultValues === void 0 ? {} : _ref4$defaultValues;
  console.log("dyno ;)", defaultValues, "defaultValues");
  var _useForm = useForm({
      mode: 'onChange',
      defaultValues: defaultValues
    }),
    register = _useForm.register,
    handleSubmit = _useForm.handleSubmit,
    watch = _useForm.watch,
    errors = _useForm.formState.errors,
    control = _useForm.control,
    trigger = _useForm.trigger,
    setFocus = _useForm.setFocus,
    getValues = _useForm.getValues,
    setValue = _useForm.setValue,
    triggerBackground = _useForm.triggerBackground;
  var sharedItems = {
    register: register,
    handleSubmit: handleSubmit,
    watch: watch,
    errors: errors,
    control: control,
    trigger: trigger,
    setFocus: setFocus,
    getValues: getValues,
    setValue: setValue,
    useFieldArray: useFieldArray,
    useWatch: useWatch,
    triggerBackground: triggerBackground
  };
  var myComponents = React__default.useRef();
  var watchingComponents = React__default.useRef();
  var preConditionItems = React__default.useRef();
  var _useState4 = useState(),
    data = _useState4[0],
    setData = _useState4[1];
  React__default.useEffect(function () {
    if (items === undefined) return;
    myComponents.current = convertIdToRef(items, 'name');
    watchingComponents.current = prepareWtchingComponents(myComponents.current);
    console.log("dyno ;)", myComponents, 'myComponentsmyComponents');
    console.log("dyno ;)", watchingComponents, 'prepareWtchingComponents', [].concat(watchingComponents.current.keys()));
    var subscription = watch(function (value, _ref5) {
      var name = _ref5.name,
        type = _ref5.type;
      try {
        return Promise.resolve(function () {
          if (watchingComponents.current.get(name)) {
            console.log("dyno ;)", "checkPreCondition ;) checkPreCondition", value, name, type, data, items);
            return Promise.resolve(checkPreCondition(name, value[name], items)).then(function (_ref6) {
              var a = _ref6[0],
                b = _ref6[1];
              if (!deepEqual(data, b) && a) {
                setData([].concat(b));
              }
            });
          }
        }());
      } catch (e) {
        return Promise.reject(e);
      }
    });
    setData(items);
  }, items);
  var resetValues = function resetValues() {
    myComponents.current = resetItems(items, 'name');
    setData(items);
  };
  var getValuesPOC = function getValuesPOC() {
    try {
      if (Object.keys(errors).length > 0) return Promise.resolve(false);
      return Promise.resolve(trigger()).then(function (result) {
        console.log("dyno ;)", "SUBMITFORM SUBMITFORM result trigger", result, errors);
        if (result === true) {
          return Promise.resolve(getValues());
        } else {
          return false;
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  ref.current = {
    getValues: getValuesPOC,
    resetValues: resetValues
  };
  var validationOnce = function validationOnce(name, value, result) {
    try {
      var validatedItem = myComponents.current[name];
      var n = result;
      var originalErrors = _extends({}, errors.current) || {};
      var newErrors = errors.current || {};
      var error = false;
      if (value !== '') {
        var _error = value === '313';
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
      errors.current = _extends({}, newErrors);
      console.log("dyno ;)", errors, "errrrrrrrrr", newErrors);
      if (error.current !== originalErrors) {}
      return Promise.resolve([!_.isEqual(originalErrors, newErrors), [].concat(n), newErrors[name]]);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var updateReference = function updateReference(value, name) {
    try {
      myComponents.current[name].value = value;
      var _myComponents$current = myComponents.current;
      return Promise.resolve(getValuesPOC()).then(function (_getValuesPOC) {
        console.log("dyno ;)", _myComponents$current, 'getValues', _getValuesPOC);
        return Promise.resolve(validationOnce(name, value, [].concat(data))).then(function (_ref7) {
          var hasValidationChanged = _ref7[0],
            result = _ref7[1],
            error = _ref7[2];
          return Promise.resolve(checkPreCondition(name, value, result)).then(function (_ref8) {
            var hasPreconditionChanged = _ref8[0],
              preResult = _ref8[1];
            if (hasValidationChanged === true || hasPreconditionChanged === true) {
              console.log("dyno ;)", 'lololololololololololoolol', hasValidationChanged, hasPreconditionChanged, errors);
              setData([].concat(preResult));
            }
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var checkPreCondition = function checkPreCondition(name, value, result) {
    try {
      var _temp2 = function _temp2() {
        return [updated, [].concat(n)];
      };
      var hasCondition = watchingComponents.current.get(name);
      console.log("dyno ;)", data, "checkPreConditionInside", name, myComponents.current, hasCondition, watchingComponents.current);
      var n = [].concat(result);
      var updated = false;
      var _temp = function () {
        if (hasCondition !== undefined) {
          return Promise.resolve(hasCondition.map(function (item) {
            try {
              var _temp4 = function _temp4(touched) {
                var _temp3 = function () {
                  if (_.get({
                    a: n
                  }, "a" + item.refId + ".visible") !== touched) {
                    n = _.set({
                      a: n
                    }, "a" + item.refId + ".visible", touched).a;
                    updated = true;
                    return Promise.resolve(_.get({
                      a: n
                    }, "a" + item.refId + ".visible")).then(function (_$get) {
                      return Promise.resolve(touched).then(function (_touched) {
                        console.log("dyno ;)", 'hashas', _$get, _touched, hasCondition, updated);
                      });
                    });
                  }
                }();
                if (_temp3 && _temp3.then) return _temp3.then(function () {});
              };
              var realValue = value["value"] || value;
              var _item$type = item === null || item === void 0 ? void 0 : item.type;
              return Promise.resolve(_item$type ? Promise.resolve(validationResolver[item.type](item, realValue)).then(_temp4) : _temp4(_item$type));
            } catch (e) {
              return Promise.reject(e);
            }
          })).then(function () {});
        }
      }();
      return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  console.log("dyno ;)", 'renderCount', renderCount++);
  return data && renderForm(data, updateReference, myComponents, getValues, _extends({}, errors), ControlledComponents, components, managedCallback, undefined, sharedItems) || null;
});
FormBuilderV1.whyDidYouRender = true;
FormBuilderV1.displayName = "FormBuilderV1";

var renderComponentInd = function renderComponentInd(name, data, _ref) {
  var updateReference = _ref.updateReference,
    myComponents = _ref.myComponents,
    getValues = _ref.getValues,
    errors = _ref.errors,
    ControlledComponents = _ref.ControlledComponents,
    components = _ref.components,
    managedCallback = _ref.managedCallback,
    undefined$1 = _ref.undefined,
    sharedItems = _ref.sharedItems,
    index = _ref.index,
    parent = _ref.parent,
    _ref$givenName = _ref.givenName,
    givenName = _ref$givenName === void 0 ? undefined$1 : _ref$givenName;
  var selectedComponent = _extends({}, data[name], {
    givenName: givenName
  });
  if (selectedComponent === undefined$1) return null;
  if ((selectedComponent === null || selectedComponent === void 0 ? void 0 : selectedComponent.visible) === false) return null;
  return renderComponentForm(selectedComponent, updateReference, myComponents, getValues, _extends({}, errors), ControlledComponents, components, managedCallback, undefined$1, sharedItems, index, data, parent);
};
var renderComponentForm = function renderComponentForm(item, updateReference, myControl, getValue, errorss, ControlledComponents, components, managedCallback, parentName, sharedItems, index, data, parent) {
  console.log("dyno ;)", errorss, 'dataerrors');
  var errors = sharedItems.errors,
    control = sharedItems.control,
    useFieldArray = sharedItems.useFieldArray;
  var name = parentName && parentName + "." + item.name || item.givenName && item.givenName || item.name;
  var result = null;
  var child = [];
  if (item.items) {
    child = item.items.map(function (name, idx) {
      return renderComponentInd(name, data, {
        updateReference: updateReference,
        myControl: myControl,
        getValue: getValue,
        errors: errors,
        ControlledComponents: ControlledComponents,
        components: components,
        managedCallback: managedCallback,
        parentName: (item === null || item === void 0 ? void 0 : item.items) && name || undefined,
        sharedItems: sharedItems,
        index: idx,
        data: data,
        parent: {
          name: item.name,
          index: index,
          id: item.id
        },
        itemName: name
      });
    });
  }
  var validation = {
    maxLength: item.maxLength && item.maxLength.value !== "" && item.maxLength || undefined,
    minLength: item.minLength && item.minLength.value !== "" && item.minLength || undefined,
    max: item.max && item.max.value !== "" && item.max || undefined,
    min: item.min && item.min.value !== "" && item.min || undefined,
    pattern: item.pattern && item.pattern.value !== "" && item.pattern || undefined,
    required: item.required && item.required.value !== "" && item.required || undefined
  };
  result = /*#__PURE__*/React__default.createElement(Controller, {
    key: item.isArray === true && name + "container" || name,
    name: item.isArray === true && name + "container" || name,
    control: control,
    item: item,
    rules: item.rule || validation,
    render: function render(_ref2) {
      var field = _ref2.field;
      if (item.isArray) {
        console.log("dyno ;)", name, item.items, "useFieldArray");
        var _useFieldArray = useFieldArray({
            control: control,
            name: name
          }),
          fields = _useFieldArray.fields,
          append = _useFieldArray.append,
          remove = _useFieldArray.remove;
        child = /*#__PURE__*/React__default.createElement(Fragment, null, /*#__PURE__*/React__default.createElement("ul", null, fields.map(function (el, index) {
          return /*#__PURE__*/React__default.createElement("li", {
            key: el.id
          }, item.items.map(function (element, indx) {
            return /*#__PURE__*/React__default.createElement(Controller, {
              key: name + "." + index + "." + data[element].name,
              name: name + "." + index + "." + data[element].name,
              control: control,
              render: function render(_ref3) {
                console.log("dyno ;)", name + "." + index + "." + element, '`${name}.${index}.${element}`');
                return renderComponentInd(element, data, {
                  updateReference: updateReference,
                  myControl: myControl,
                  getValue: getValue,
                  errors: errors,
                  ControlledComponents: ControlledComponents,
                  components: components,
                  managedCallback: managedCallback,
                  parentName: (item === null || item === void 0 ? void 0 : item.items) && name || undefined,
                  sharedItems: sharedItems,
                  index: index,
                  data: data,
                  parent: {
                    name: item.name,
                    index: index,
                    id: item.id
                  },
                  givenName: name + "." + index + "." + data[element].name
                });
              }
            });
          }), /*#__PURE__*/React__default.createElement("button", {
            type: "button",
            onClick: function onClick() {
              return remove(index);
            }
          }, "-"));
        })), /*#__PURE__*/React__default.createElement("button", {
          type: "button",
          onClick: function onClick() {
            return append({});
          }
        }, "+"));
      }
      var Component = components(item.type, {
        field: field,
        item: item,
        name: name,
        index: index,
        managedCallback: managedCallback,
        child: child,
        useFieldArray: useFieldArray,
        error: errors,
        sharedItems: sharedItems,
        parent: parent
      });
      return Component;
    }
  });
  return result;
};
var convertIdToRef$1 = function convertIdToRef(array, key, name, parent, isArray) {
  var result = array.reduce(function (obj, item, currentIndex) {
    var _extends2;
    var itemName = isArray === undefined && item[key] || parent + ".0." + item[key];
    var refId = name && name + ".items[" + currentIndex + "]" || "[" + currentIndex + "]";
    return _extends({}, obj, (_extends2 = {}, _extends2[itemName] = _extends({}, item, {
      name: itemName,
      refId: refId
    }, parent && {
      parent: parent
    }), _extends2), item.items !== undefined && convertIdToRef(item.items, 'name', refId, item[key], item.isArray));
  }, new Map());
  return result;
};
var resetItems$1 = function resetItems(array, key, name, parent) {
  var result = array.reduce(function (obj, item, currentIndex) {
    var _extends3;
    var refId = name && name + ".items[" + currentIndex + "]" || "[" + currentIndex + "]";
    return _extends({}, obj, (_extends3 = {}, _extends3[item[key]] = _extends({}, item, {
      refId: refId,
      value: ""
    }, parent && {
      parent: parent
    }), _extends3), item.items !== undefined && convertIdToRef$1(item.items, 'name', refId, item[key]));
  }, new Map());
  return result;
};
var prepareWtchingComponents$1 = function prepareWtchingComponents(items, key) {
  var initialValue = new Map();
  Object.keys(items).forEach(function (key) {
    if (items[key].preCondition) {
      var preConditionObj = convertArrayToObject$1(items[key].preCondition, 'value');
      var keys = Object.keys(preConditionObj);
      for (var index = 0; index < keys.length; index++) {
        var internalItem = preConditionObj[keys[index]];
        console.log("dyno ;)", items[key], 'items[key]');
        initialValue.set(internalItem.name, [].concat(initialValue.get(internalItem.name) && initialValue.get(internalItem.name) || [], [_extends({
          refId: items[key].id
        }, internalItem)]));
      }
    }
  });
  return initialValue;
};
var convertArrayToObject$1 = function convertArrayToObject(array, key, value) {
  var initialValue = {};
  if (!Array.isArray(array)) return;
  var givenArray = array.concat();
  return givenArray.reduce(function (obj, item) {
    var _extends5;
    return _extends({}, obj, (_extends5 = {}, _extends5[item[key]] = value && item[value] || value === undefined && item || '', _extends5));
  }, initialValue);
};
var renderCount$1 = 0;
var FormBuilderNext = React__default.forwardRef(function (_ref6, ref) {
  var _data$root, _data$root$items;
  var items = _ref6.items,
    validationResolver = _ref6.validationResolver,
    ControlledComponents = _ref6.ControlledComponents,
    components = _ref6.components,
    managedCallback = _ref6.managedCallback,
    _ref6$defaultValues = _ref6.defaultValues,
    defaultValues = _ref6$defaultValues === void 0 ? {} : _ref6$defaultValues;
  console.log("dyno ;)", defaultValues, "defaultValues");
  var _useForm = useForm({
      mode: 'onChange',
      shouldUnregister: true,
      defaultValues: defaultValues
    }),
    register = _useForm.register,
    handleSubmit = _useForm.handleSubmit,
    watch = _useForm.watch,
    errors = _useForm.formState.errors,
    control = _useForm.control,
    trigger = _useForm.trigger,
    setFocus = _useForm.setFocus,
    getValues = _useForm.getValues,
    setValue = _useForm.setValue,
    triggerBackground = _useForm.triggerBackground,
    unregister = _useForm.unregister;
  var sharedItems = {
    register: register,
    handleSubmit: handleSubmit,
    watch: watch,
    errors: errors,
    control: control,
    trigger: trigger,
    setFocus: setFocus,
    getValues: getValues,
    setValue: setValue,
    useFieldArray: useFieldArray,
    useWatch: useWatch,
    triggerBackground: triggerBackground,
    unregister: unregister
  };
  var myComponents = React__default.useRef();
  var watchingComponents = React__default.useRef();
  var preConditionItems = React__default.useRef();
  var _useState = useState(),
    data = _useState[0],
    setData = _useState[1];
  React__default.useEffect(function () {
    if (items === undefined) return;
    myComponents.current = items;
    watchingComponents.current = prepareWtchingComponents$1(myComponents.current);
    console.log("dyno ;)", myComponents, 'myComponentsmyComponents');
    console.log("dyno ;)", watchingComponents, 'prepareWtchingComponents', [].concat(watchingComponents.current.keys()));
    var subscription = watch(function (value, _ref7) {
      var name = _ref7.name,
        type = _ref7.type;
      try {
        return Promise.resolve(function () {
          if (watchingComponents.current.get(name)) {
            console.log("dyno ;)", "checkPreCondition ;) checkPreCondition", value, name, type, data, items);
            return Promise.resolve(checkPreCondition(name, value[name], items)).then(function (_ref8) {
              var a = _ref8[0],
                b = _ref8[1];
              if (!deepEqual(data, b) && a) {
                setData(_extends({}, b));
              }
            });
          }
        }());
      } catch (e) {
        return Promise.reject(e);
      }
    });
    setData(items);
  }, [items]);
  var resetValues = function resetValues() {
    myComponents.current = resetItems$1(items, 'name');
    setData(items);
  };
  var getValuesPOC = function getValuesPOC() {
    try {
      if (Object.keys(errors).length > 0) return Promise.resolve(false);
      return Promise.resolve(trigger()).then(function (result) {
        console.log("dyno ;)", "SUBMITFORM SUBMITFORM result trigger", result, errors);
        if (result === true) {
          return Promise.resolve(getValues());
        } else {
          return false;
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  ref.current = {
    getValues: getValuesPOC,
    resetValues: resetValues,
    setValue: setValue
  };
  var validationOnce = function validationOnce(name, value, result) {
    try {
      var validatedItem = myComponents.current[name];
      var n = result;
      var originalErrors = _extends({}, errors.current) || {};
      var newErrors = errors.current || {};
      var error = false;
      if (value !== '') {
        var _error = value === '313';
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
      errors.current = _extends({}, newErrors);
      console.log("dyno ;)", errors, "errrrrrrrrr", newErrors);
      if (error.current !== originalErrors) {}
      return Promise.resolve([!_.isEqual(originalErrors, newErrors), [].concat(n), newErrors[name]]);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var updateReference = function updateReference(value, name) {
    try {
      myComponents.current[name].value = value;
      var _myComponents$current = myComponents.current;
      return Promise.resolve(getValuesPOC()).then(function (_getValuesPOC) {
        console.log("dyno ;)", _myComponents$current, 'getValues', _getValuesPOC);
        return Promise.resolve(validationOnce(name, value, _extends({}, data))).then(function (_ref9) {
          var hasValidationChanged = _ref9[0],
            result = _ref9[1],
            error = _ref9[2];
          return Promise.resolve(checkPreCondition(name, value, data)).then(function (_ref10) {
            var hasPreconditionChanged = _ref10[0],
              preResult = _ref10[1];
            if (hasValidationChanged === true || hasPreconditionChanged === true) {
              console.log("dyno ;)", 'lololololololololololoolol', hasValidationChanged, hasPreconditionChanged, errors);
              setData(_extends({}, preResult));
            }
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var checkPreCondition = function checkPreCondition(name, value, result) {
    try {
      var _temp2 = function _temp2() {
        return [updated, n];
        return [updated, _extends({}, n)];
      };
      var hasCondition = watchingComponents.current.get(name);
      console.log("dyno ;)", data, "checkPreConditionInside", name, myComponents.current, hasCondition, watchingComponents.current);
      var n = _extends({}, result);
      var updated = false;
      var _temp = function () {
        if (hasCondition !== undefined) {
          return Promise.resolve(hasCondition.map(function (item) {
            try {
              var _temp3 = function _temp3(touched) {
                var i = n[item.refId];
                console.log("dyno ;)", n["accountNo"], "accountNoaccountNo", '-----', i);
                if (i !== undefined && i.visible !== touched) {
                  n[item.refId].visible = touched;
                  updated = true;
                }
              };
              var realValue = value && value["value"] || value;
              var _item$type = item === null || item === void 0 ? void 0 : item.type;
              return Promise.resolve(_item$type ? Promise.resolve(validationResolver[item.type](item, realValue)).then(_temp3) : _temp3(_item$type));
            } catch (e) {
              return Promise.reject(e);
            }
          })).then(function () {});
        }
      }();
      return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  console.log("dyno ;)", 'renderCount', renderCount$1++);
  return data && ((_data$root = data.root) === null || _data$root === void 0 ? void 0 : (_data$root$items = _data$root.items) === null || _data$root$items === void 0 ? void 0 : _data$root$items.map(function (name, index) {
    return renderComponentInd(name, data, {
      updateReference: updateReference,
      myComponents: myComponents,
      getValues: getValues,
      errors: errors,
      ControlledComponents: ControlledComponents,
      components: components,
      managedCallback: managedCallback,
      undefined: undefined,
      sharedItems: sharedItems,
      index: index
    });
  })) || null;
});
FormBuilderNext.whyDidYouRender = true;
FormBuilderNext.displayName = "FormBuilderNext";

var defaultOptions$1 = {
  mode: VALIDATION_MODE.onSubmit,
  reValidateMode: VALIDATION_MODE.onChange,
  shouldFocusError: true
};
var isWindowUndefined$1 = typeof window === 'undefined';
function createFormControlV4(props) {
  if (props === void 0) {
    props = {};
  }
  var formOptions = Object.assign(Object.assign({}, defaultOptions$1), props);
  console.log("dyno ;)", formOptions, 'formOptions');
  var _delayCallback;
  var _formState = {
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
  var _proxyFormState = {
    isDirty: false,
    dirtyFields: false,
    touchedFields: false,
    isValidating: false,
    isValid: false,
    errors: false
  };
  var _fields = {};
  var _formValues = {};
  var _defaultValues = formOptions.defaultValues || {};
  var _isInAction = false;
  var _isMounted = false;
  var _subjects = {
    watch: new Subject(),
    control: new Subject(),
    array: new Subject(),
    state: new Subject()
  };
  var _names = {
    mount: new Set(),
    unMount: new Set(),
    array: new Set(),
    watch: new Set(),
    watchAll: false
  };
  var validationMode = getValidationModes(formOptions.mode);
  var isValidateAllFieldCriteria = formOptions.criteriaMode === VALIDATION_MODE.all;
  var isFieldWatched = function isFieldWatched(name) {
    return _names.watchAll || _names.watch.has(name) || _names.watch.has((name.match(/\w+/) || [])[0]);
  };
  var updateErrorState = function updateErrorState(name, error) {
    set(_formState.errors, name, error);
    _subjects.state.next({
      errors: _formState.errors
    });
  };
  var shouldRenderBaseOnValid = function shouldRenderBaseOnValid() {
    return Promise.resolve(validateForm(_fields, true)).then(function (isValid) {
      if (isValid !== _formState.isValid) {
        _formState.isValid = isValid;
        _subjects.state.next({
          isValid: isValid
        });
      }
    });
  };
  var shouldRenderBaseOnError = function shouldRenderBaseOnError(shouldSkipRender, name, error, fieldState, isValidFromResolver, isWatched) {
    try {
      var previousError = get(_formState.errors, name);
      var isValid = !!(_proxyFormState.isValid && (formOptions.resolver ? isValidFromResolver : shouldRenderBaseOnValid()));
      if (props.delayError && error) {
        _delayCallback = _delayCallback || debounce(updateErrorState, props.delayError);
        _delayCallback(name, error);
      } else {
        error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
      }
      if ((isWatched || (error ? !deepEqual(previousError, error) : previousError) || !isEmptyObject(fieldState) || _formState.isValid !== isValid) && !shouldSkipRender) {
        var updatedFormState = Object.assign(Object.assign(Object.assign({}, fieldState), _proxyFormState.isValid && formOptions.resolver ? {
          isValid: isValid
        } : {}), {
          errors: _formState.errors,
          name: name
        });
        _formState = Object.assign(Object.assign({}, _formState), updatedFormState);
        _subjects.state.next(isWatched ? {
          name: name
        } : updatedFormState);
      }
      _subjects.state.next({
        isValidating: false
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var setFieldValue = function setFieldValue(name, value, options, shouldRender) {
    if (options === void 0) {
      options = {};
    }
    var field = get(_fields, name);
    if (field) {
      var _f = field._f;
      if (_f) {
        set(_formValues, name, getFieldValueAs(value, _f));
        var fieldValue = isWeb && isHTMLElement(_f.ref) && isNullOrUndefined(value) ? '' : value;
        if (isFileInput(_f.ref) && !isString(fieldValue)) {
          _f.ref.files = fieldValue;
        } else if (isMultipleSelect(_f.ref)) {
          [].concat(_f.ref.options).forEach(function (selectRef) {
            return selectRef.selected = fieldValue.includes(selectRef.value);
          });
        } else if (_f.refs) {
          if (isCheckBoxInput(_f.ref)) {
            _f.refs.length > 1 ? _f.refs.forEach(function (checkboxRef) {
              return checkboxRef.checked = Array.isArray(fieldValue) ? !!fieldValue.find(function (data) {
                return data === checkboxRef.value;
              }) : fieldValue === checkboxRef.value;
            }) : _f.refs[0].checked = !!fieldValue;
          } else {
            _f.refs.forEach(function (radioRef) {
              return radioRef.checked = radioRef.value === fieldValue;
            });
          }
        } else {
          _f.ref.value = fieldValue;
        }
        if (shouldRender) {
          _subjects.control.next({
            values: getValues(),
            name: name
          });
        }
        (options.shouldDirty || options.shouldTouch) && updateTouchAndDirtyState(name, fieldValue, options.shouldTouch);
        options.shouldValidate && trigger(name);
      }
    }
  };
  var updateTouchAndDirtyState = function updateTouchAndDirtyState(name, inputValue, isCurrentTouched, shouldRender) {
    if (shouldRender === void 0) {
      shouldRender = true;
    }
    var state = {
      name: name
    };
    var isChanged = false;
    if (_proxyFormState.isDirty) {
      var previousIsDirty = _formState.isDirty;
      _formState.isDirty = _getIsDirty();
      state.isDirty = _formState.isDirty;
      isChanged = previousIsDirty !== state.isDirty;
    }
    if (_proxyFormState.dirtyFields && !isCurrentTouched) {
      var isPreviousFieldDirty = get(_formState.dirtyFields, name);
      var isCurrentFieldDirty = !deepEqual(get(_defaultValues, name), inputValue);
      isCurrentFieldDirty ? set(_formState.dirtyFields, name, true) : unset(_formState.dirtyFields, name);
      state.dirtyFields = _formState.dirtyFields;
      isChanged = isChanged || isPreviousFieldDirty !== get(_formState.dirtyFields, name);
    }
    var isPreviousFieldTouched = get(_formState.touchedFields, name);
    if (isCurrentTouched && !isPreviousFieldTouched) {
      set(_formState.touchedFields, name, isCurrentTouched);
      state.touchedFields = _formState.touchedFields;
      isChanged = isChanged || _proxyFormState.touchedFields && isPreviousFieldTouched !== isCurrentTouched;
    }
    isChanged && shouldRender && _subjects.state.next(state);
    return isChanged ? state : {};
  };
  var executeResolver = function executeResolver(name) {
    try {
      var _formOptions$resolver2 = formOptions.resolver;
      return Promise.resolve(_formOptions$resolver2 ? formOptions.resolver(Object.assign({}, _formValues), formOptions.context, getResolverOptions(name || _names.mount, _fields, formOptions.criteriaMode, formOptions.shouldUseNativeValidation)) : {});
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var executeResolverValidation = function executeResolverValidation(names) {
    return Promise.resolve(executeResolver()).then(function (_ref) {
      var errors = _ref.errors;
      if (names) {
        for (var _iterator = _createForOfIteratorHelperLoose(names), _step; !(_step = _iterator()).done;) {
          var name = _step.value;
          var error = get(errors, name);
          error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
        }
      } else {
        _formState.errors = errors;
      }
      return errors;
    });
  };
  var validateForm = function validateForm(_fields, shouldCheckValid, context, formId) {
    if (context === void 0) {
      context = {
        valid: true
      };
    }
    if (formId === void 0) {
      formId = "ALL";
    }
    try {
      var _temp7 = function _temp7() {
        return context.valid;
      };
      var _interrupt = false;
      var _temp6 = _forIn(_fields, function (name) {
        var field = _fields[name];
        var _temp5 = function () {
          if (field) {
            var _temp4 = function _temp4() {
              function _temp2(_validateForm) {
                _validateForm;
              }
              return _val ? Promise.resolve(validateForm(_val, shouldCheckValid, context)).then(_temp2) : _temp2(_val);
            };
            var _f = field._f;
            var _val = omit(field, '_f');
            var _temp3 = function () {
              if (_f) {
                var _temp = function () {
                  if (_f.formId === formId || formId === "ALL") {
                    return Promise.resolve(validateField(field, get(_formValues, _f.name), isValidateAllFieldCriteria, formOptions.shouldUseNativeValidation)).then(function (fieldError) {
                      if (shouldCheckValid) {
                        if (fieldError[_f.name]) {
                          context.valid = false;
                          _interrupt = true;
                        }
                      } else {
                        if (fieldError[_f.name]) {
                          context.valid = false;
                        }
                        fieldError[_f.name] ? set(_formState.errors, _f.name, fieldError[_f.name]) : unset(_formState.errors, _f.name);
                        if (Object.keys(_formState.errors).length == 1) {
                          _interrupt = true;
                        }
                      }
                    });
                  }
                }();
                if (_temp && _temp.then) return _temp.then(function () {});
              }
            }();
            return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
          }
        }();
        if (_temp5 && _temp5.then) return _temp5.then(function () {});
      }, function () {
        return _interrupt;
      });
      return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var validateFormBackground = function validateFormBackground(_fields, shouldCheckValid, context, formId) {
    if (context === void 0) {
      context = {
        valid: true
      };
    }
    if (formId === void 0) {
      formId = "ALL";
    }
    try {
      var _interrupt2 = false;
      var localErrors = {};
      var _temp13 = _forIn(_fields, function (name) {
        var field = _fields[name];
        var _temp12 = function () {
          if (field) {
            var _temp11 = function _temp11() {
              function _temp9(_validateForm2) {
                _validateForm2;
              }
              return _val2 ? Promise.resolve(validateForm(_val2, shouldCheckValid, context)).then(_temp9) : _temp9(_val2);
            };
            var _f = field._f;
            var _val2 = omit(field, '_f');
            var _temp10 = function () {
              if (_f) {
                var _temp8 = function () {
                  if (_f.formId === formId || formId === "ALL") {
                    return Promise.resolve(validateField(field, get(_formValues, _f.name), isValidateAllFieldCriteria, formOptions.shouldUseNativeValidation)).then(function (fieldError) {
                      console.log(fieldError, "fieldError");
                      if (shouldCheckValid) {
                        if (fieldError[_f.name]) {
                          context.valid = false;
                          _interrupt2 = true;
                        }
                      } else {
                        if (fieldError[_f.name]) {
                          context.valid = false;
                        }
                        fieldError[_f.name] ? set(localErrors, _f.name, fieldError[_f.name]) : unset(localErrors, _f.name);
                      }
                    });
                  }
                }();
                if (_temp8 && _temp8.then) return _temp8.then(function () {});
              }
            }();
            return _temp10 && _temp10.then ? _temp10.then(_temp11) : _temp11(_temp10);
          }
        }();
        if (_temp12 && _temp12.then) return _temp12.then(function () {});
      }, function () {
        return _interrupt2;
      });
      return Promise.resolve(_temp13 && _temp13.then ? _temp13.then(function () {
        return localErrors;
      }) : localErrors);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var handleChange = function handleChange(_ref2) {
    var type = _ref2.type,
      target = _ref2.target,
      _ref2$target = _ref2.target,
      value = _ref2$target.value,
      name = _ref2$target.name,
      inputType = _ref2$target.type;
    try {
      var error;
      var isValid;
      var field = get(_fields, name);
      return Promise.resolve(function () {
        if (field) {
          var _temp15 = function _temp15() {
            !_isBlurEvent && _subjects.watch.next({
              name: name,
              type: type,
              values: getValues()
            });
            shouldRenderBaseOnError(false, name, error, _fieldState, isValid, _isWatched);
          };
          var inputValue = inputType ? getFieldValue(field) : undefined;
          inputValue = isUndefined(inputValue) ? value : inputValue;
          var _isBlurEvent = type === EVENTS.BLUR;
          var _getValidationModes = getValidationModes(formOptions.reValidateMode),
            isReValidateOnBlur = _getValidationModes.isOnBlur,
            isReValidateOnChange = _getValidationModes.isOnChange;
          var shouldSkipValidation = !hasValidation(field._f, field._f.mount) && !formOptions.resolver && !get(_formState.errors, name) || skipValidation(Object.assign({
            isBlurEvent: _isBlurEvent,
            isTouched: !!get(_formState.touchedFields, name),
            isSubmitted: _formState.isSubmitted,
            isReValidateOnBlur: isReValidateOnBlur,
            isReValidateOnChange: isReValidateOnChange
          }, validationMode));
          var _isWatched = !_isBlurEvent && isFieldWatched(name);
          if (!isUndefined(inputValue)) {
            set(_formValues, name, inputValue);
          }
          var _fieldState = updateTouchAndDirtyState(name, inputValue, _isBlurEvent, false);
          var shouldRender = field._f.watch || !isEmptyObject(_fieldState) || _isWatched;
          console.log("dyno ;)", shouldRender, "heyyyyyyyyyyy { " + name + " } watch me or not?!", field._f.watch, "shouldSkipValidation:", shouldSkipValidation, "isBlurEvent:", _isBlurEvent, '------;)---- is watching hahaha:', _isWatched);
          if (shouldSkipValidation) {
            !_isBlurEvent && _subjects.watch.next({
              name: name,
              type: type
            });
            return shouldRender && _subjects.state.next(_isWatched ? {
              name: name
            } : Object.assign(Object.assign({}, _fieldState), {
              name: name
            }));
          }
          _subjects.state.next({
            isValidating: true
          });
          var _temp14 = function () {
            if (formOptions.resolver) {
              return Promise.resolve(executeResolver([name])).then(function (_ref3) {
                var errors = _ref3.errors;
                error = get(errors, name);
                if (isCheckBoxInput(target) && !error) {
                  var parentNodeName = getNodeParentName(name);
                  var valError = get(errors, parentNodeName, {});
                  valError.type && valError.message && (error = valError);
                  if (valError || get(_formState.errors, parentNodeName)) {
                    name = parentNodeName;
                  }
                }
                isValid = isEmptyObject(errors);
              });
            } else {
              return Promise.resolve(validateField(field, get(_formValues, name), isValidateAllFieldCriteria, formOptions.shouldUseNativeValidation)).then(function (_validateField) {
                error = _validateField[name];
              });
            }
          }();
          return _temp14 && _temp14.then ? _temp14.then(_temp15) : _temp15(_temp14);
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var _updateValidAndInputValue = function _updateValidAndInputValue(name, ref, shouldSkipValueAs) {
    var field = get(_fields, name);
    if (field) {
      var fieldValue = get(_formValues, name);
      var isValueUndefined = isUndefined(fieldValue);
      var defaultValue = isValueUndefined ? get(_defaultValues, name) : fieldValue;
      if (isUndefined(defaultValue) || ref && ref.defaultChecked || shouldSkipValueAs) {
        ref && ref.visible && set(_formValues, name, shouldSkipValueAs ? defaultValue : getFieldValue(field));
      } else {
        setFieldValue(name, defaultValue);
      }
    }
    _isMounted && _proxyFormState.isValid && _updateValid();
  };
  var _getIsDirty = function _getIsDirty(name, data) {
    name && data && set(_formValues, name, data);
    return !deepEqual(Object.assign({}, getValues()), _defaultValues);
  };
  var _updateValid = function _updateValid() {
    try {
      var _formOptions$resolver3 = formOptions.resolver;
      return Promise.resolve(_formOptions$resolver3 ? executeResolver() : validateForm(_fields, true)).then(function (_executeResolver) {
        var isValid = _executeResolver;
        if (isValid !== _formState.isValid) {
          _formState.isValid = isValid;
          _subjects.state.next({
            isValid: isValid
          });
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var setValues = function setValues(name, value, options) {
    return Object.entries(value).forEach(function (_ref4) {
      var fieldKey = _ref4[0],
        fieldValue = _ref4[1];
      var fieldName = name + "." + fieldKey;
      var field = get(_fields, fieldName);
      var isFieldArray = _names.array.has(name);
      (isFieldArray || !isPrimitive(fieldValue) || field && !field._f) && !isDateObject(fieldValue) ? setValues(fieldName, fieldValue, options) : setFieldValue(fieldName, fieldValue, options, true);
    });
  };
  var _getWatch = function _getWatch(fieldNames, defaultValue, isGlobal) {
    var fieldValues = Object.assign({}, _isMounted ? Object.assign({}, Object.assign(Object.assign({}, _defaultValues), _formValues)) : isUndefined(defaultValue) ? _defaultValues : defaultValue);
    if (!fieldNames) {
      isGlobal && (_names.watchAll = true);
      return fieldValues;
    }
    var resultChanges = [];
    var result = new Map();
    for (var _iterator2 = _createForOfIteratorHelperLoose(convertToArrayPayload(fieldNames)), _step2; !(_step2 = _iterator2()).done;) {
      var fieldName = _step2.value;
      isGlobal && _names.watch.add(fieldName);
      resultChanges.push(get(fieldValues, fieldName));
      result.set(fieldName, get(fieldValues, fieldName));
    }
    return Array.isArray(fieldNames) ? [resultChanges, result] : isObject(result[0]) ? Object.assign({}, result[0]) : Array.isArray(result[0]) ? [].concat(result[0]) : result[0];
  };
  var _updateFormValues = function _updateFormValues(defaultValues, name) {
    if (name === void 0) {
      name = '';
    }
    console.log("dyno ;)", defaultValues, "_updateFormValues");
    for (var key in defaultValues) {
      var value = defaultValues[key];
      var fieldName = name + (name ? '.' : '') + key;
      var field = get(_fields, fieldName);
      if (!field || !field._f) {
        if (isObject(value) || Array.isArray(value)) {
          _updateFormValues(value, fieldName);
        } else if (!field) {
          set(_formValues, fieldName, value);
        }
      }
    }
  };
  var _bathFieldArrayUpdate = function _bathFieldArrayUpdate(keyName, name, method, args, updatedFieldArrayValues, shouldSet, shouldSetFields) {
    if (updatedFieldArrayValues === void 0) {
      updatedFieldArrayValues = [];
    }
    if (shouldSet === void 0) {
      shouldSet = true;
    }
    if (shouldSetFields === void 0) {
      shouldSetFields = true;
    }
    _isInAction = true;
    if (shouldSetFields && get(_fields, name)) {
      var output = method(get(_fields, name), args.argA, args.argB);
      shouldSet && set(_fields, name, output);
    }
    set(_formValues, name, updatedFieldArrayValues);
    if (Array.isArray(get(_formState.errors, name))) {
      var _output = method(get(_formState.errors, name), args.argA, args.argB);
      shouldSet && set(_formState.errors, name, _output);
      unsetEmptyArray(_formState.errors, name);
    }
    if (_proxyFormState.touchedFields && get(_formState.touchedFields, name)) {
      var _output2 = method(get(_formState.touchedFields, name), args.argA, args.argB);
      shouldSet && set(_formState.touchedFields, name, _output2);
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
  var _getFieldArrayValue = function _getFieldArrayValue(name) {
    return get(_isMounted ? _formValues : _defaultValues, name, []);
  };
  var setValue = function setValue(name, value, options) {
    if (options === void 0) {
      options = {};
    }
    var field = get(_fields, name);
    var isFieldArray = _names.array.has(name);
    set(_formValues, name, value);
    if (isFieldArray) {
      _subjects.array.next({
        values: value,
        name: name,
        isReset: true
      });
      if ((_proxyFormState.isDirty || _proxyFormState.dirtyFields) && options.shouldDirty) {
        set(_formState.dirtyFields, name, setFieldArrayDirtyFields(value, get(_defaultValues, name, []), get(_formState.dirtyFields, name, [])));
        _subjects.state.next({
          name: name,
          dirtyFields: _formState.dirtyFields,
          isDirty: _getIsDirty(name, value)
        });
      }
    } else {
      field && !field._f && !isNullOrUndefined(value) ? setValues(name, value, options) : setFieldValue(name, value, options, true);
    }
    isFieldWatched(name) && _subjects.state.next({});
    _subjects.watch.next({
      name: name
    });
  };
  var trigger = function trigger(name, options) {
    if (options === void 0) {
      options = {};
    }
    try {
      var _temp18 = function _temp18() {
        _subjects.state.next(Object.assign(Object.assign({}, isString(name) ? {
          name: name
        } : {}), {
          errors: _formState.errors,
          isValidating: false
        }));
        if (options.shouldFocus && !isValid) {
          focusFieldBy(_fields, function (key) {
            return get(_formState.errors, key);
          }, name ? _fieldNames : _names.mount);
        }
        _proxyFormState.isValid && _updateValid();
        return isValid;
      };
      var _fieldNames = convertToArrayPayload(name);
      var isValid;
      _subjects.state.next({
        isValidating: true
      });
      var _temp17 = function () {
        if (formOptions.resolver) {
          return Promise.resolve(executeResolverValidation(isUndefined(name) ? name : _fieldNames)).then(function (schemaResult) {
            isValid = name ? _fieldNames.every(function (name) {
              return !get(schemaResult, name);
            }) : isEmptyObject(schemaResult);
          });
        } else {
          var _temp16 = function () {
            if (name) {
              return Promise.resolve(Promise.all(_fieldNames.map(function (fieldName) {
                try {
                  var _ref5;
                  var field = get(_fields, fieldName);
                  return Promise.resolve(validateForm(field._f ? (_ref5 = {}, _ref5[fieldName] = field, _ref5) : field));
                } catch (e) {
                  return Promise.reject(e);
                }
              }))).then(function (_Promise$all) {
                isValid = _Promise$all.every(Boolean);
              });
            } else {
              return Promise.resolve(validateForm(_fields)).then(function () {
                isValid = isEmptyObject(_formState.errors);
              });
            }
          }();
          if (_temp16 && _temp16.then) return _temp16.then(function () {});
        }
      }();
      return Promise.resolve(_temp17 && _temp17.then ? _temp17.then(_temp18) : _temp18(_temp17));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var triggerBackground = function triggerBackground(name, options) {
    if (options === void 0) {
      options = {};
    }
    try {
      var _temp21 = function _temp21() {
        if (options.shouldFocus && !isValid) {
          focusFieldBy(_fields, function (key) {
            return get(_formState.errors, key);
          }, name ? _fieldNames2 : _names.mount);
        }
        _proxyFormState.isValid && _updateValid();
        return isValid;
      };
      var _fieldNames2 = convertToArrayPayload(name);
      var isValid;
      console.log("dyno ;)", "trigger", _formState.errors);
      var _temp20 = function () {
        if (formOptions.resolver) {
          return Promise.resolve(executeResolverValidation(isUndefined(name) ? name : _fieldNames2)).then(function (schemaResult) {
            isValid = name ? _fieldNames2.every(function (name) {
              return !get(schemaResult, name);
            }) : isEmptyObject(schemaResult);
          });
        } else {
          var _temp19 = function () {
            if (name) {
              return Promise.resolve(Promise.all(_fieldNames2.map(function (fieldName) {
                try {
                  var _ref6;
                  var field = get(_fields, fieldName);
                  return Promise.resolve(validateForm(field._f ? (_ref6 = {}, _ref6[fieldName] = field, _ref6) : field));
                } catch (e) {
                  return Promise.reject(e);
                }
              }))).then(function (_Promise$all2) {
                isValid = _Promise$all2.every(Boolean);
              });
            } else {
              return Promise.resolve(validateForm(_fields, true)).then(function (_validateForm4) {
                isValid = _validateForm4;
              });
            }
          }();
          if (_temp19 && _temp19.then) return _temp19.then(function () {});
        }
      }();
      return Promise.resolve(_temp20 && _temp20.then ? _temp20.then(_temp21) : _temp21(_temp20));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var triggerBackgroundOptimised = function triggerBackgroundOptimised(formId) {
    if (formId === void 0) {
      formId = "ALL";
    }
    return function (list) {
      if (list === void 0) {
        list = false;
      }
      try {
        var _temp24 = function _temp24() {
          _proxyFormState.isValid && _updateValid();
          return isValid;
        };
        var isValid;
        console.log("dyno ;)", "triggerBackgroundtriggerBackground", _formState.errors);
        var _temp23 = function () {
          if (formOptions.resolver) {
            return Promise.resolve(executeResolverValidation(fieldNames)).then(function (schemaResult) {
              isValid = isEmptyObject(schemaResult);
            });
          } else {
            var _temp22 = function () {
              if (list) {
                return Promise.resolve(validateFormBackground(_fields, false, {
                  valid: true
                })).then(function (_validateFormBackgrou) {
                  isValid = _validateFormBackgrou;
                });
              } else {
                return Promise.resolve(validateForm(_fields, true, {
                  valid: true
                }, formId)).then(function (_validateForm6) {
                  isValid = _validateForm6;
                });
              }
            }();
            if (_temp22 && _temp22.then) return _temp22.then(function () {});
          }
        }();
        return Promise.resolve(_temp23 && _temp23.then ? _temp23.then(_temp24) : _temp24(_temp23));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  };
  var getValues = function getValues(fieldNames) {
    var values = Object.assign(Object.assign({}, _defaultValues), _formValues);
    return isUndefined(fieldNames) ? values : isString(fieldNames) ? get(values, fieldNames) : fieldNames.map(function (name) {
      return get(values, name);
    });
  };
  var clearErrors = function clearErrors(name) {
    name ? convertToArrayPayload(name).forEach(function (inputName) {
      return unset(_formState.errors, inputName);
    }) : _formState.errors = {};
    _subjects.state.next({
      errors: _formState.errors
    });
  };
  var setError = function setError(name, error, options) {
    var ref = (get(_fields, name, {
      _f: {}
    })._f || {}).ref;
    set(_formState.errors, name, Object.assign(Object.assign({}, error), {
      ref: ref
    }));
    _subjects.state.next({
      name: name,
      errors: _formState.errors,
      isValid: false
    });
    options && options.shouldFocus && ref && ref.focus && ref.focus();
  };
  var watch = function watch(fieldName, defaultValue) {
    return isFunction(fieldName) ? _subjects.watch.subscribe({
      next: function next(info) {
        return fieldName(_getWatch(undefined, defaultValue), info);
      }
    }) : _getWatch(fieldName, defaultValue, true);
  };
  var unregister = function unregister(name, options) {
    if (options === void 0) {
      options = {};
    }
    for (var _iterator3 = _createForOfIteratorHelperLoose(name ? convertToArrayPayload(name) : _names.mount), _step3; !(_step3 = _iterator3()).done;) {
      var inputName = _step3.value;
      _names.mount["delete"](inputName);
      _names.array["delete"](inputName);
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
  var registerFieldRef = function registerFieldRef(name, fieldRef, options) {
    register(name, options);
    var field = get(_fields, name);
    var ref = isUndefined(fieldRef.value) ? fieldRef.querySelectorAll ? fieldRef.querySelectorAll('input,select,textarea')[0] || fieldRef : fieldRef : fieldRef;
    var isRadioOrCheckbox = isRadioOrCheckboxFunction(ref);
    if (ref === field._f.ref || isRadioOrCheckbox && compact(field._f.refs || []).find(function (option) {
      return option === ref;
    })) {
      return;
    }
    field = {
      _f: isRadioOrCheckbox ? Object.assign(Object.assign({}, field._f), {
        refs: [].concat(compact(field._f.refs || []).filter(function (ref) {
          return isHTMLElement(ref) && document.contains(ref);
        }), [ref]),
        ref: {
          type: ref.type,
          name: name
        }
      }) : Object.assign(Object.assign({}, field._f), {
        ref: ref
      })
    };
    set(_fields, name, field);
    _updateValidAndInputValue(name, ref);
  };
  var register = function register(name, options) {
    if (options === void 0) {
      options = {};
    }
    var field = get(_fields, name);
    set(_fields, name, {
      _f: Object.assign(Object.assign(Object.assign({}, field && field._f ? field._f : {
        ref: {
          name: name
        }
      }), {
        name: name,
        mount: true
      }), options)
    });
    console.log("dyno ;)", Object.assign(Object.assign(Object.assign({}, field && field._f ? field._f : {
      ref: {
        name: name
      }
    }), {
      name: name,
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
      name: name
    }, isUndefined(options.disabled) ? {} : {
      disabled: options.disabled
    }), {
      onChange: handleChange,
      onBlur: handleChange,
      ref: function ref(_ref7) {
        if (_ref7) {
          registerFieldRef(name, _ref7, options);
        } else {
          var _field = get(_fields, name, {});
          var _shouldUnregister = formOptions.shouldUnregister || options.shouldUnregister;
          if (_field._f) {
            _field._f.mount = false;
          }
          _shouldUnregister && !(isNameInFieldArray(_names.array, name) && _isInAction) && _names.unMount.add(name);
        }
      }
    });
  };
  var handleSubmit = function handleSubmit(onValid, onInvalid) {
    return function (e) {
      try {
        if (e) {
          e.preventDefault && e.preventDefault();
          e.persist && e.persist();
        }
        var hasNoPromiseError = true;
        var fieldValues = Object.assign({}, _formValues);
        _subjects.state.next({
          isSubmitting: true
        });
        return Promise.resolve(_finallyRethrows(function () {
          return _catch(function () {
            function _temp28() {
              var _temp26 = function () {
                if (isEmptyObject(_formState.errors) && Object.keys(_formState.errors).every(function (name) {
                  return get(fieldValues, name);
                })) {
                  _subjects.state.next({
                    errors: {},
                    isSubmitting: true
                  });
                  return Promise.resolve(onValid(fieldValues, e)).then(function () {});
                } else {
                  var _temp25 = function _temp25(_onInvalid) {
                    _onInvalid;
                    formOptions.shouldFocusError && focusFieldBy(_fields, function (key) {
                      return get(_formState.errors, key);
                    }, _names.mount);
                  };
                  return onInvalid ? Promise.resolve(onInvalid(_formState.errors, e)).then(_temp25) : _temp25(onInvalid);
                }
              }();
              if (_temp26 && _temp26.then) return _temp26.then(function () {});
            }
            var _temp27 = function () {
              if (formOptions.resolver) {
                return Promise.resolve(executeResolver()).then(function (_ref8) {
                  var errors = _ref8.errors,
                    values = _ref8.values;
                  _formState.errors = errors;
                  fieldValues = values;
                });
              } else {
                return Promise.resolve(validateForm(_fields)).then(function () {});
              }
            }();
            return _temp27 && _temp27.then ? _temp27.then(_temp28) : _temp28(_temp27);
          }, function (err) {
            hasNoPromiseError = false;
            throw err;
          });
        }, function (_wasThrown, _result2) {
          _formState.isSubmitted = true;
          _subjects.state.next({
            isSubmitted: true,
            isSubmitting: false,
            isSubmitSuccessful: isEmptyObject(_formState.errors) && hasNoPromiseError,
            submitCount: _formState.submitCount + 1,
            errors: _formState.errors
          });
          if (_wasThrown) throw _result2;
          return _result2;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  };
  var reset = function reset(values, keepStateOptions) {
    if (keepStateOptions === void 0) {
      keepStateOptions = {};
    }
    var updatedValues = values || _defaultValues;
    if (isWeb && !keepStateOptions.keepValues) {
      for (var _iterator4 = _createForOfIteratorHelperLoose(_names.mount), _step4; !(_step4 = _iterator4()).done;) {
        var name = _step4.value;
        var field = get(_fields, name);
        if (field && field._f) {
          var inputRef = Array.isArray(field._f.refs) ? field._f.refs[0] : field._f.ref;
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
  var setFocus = function setFocus(name) {
    return get(_fields, name)._f.ref.focus();
  };
  return {
    control: {
      register: register,
      unregister: unregister,
      _getIsDirty: _getIsDirty,
      _getWatch: _getWatch,
      _updateValid: _updateValid,
      _updateFormValues: _updateFormValues,
      _bathFieldArrayUpdate: _bathFieldArrayUpdate,
      _getFieldArrayValue: _getFieldArrayValue,
      _subjects: _subjects,
      _shouldUnregister: formOptions.shouldUnregister,
      _fields: _fields,
      _proxyFormState: _proxyFormState,
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
      _updateProps: function _updateProps(options) {
        formOptions = Object.assign(Object.assign({}, defaultOptions$1), options);
      }
    },
    trigger: trigger,
    triggerBackground: triggerBackground,
    triggerBackgroundOptimised: triggerBackgroundOptimised,
    register: register,
    handleSubmit: handleSubmit,
    watch: watch,
    setValue: setValue,
    getValues: getValues,
    reset: reset,
    clearErrors: clearErrors,
    unregister: unregister,
    setError: setError,
    setFocus: setFocus
  };
}

function useForm$1(props) {
  if (props === void 0) {
    props = {};
  }
  var _formControl = useRef();
  var _React$useState = useState({
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
    }),
    formState = _React$useState[0],
    updateFormState = _React$useState[1];
  if (_formControl.current) {
    _formControl.current.control._updateProps(props);
  } else {
    _formControl.current = Object.assign(Object.assign({}, createFormControlV4(props)), {
      formState: formState
    });
  }
  var control = _formControl.current.control;
  useEffect(function () {
    var formStateSubscription = control._subjects.state.subscribe({
      next: function next(formState) {
        if (shouldRenderFormState(formState, control._proxyFormState, true)) {
          control._formState.val = Object.assign(Object.assign({}, control._formState.val), formState);
          updateFormState(Object.assign({}, control._formState.val));
        }
      }
    });
    var useFieldArraySubscription = control._subjects.array.subscribe({
      next: function next(state) {
        if (state.values && state.name && control._proxyFormState.isValid) {
          set(control._formValues, state.name, state.values);
          control._updateValid();
        }
      }
    });
    return function () {
      formStateSubscription.unsubscribe();
      useFieldArraySubscription.unsubscribe();
    };
  }, [control]);
  useEffect(function () {
    var unregisterFieldNames = [];
    if (!control._isMounted) {
      control._isMounted = true;
      control._proxyFormState.isValid && control._updateValid();
      !props.shouldUnregister && control._updateFormValues(control._defaultValues);
    }
    for (var _iterator = _createForOfIteratorHelperLoose(control._names.unMount), _step; !(_step = _iterator()).done;) {
      var name = _step.value;
      var field = get(control._fields, name);
      field && (field._f.refs ? field._f.refs.every(live) : live(field._f.ref)) && unregisterFieldNames.push(name);
    }
    console.log("dyno ;)", unregisterFieldNames, 'unregisterFieldNames', control._names, control);
    unregisterFieldNames.length && _formControl.current.unregister(unregisterFieldNames);
    control._names.unMount = new Set();
  });
  _formControl.current.formState = getProxyFormState(formState, control._proxyFormState);
  return _formControl.current;
}

var renderComponentInd$1 = function renderComponentInd(name, data, _ref) {
  var updateReference = _ref.updateReference,
    myComponents = _ref.myComponents,
    getValues = _ref.getValues,
    errors = _ref.errors,
    ControlledComponents = _ref.ControlledComponents,
    components = _ref.components,
    managedCallback = _ref.managedCallback,
    undefined$1 = _ref.undefined,
    sharedItems = _ref.sharedItems,
    index = _ref.index,
    parent = _ref.parent,
    _ref$givenName = _ref.givenName,
    givenName = _ref$givenName === void 0 ? undefined$1 : _ref$givenName,
    dataTransformer = _ref.dataTransformer;
  var selectedComponent = _extends({}, data[name], {
    givenName: givenName
  });
  if (selectedComponent === undefined$1) return null;
  if ((selectedComponent === null || selectedComponent === void 0 ? void 0 : selectedComponent.visible) === false) return null;
  return renderComponentForm$1(selectedComponent, updateReference, myComponents, getValues, _extends({}, errors), ControlledComponents, components, managedCallback, undefined$1, sharedItems, index, data, parent, dataTransformer);
};
var renderComponentForm$1 = function renderComponentForm(item, updateReference, myControl, getValue, errorss, ControlledComponents, components, managedCallback, parentName, sharedItems, index, data, parent, dataTransformer) {
  console.log("dyno ;)", errorss, 'dataerrors');
  var errors = sharedItems.errors,
    control = sharedItems.control,
    useFieldArray = sharedItems.useFieldArray;
  var name = parentName && parentName + "." + item.name || item.givenName && item.givenName || item.name;
  var result = null;
  var child = [];
  if (item.items) {
    child = item.items.map(function (name, idx) {
      return renderComponentInd$1(name, data, {
        updateReference: updateReference,
        myControl: myControl,
        getValue: getValue,
        errors: errors,
        ControlledComponents: ControlledComponents,
        components: components,
        managedCallback: managedCallback,
        parentName: (item === null || item === void 0 ? void 0 : item.items) && name || undefined,
        sharedItems: sharedItems,
        index: idx,
        data: data,
        parent: {
          name: item.name,
          index: index,
          id: item.id
        },
        itemName: name,
        dataTransformer: dataTransformer
      });
    });
  }
  var validation = {
    maxLength: item.maxLength && item.maxLength.value !== "" && item.maxLength || undefined,
    minLength: item.minLength && item.minLength.value !== "" && item.minLength || undefined,
    max: item.max && item.max.value !== "" && item.max || undefined,
    min: item.min && item.min.value !== "" && item.min || undefined,
    pattern: item.pattern && item.pattern.value !== "" && item.pattern || undefined,
    required: item.required && item.required.value !== "" && item.required || undefined
  };
  var _ref2 = (item === null || item === void 0 ? void 0 : item.rule) || {
      validate: {}
    },
    _ref2$validate = _ref2.validate,
    validate = _ref2$validate === void 0 ? {} : _ref2$validate;
  if (item !== null && item !== void 0 && item.rule) {
    console.log("dyno ;)", validate, 'validate[', sharedItems === null || sharedItems === void 0 ? void 0 : sharedItems.localFunction);
    Object.keys(validate).forEach(function (key) {
      if (typeof validate[key] === "function") return;
      validate[key] = sharedItems === null || sharedItems === void 0 ? void 0 : sharedItems.localFunction[key](validate[key])(_extends({}, sharedItems, {
        getItem: function getItem() {
          return item;
        }
      }));
      console.log("dyno ;)", validate, 'validate[ within', validate[key]);
    });
    console.log("dyno ;)", validate, 'validate[ after');
  }
  result = /*#__PURE__*/React__default.createElement(Controller, {
    key: item.isArray === true && name + "container" || name,
    name: item.isArray === true && name + "container" || name,
    control: control,
    item: item,
    rules: _extends({}, item.rule) || validation,
    render: function render(_ref3) {
      var field = _ref3.field;
      if (item.isArray) {
        console.log("dyno ;)", name, item.items, "useFieldArray");
        var _useFieldArray = useFieldArray({
            control: control,
            name: name
          }),
          fields = _useFieldArray.fields,
          append = _useFieldArray.append,
          remove = _useFieldArray.remove;
        child = /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("ul", null, fields.map(function (el, index) {
          return /*#__PURE__*/React__default.createElement("li", {
            key: el.id
          }, item.items.map(function (element, indx) {
            return /*#__PURE__*/React__default.createElement(Controller, {
              key: name + "." + index + "." + data[element].name,
              name: name + "." + index + "." + data[element].name,
              control: control,
              render: function render(_ref4) {
                console.log("dyno ;)", name + "." + index + "." + element, '`${name}.${index}.${element}`');
                return renderComponentInd$1(element, data, {
                  updateReference: updateReference,
                  myControl: myControl,
                  getValue: getValue,
                  errors: errors,
                  ControlledComponents: ControlledComponents,
                  components: components,
                  managedCallback: managedCallback,
                  parentName: (item === null || item === void 0 ? void 0 : item.items) && name || undefined,
                  sharedItems: sharedItems,
                  index: index,
                  data: data,
                  parent: {
                    name: item.name,
                    index: index,
                    id: item.id
                  },
                  givenName: name + "." + index + "." + data[element].name,
                  dataTransformer: dataTransformer
                });
              }
            });
          }), /*#__PURE__*/React__default.createElement("button", {
            type: "button",
            onClick: function onClick() {
              return remove(index);
            }
          }, "-"));
        })), /*#__PURE__*/React__default.createElement("button", {
          type: "button",
          onClick: function onClick() {
            return append({});
          }
        }, "+"));
      }
      var proxyHandler = {
        get: function get(target, prop, receiver) {
          if (typeof target[prop] === "object" && target[prop] !== null) {
            console.log("dyno ;)", target[prop], "proxyHanlerrrrrrrr me ;)");
            return new Proxy(target[prop], proxyHandler);
          }
          return dataTransformer(target[prop], prop, target)(_extends({}, sharedItems.localFunction, {
            sharedItems: sharedItems
          }));
        }
      };
      var proxyItem = new Proxy(_extends({}, item, {
        sharedItems: sharedItems
      }), proxyHandler);
      var Component = components(item.type, {
        field: field,
        item: proxyItem,
        name: name,
        index: index,
        managedCallback: managedCallback,
        child: child,
        useFieldArray: useFieldArray,
        error: errors,
        sharedItems: sharedItems,
        parent: parent
      });
      return Component;
    }
  });
  return result;
};
var convertIdToRef$2 = function convertIdToRef(array, key, name, parent, isArray) {
  var result = array.reduce(function (obj, item, currentIndex) {
    var _extends2;
    var itemName = isArray === undefined && item[key] || parent + ".0." + item[key];
    var refId = name && name + ".items[" + currentIndex + "]" || "[" + currentIndex + "]";
    return _extends({}, obj, (_extends2 = {}, _extends2[itemName] = _extends({}, item, {
      name: itemName,
      refId: refId
    }, parent && {
      parent: parent
    }), _extends2), item.items !== undefined && convertIdToRef(item.items, 'name', refId, item[key], item.isArray));
  }, new Map());
  return result;
};
var resetItems$2 = function resetItems(array, key, name, parent) {
  var result = array.reduce(function (obj, item, currentIndex) {
    var _extends3;
    var refId = name && name + ".items[" + currentIndex + "]" || "[" + currentIndex + "]";
    return _extends({}, obj, (_extends3 = {}, _extends3[item[key]] = _extends({}, item, {
      refId: refId,
      value: ""
    }, parent && {
      parent: parent
    }), _extends3), item.items !== undefined && convertIdToRef$2(item.items, 'name', refId, item[key]));
  }, new Map());
  return result;
};
var prepareWtchingComponents$2 = function prepareWtchingComponents(items, key) {
  var initialValue = new Map();
  Object.keys(items).forEach(function (key) {
    if (items[key].watch) {
      initialValue.set(items[key].name);
    }
    if (items[key].preCondition) {
      var preConditionObj = convertArrayToObject$2(items[key].preCondition, 'value');
      var keys = Object.keys(preConditionObj);
      for (var index = 0; index < keys.length; index++) {
        var internalItem = preConditionObj[keys[index]];
        console.log("dyno ;)", items[key], 'items[key]');
        initialValue.set(internalItem.name, [].concat(initialValue.get(internalItem.name) && initialValue.get(internalItem.name) || [], [_extends({
          refId: items[key].id
        }, internalItem)]));
      }
    }
  });
  return initialValue;
};
var convertArrayToObject$2 = function convertArrayToObject(array, key, value) {
  var initialValue = {};
  if (!Array.isArray(array)) return;
  var givenArray = array.concat();
  return givenArray.reduce(function (obj, item) {
    var _extends5;
    return _extends({}, obj, (_extends5 = {}, _extends5[item[key]] = value && item[value] || value === undefined && item || '', _extends5));
  }, initialValue);
};
var renderCount$2 = 0;
var FormBuilderNext$1 = React__default.forwardRef(function (_ref7, ref) {
  var _data$root, _data$root$items;
  var items = _ref7.items,
    validationResolver = _ref7.validationResolver,
    ControlledComponents = _ref7.ControlledComponents,
    components = _ref7.components,
    managedCallback = _ref7.managedCallback,
    localFunction = _ref7.localFunction,
    _ref7$defaultValues = _ref7.defaultValues,
    defaultValues = _ref7$defaultValues === void 0 ? {} : _ref7$defaultValues,
    _ref7$devMode = _ref7.devMode,
    devMode = _ref7$devMode === void 0 ? false : _ref7$devMode,
    _ref7$dataTransformer = _ref7.dataTransformer,
    dataTransformer$1 = _ref7$dataTransformer === void 0 ? dataTransformer : _ref7$dataTransformer,
    dataStore = _ref7.dataStore;
  if (!devMode) {
    console.log = function () {
      var log = console.log;
      return function () {
        var args = Array.from(arguments);
        if (!args.includes("dyno ;)")) {
          log.apply(console, args);
        }
      };
    }();
  }
  console.log("dyno ;)", defaultValues, "defaultValues");
  var _useForm = useForm$1({
      mode: 'onChange',
      shouldUnregister: true,
      reValidateMode: 'onSubmit',
      defaultValues: defaultValues
    }),
    register = _useForm.register,
    handleSubmit = _useForm.handleSubmit,
    watch = _useForm.watch,
    _useForm$formState = _useForm.formState,
    errors = _useForm$formState.errors,
    control = _useForm.control,
    trigger = _useForm.trigger,
    setFocus = _useForm.setFocus,
    getValues = _useForm.getValues,
    setValue = _useForm.setValue,
    triggerBackground = _useForm.triggerBackground,
    _triggerBackgroundOptimised = _useForm.triggerBackgroundOptimised,
    unregister = _useForm.unregister,
    clearErrors = _useForm.clearErrors,
    reset = _useForm.reset;
  React__default.useEffect(function () {
    reset(_extends({}, defaultValues));
  }, [defaultValues]);
  var sharedItems = {
    register: register,
    handleSubmit: handleSubmit,
    watch: watch,
    errors: errors,
    control: control,
    trigger: trigger,
    setFocus: setFocus,
    getValues: getValues,
    setValue: setValue,
    useFieldArray: useFieldArray,
    useWatch: useWatch,
    triggerBackground: triggerBackground,
    triggerBackgroundOptimised: _triggerBackgroundOptimised,
    unregister: unregister,
    localFunction: _extends({}, localFunction, {
      triggerBackground: function triggerBackground() {
        return !_.isEmpty(errors);
      },
      getValues: getValues,
      triggerBackgroundOptimised: function triggerBackgroundOptimised(formId) {
        var result = _triggerBackgroundOptimised(formId)().then(function (r) {
          return r;
        });
        return result;
      },
      triggerGroup: function (resources) {
        try {
          return Promise.resolve(_triggerBackgroundOptimised()(true)).then(function (localErrors) {
            var result = true;
            for (var i = 0; i < resources.length; i++) {
              var item = resources[i];
              var isItemExist = localErrors[item];
              if (isItemExist) {
                result = false;
                break;
              }
            }
            return result;
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }),
    dataStore: dataStore,
    clearErrors: clearErrors
  };
  var myComponents = React__default.useRef();
  var watchingComponents = React__default.useRef();
  var preConditionItems = React__default.useRef();
  var _useState = useState(),
    data = _useState[0],
    setData = _useState[1];
  React__default.useEffect(function () {
    if (items === undefined) return;
    myComponents.current = items;
    watchingComponents.current = prepareWtchingComponents$2(myComponents.current);
    console.log("dyno ;)", myComponents, 'myComponentsmyComponents');
    console.log("dyno ;)", watchingComponents, 'prepareWtchingComponents', [].concat(watchingComponents.current.keys()));
    var subscription = watch(function (value, _ref8) {
      var name = _ref8.name,
        type = _ref8.type;
      try {
        return Promise.resolve(function () {
          if (watchingComponents.current.get(name)) {
            console.log("dyno ;)", "checkPreCondition ;) checkPreCondition", value, name, type, data, items);
            return Promise.resolve(checkPreCondition(name, value[name], items)).then(function (_ref9) {
              var a = _ref9[0],
                b = _ref9[1];
              if (!deepEqual(data, b) && a) {
                setData(_extends({}, b));
              }
            });
          } else if (watchingComponents.current.has(name)) {
            console.log("dyno ;)", watchingComponents.current.has(name), "before checkPreCondition ;) checkPreCondition", value, name, type, data, items);
            setData(_extends({}, items));
            return;
          }
        }());
      } catch (e) {
        return Promise.reject(e);
      }
    });
    setData(items);
  }, [items]);
  var resetValues = function resetValues() {
    myComponents.current = resetItems$2(items, 'name');
    setData(items);
  };
  var getValuesBackground = function getValuesBackground() {
    try {
      if (Object.keys(errors).length > 0) return Promise.resolve(false);
      return Promise.resolve(_triggerBackgroundOptimised()(true)).then(function (result) {
        console.log("dyno ;)", "SUBMITFORM SUBMITFORM result trigger", result, errors);
        if (_.isEmpty(result)) {
          return Promise.resolve(getValues());
        } else {
          return false;
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var getValuesPOC = function getValuesPOC() {
    try {
      if (Object.keys(errors).length > 0) return Promise.resolve(false);
      return Promise.resolve(trigger()).then(function (result) {
        console.log("dyno ;)", "SUBMITFORM SUBMITFORM result trigger", result, errors);
        if (result === true) {
          return Promise.resolve(getValues());
        } else {
          return false;
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  ref.current = {
    getValues: getValuesPOC,
    getValuesBackground: getValuesBackground,
    resetValues: resetValues,
    setValue: setValue,
    errors: errors,
    reset: reset,
    clearErrors: clearErrors
  };
  var validationOnce = function validationOnce(name, value, result) {
    try {
      var validatedItem = myComponents.current[name];
      var n = result;
      var originalErrors = _extends({}, errors.current) || {};
      var newErrors = errors.current || {};
      var error = false;
      if (value !== '') {
        var _error = value === '313';
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
      errors.current = _extends({}, newErrors);
      console.log("dyno ;)", errors, "errrrrrrrrr", newErrors);
      if (error.current !== originalErrors) {}
      return Promise.resolve([!_.isEqual(originalErrors, newErrors), [].concat(n), newErrors[name]]);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var updateReference = function updateReference(value, name) {
    try {
      myComponents.current[name].value = value;
      var _myComponents$current = myComponents.current;
      return Promise.resolve(getValuesPOC()).then(function (_getValuesPOC) {
        console.log("dyno ;)", _myComponents$current, 'getValues', _getValuesPOC);
        return Promise.resolve(validationOnce(name, value, _extends({}, data))).then(function (_ref10) {
          var hasValidationChanged = _ref10[0],
            result = _ref10[1],
            error = _ref10[2];
          return Promise.resolve(checkPreCondition(name, value, data)).then(function (_ref11) {
            var hasPreconditionChanged = _ref11[0],
              preResult = _ref11[1];
            if (hasValidationChanged === true || hasPreconditionChanged === true) {
              console.log("dyno ;)", 'lololololololololololoolol', hasValidationChanged, hasPreconditionChanged, errors);
              setData(_extends({}, preResult));
            }
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var checkPreCondition = function checkPreCondition(name, value, result) {
    try {
      var _temp2 = function _temp2() {
        return [updated, n];
        return [updated, _extends({}, n)];
      };
      var hasCondition = watchingComponents.current.get(name);
      console.log("dyno ;)", data, "checkPreConditionInside", name, myComponents.current, hasCondition, watchingComponents.current);
      var n = _extends({}, result);
      var updated = false;
      var _temp = function () {
        if (hasCondition !== undefined) {
          return Promise.resolve(hasCondition.map(function (item) {
            try {
              var _temp3 = function _temp3(touched) {
                var i = n[item.refId];
                console.log("dyno ;)", n["accountNo"], "accountNoaccountNo", '-----', i);
                if (i !== undefined && i.visible !== touched) {
                  n[item.refId].visible = touched;
                  updated = true;
                }
              };
              var realValue = value && value["value"] || value;
              var _item$type = item === null || item === void 0 ? void 0 : item.type;
              return Promise.resolve(_item$type ? Promise.resolve(validationResolver[item.type](item, realValue)).then(_temp3) : _temp3(_item$type));
            } catch (e) {
              return Promise.reject(e);
            }
          })).then(function () {});
        }
      }();
      return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  console.log("dyno ;)", 'renderCount', renderCount$2++);
  return data && ((_data$root = data.root) === null || _data$root === void 0 ? void 0 : (_data$root$items = _data$root.items) === null || _data$root$items === void 0 ? void 0 : _data$root$items.map(function (name, index) {
    return renderComponentInd$1(name, data, {
      updateReference: updateReference,
      myComponents: myComponents,
      getValues: getValues,
      errors: errors,
      ControlledComponents: ControlledComponents,
      components: components,
      managedCallback: managedCallback,
      undefined: undefined,
      sharedItems: sharedItems,
      index: index,
      dataTransformer: dataTransformer$1
    });
  })) || null;
});
FormBuilderNext$1.whyDidYouRender = true;
FormBuilderNext$1.displayName = "FormBuilderNext";

export { Controller, FormBuilderV1 as DynoBuilder, FormBuilderNext, FormBuilderNext$1 as FormBuilderV4, FormProvider, appendErrors, get, set, setupProxy, transformer, useController, useFieldArray, useForm, useFormContext, useFormState, useHistory, useWatch };
//# sourceMappingURL=index.modern.js.map
