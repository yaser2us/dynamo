import * as React from 'react';
import omit from './utils/omit';
const FormContext = React.createContext(null);
FormContext.displayName = 'RHFContext';
export const useFormContext = () => React.useContext(FormContext);
export const FormProvider = (props) => (React.createElement(FormContext.Provider, { value: omit(props, 'children') }, props.children));
