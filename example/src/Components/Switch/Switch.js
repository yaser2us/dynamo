import React from 'react'
import { Error } from "../Error"

import "./Switch.css";

const Switch = (props) => {
  const { name, item, error, field } = props;
  const errorMsg = error && error[name] && error[name].message || ""

  if (item === undefined) return null;

  const { placeholder, label, description } = item;
  const { value } = field;

  return (
    <div className="flex">
      <h1 className="h1">{label}</h1>
      <label className="switch">
        <input 
          type="checkbox"
          {...field}
        />
        <span className="slider round"></span>
      </label>
      <Error {...props} />
    </div>
  );
};

export default Switch;
