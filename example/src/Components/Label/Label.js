import React from 'react'
import './Label.css';
const Label = (props) => {
    console.log(props.item,'label')
    const { item } = props;
    const { label } = item || {label: "Empty Label"};
    return <label className="label" >{label}</label>
}

export default Label;