import React from 'react'
import "./Text.css";
import Label from "../Label/Label"
import { Error } from "../Error"
import Tooltips from "../Tooltips/Tooltips";

const Text = (props) => {
  const { name, item, error, field } = props;
  const errorMsg = error && error[name] && error[name].message || ""

  if (item === undefined) return null;

  const { value, placeholder, description } = item;
  return (
    <>
      <Tooltips {...props}>
        <Label {...props} />
      </Tooltips>
      <input
        type="text"
        id={name}
        name={name}
        placeholder={placeholder}
        className="text"
        {...field}
      />
      <Error {...props} />
    </>
  );
};

export default Text;
