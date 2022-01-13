import React from 'react'
import "./style.css";

const Error = (props) => {
    const { name, item, error } = props;
    const errorMsg = error && error[name] && error[name].message || ""

    if (item === undefined) return null;

    const { description } = item;
    return (
        <>
            {description && <i className='description'>{description}</i>}
            <b className='error'>{errorMsg}</b>
        </>
    );
};

export default Error;
