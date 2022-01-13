import React from 'react'
import { Error } from "../Error"

import "./Checkbox.css";
const Checkbox = (props) => {
  const { item, field } = props;
  const { label } = item || { label: "" };
  return (
    <>
      <label className="container">
        {label}
        <input
          type="checkbox"
          {...field}
        />
        <span className="checkmark"></span>
      </label>
      <Error {...props} />
    </>
  );
};

export default Checkbox;
