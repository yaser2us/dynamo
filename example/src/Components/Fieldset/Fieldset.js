import React from 'react'
import "./Fieldset.css";

const Fieldset = (props) => {
  const { child, name } = props;
  return (
    <fieldset className="field">
      <React.Fragment key={name}>
        {child && child}
      </React.Fragment>
    </fieldset>
  )

};

export default Fieldset;
