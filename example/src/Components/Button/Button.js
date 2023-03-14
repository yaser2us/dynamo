import React, { useCallback } from 'react'

import './Button.css';
import '../../index.css';
import { useState } from 'react';
import { useEffect } from 'react';
const Button = (props) => {
  const { item, error, managedCallback, name, sharedItems } = props;
  const { label, action, disabled = false } = item || { label: "Submit" };
  // const disabled = false;// error && Object.keys(error).length > 0 || false;

  const [cd, setCd] = useState(disabled)

  console.log(disabled, 'buttooonnnnnndisabled',
    error,
    // sharedItems?.localFunction?.triggerBackground()
  )

  useEffect(() => {
    if(disabled.then){
      disabled.then(response => setCd(response));
    } else {
      setCd(disabled)
    }
  }, [disabled]);

  const onClick = () => {
    managedCallback({ item: undefined, actionType: action?.actionURL });
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

        disabled={cd}
      >{label}</button>
    </div>
  );
};

export default Button;
