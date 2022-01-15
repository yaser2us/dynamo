import React from 'react'
import "./Text.css";
import Label from "../Label/Label"
import { Error } from "../Error"
import Tooltips from "../Tooltips/Tooltips";

const Text = (props) => {
  //Access to main props
  //Injected at runtime
  const { name, item, field } = props;

  //Always check to not render with error ;)
  if (item === undefined) return null;

  //Access to all props that introduced in element.
  const { placeholder } = item;
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
