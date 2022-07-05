import * as React from 'react';
import { createFormControl } from './logic/createFormControl';
import { createFormControlV4 } from './logic/createFormControlV4';
import getProxyFormState from './logic/getProxyFormState';
import shouldRenderFormState from './logic/shouldRenderFormState';
import get from './utils/get';
import live from './utils/live';
import set from './utils/set';
export function useForm(props = {}) {
    const _formControl = React.useRef();
    const [formState, updateFormState] = React.useState({
        isDirty: false,
        isValidating: false,
        dirtyFields: {},
        isSubmitted: false,
        submitCount: 0,
        touchedFields: {},
        isSubmitting: false,
        isSubmitSuccessful: false,
        isValid: false,
        errors: {},
    });
    if (_formControl.current) {
        _formControl.current.control._updateProps(props);
    }
    else {
        _formControl.current = Object.assign(Object.assign({}, createFormControlV4(props)), { formState });
    }
    const control = _formControl.current.control;
    React.useEffect(() => {
        const formStateSubscription = control._subjects.state.subscribe({
            next(formState) {
                // console.log("##1", formState,control._proxyFormState)
                if (shouldRenderFormState(formState, control._proxyFormState, true)) {
                    control._formState.val = Object.assign(Object.assign({}, control._formState.val), formState);
                    updateFormState(Object.assign({}, control._formState.val));
                }
            },
        });
        const useFieldArraySubscription = control._subjects.array.subscribe({
            next(state) {
                if (state.values && state.name && control._proxyFormState.isValid) {
                    set(control._formValues, state.name, state.values);
                    control._updateValid();
                }
            },
        });
        return () => {
            formStateSubscription.unsubscribe();
            useFieldArraySubscription.unsubscribe();
        };
    }, [control]);
    React.useEffect(() => {
        const unregisterFieldNames = [];
        if (!control._isMounted) {
            control._isMounted = true;
            control._proxyFormState.isValid && control._updateValid();
            !props.shouldUnregister &&
                control._updateFormValues(control._defaultValues);
        }
        for (const name of control._names.unMount) {
            const field = get(control._fields, name);
            field &&
                (field._f.refs ? field._f.refs.every(live) : live(field._f.ref)) &&
                unregisterFieldNames.push(name);
        }
        console.log(unregisterFieldNames,'unregisterFieldNames',control._names,control)
        unregisterFieldNames.length &&
            _formControl.current.unregister(unregisterFieldNames);
        control._names.unMount = new Set();
    });
    _formControl.current.formState = getProxyFormState(formState, control._proxyFormState);
    return _formControl.current;
}