import React from 'react'

import './Button.css';
import '../../index.css';
const Button = (props) => {
  const { item, error, managedCallback, name, sharedItems } = props;
  const { label, action, disabled = false } = item || { label: "Submit" };
  // const disabled = false;// error && Object.keys(error).length > 0 || false;

  console.log(disabled, 'buttooonnnnnndisabled', error, sharedItems?.localFunction?.triggerBackground())
  const onClick = () => {
    managedCallback({item: undefined, actionType: action?.actionURL});
  }

  return (
    <div style={{
      float: 'left',
      marginRight: '5px',
      width: '100%',
      textAlign: 'right',
      marginTop: '13px'
    }}>
      <button
      id={name}
        onClick={onClick}
        className="button"

        disabled={disabled}
      >{label}</button>
    </div>
  );
};

export default Button;
