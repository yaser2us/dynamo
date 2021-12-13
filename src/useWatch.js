import * as React from 'react';
import convertToArrayPayload from './utils/convertToArrayPayload';
import isUndefined from './utils/isUndefined';
import { useFormContext } from './useFormContext';
export function useWatch(props) {
    const methods = useFormContext();
    const { control = methods.control, name, defaultValue, disabled, } = props || {};
    const _name = React.useRef(name);
    _name.current = name;
    const [value, updateValue] = React.useState(isUndefined(defaultValue)
        ? control._getWatch(name)
        : defaultValue);
    React.useEffect(() => {
        const watchSubscription = control._subjects.watch.subscribe({
            next: ({ name }) => {
                console.log("##1 watchSubscription", name)
                return(!_name.current ||
                !name ||
                convertToArrayPayload(_name.current).some((fieldName) => name &&
                    fieldName &&
                    (fieldName.startsWith(name) ||
                        name.startsWith(fieldName)))) &&
                updateValue(control._getWatch(_name.current, defaultValue))},
        });
        disabled && watchSubscription.unsubscribe();
        return () => watchSubscription.unsubscribe();
    }, [disabled, control, defaultValue]);
    return value;
}