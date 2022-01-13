import React from 'react'
import InfoIcon from '@mui/icons-material/Info';
import "./Tooltips.css";

const Tooltips = (props) => {
  const { name, item, error, field } = props;
  const errorMsg = error && error[name] && error[name].message || ""

  if (item === undefined) return null;

  const { description } = item;

  if (description === undefined) return props.children;

  return (
    <div className="tooltip">
      <InfoIcon />
      {props.children}
      <span className="tooltiptext">{description}</span>
    </div>
  );
};

export default Tooltips;
