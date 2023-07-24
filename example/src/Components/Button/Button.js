import React, { useCallback } from 'react'

import './Button.css';
import '../../index.css';
import { useState } from 'react';
import { useEffect } from 'react';
const Button = (props) => {
  const { item, error, managedCallback, name, sharedItems } = props;
  const { label, action, disabled = false } = item || { label: "Submit" };

  const [cd, setCd] = useState(disabled)

  useEffect(() => {
    if(disabled.then){
      disabled.then(response => setCd(response));
    } else {
      setCd(disabled)
    }
  }, [disabled]);

  const onClick = (e) => {
    e.preventDefault();
    console.log(e, 'eeeeeeeee')
    managedCallback({ item: item, actionType: action?.actionURL });
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
