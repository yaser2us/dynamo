import * as React from 'react';
import getProxyFormState from './logic/getProxyFormState';
import shouldRenderFormState from './logic/shouldRenderFormState';
import convertToArrayPayload from './utils/convertToArrayPayload';
import { useFormContext } from './useFormContext';
function useFormState(props) {
    const methods = useFormContext();
    const { control = methods.control, disabled, visible, name } = props || {};
    const nameRef = React.useRef(name);
    const [formState, updateFormState] = React.useState(control._formState.val);
    const _localProxyFormState = React.useRef({
        isDirty: false,
        dirtyFields: false,
        touchedFields: false,
        isValidating: false,
        isValid: false,
        errors: false,
    });
    nameRef.current = name;
    React.useEffect(() => {
        const formStateSubscription = control._subjects.state.subscribe({
            next: (formState) => (!nameRef.current ||
                !formState.name ||
                convertToArrayPayload(nameRef.current).includes(formState.name)) &&
                shouldRenderFormState(formState, _localProxyFormState.current) &&
                updateFormState(Object.assign(Object.assign({}, control._formState.val), formState)),
        });
        disabled && formStateSubscription.unsubscribe();
        //Yasser ;)
        // !visible && formStateSubscription.unsubscribe();
        return () => formStateSubscription.unsubscribe();
    }, [disabled, control]);
    return getProxyFormState(formState, control._proxyFormState, _localProxyFormState.current, false);
}
export { useFormState };
