import React from 'react'

import './Button.css';
import '../../index.css';
const Button = (props) => {
  const { item, error, managedCallback } = props;
  const { label, action } = item || { label: "Submit" };
  const disabled = error && Object.keys(error).length > 0 || false;

  const onClick = () => {
    managedCallback(action?.actionURL);
  }

  return (
    <div>
      <button
        onClick={onClick}
        className="button"

        disabled={disabled}
      >{label}</button>
    </div>
  );
};

export default Button;
