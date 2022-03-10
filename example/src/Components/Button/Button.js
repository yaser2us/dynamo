import React from 'react'

import './Button.css';
import '../../index.css';
const Button = (props) => {
  const { item, error, managedCallback } = props;
  const { label, action } = item || { label: "Submit" };
  const disabled = error && Object.keys(error).length > 0 || false;

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
        onClick={onClick}
        className="button"

        disabled={disabled}
      >{label}</button>
    </div>
  );
};

export default Button;
