import * as React from 'react';
import getControllerValue from './logic/getControllerValue';
import isNameInFieldArray from './logic/isNameInFieldArray';
import get from './utils/get';
import { EVENTS } from './constants';
import { useFormContext } from './useFormContext';
import { useFormState } from './useFormState';
export function useController(props) {
    const methods = useFormContext();
    const { name, control = methods.control, shouldUnregister, item } = props;
    console.log(item, "useController");
    const [value, setInputStateValue] = React.useState(get(control._formValues, name, get(control._defaultValues, name, props.defaultValue)));
    const formState = useFormState({
        control: control || methods.control,
        name,
    });
    // WTACHME: disable bug ;)
    // TODO: move item from ref into item object seperately 
    // to prevent disable reaction about validation and submission
    const registerProps = control.register(name, Object.assign(Object.assign({}, {...props.rules, item: {...item} }), { value }));
    // console.log(registerProps,"useController")

    const updateMounted = React.useCallback((name, value) => {
        const field = get(control._fields, name);
        if (field) {
            field._f.mount = value;
        }
    }, [control]);
    React.useEffect(() => {
        const controllerSubscription = control._subjects.control.subscribe({
            next: (data) => (!data.name || name === data.name) &&
                setInputStateValue(get(data.values, name)),
        });
        updateMounted(name, true);
        return () => {
            controllerSubscription.unsubscribe();
            const _shouldUnregisterField = control._shouldUnregister || shouldUnregister;
            if (isNameInFieldArray(control._names.array, name)
                ? _shouldUnregisterField && !control._isInAction.val
                : _shouldUnregisterField) {
                control.unregister(name);
            }
            else {
                updateMounted(name, false);
            }
        };
    }, [name, control, shouldUnregister, updateMounted]);
    return {
        field: {
            onChange: (event) => {
                const value = getControllerValue(event);
                setInputStateValue(value);
                registerProps.onChange({
                    target: {
                        value,
                        name: name,
                    },
                    type: EVENTS.CHANGE,
                });
            },
            onBlur: () => {
                registerProps.onBlur({
                    target: {
                        name: name,
                    },
                    type: EVENTS.BLUR,
                });
            },
            name,
            value,
            ref: (elm) => elm &&
                registerProps.ref({
                    //todo item ;)
                    // ...(props.item && props.item || {}),
                    focus: () => elm.focus && elm.focus(),
                    setCustomValidity: (message) => elm.setCustomValidity(message),
                    reportValidity: () => elm.reportValidity(),
                }),
        },
        formState,
        fieldState: {
            invalid: !!get(formState.errors, name),
            isDirty: !!get(formState.dirtyFields, name),
            isTouched: !!get(formState.touchedFields, name),
            error: get(formState.errors, name),
        },
    };
}