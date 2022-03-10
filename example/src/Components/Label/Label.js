import React from 'react'
import './Label.css';
const Label = (props) => {
    console.log(props.item,'label')
    const { item } = props;
    const { label, templateName = 'label' } = item || {label: "Empty Label"};
    return <label className={templateName} >{label}</label>
}

export default Label;