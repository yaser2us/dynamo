import React from 'react'
import "./style.css";

const Error = (props) => {
    const { name, item, error, index, parent } = props;
    let errorMsg = error && error[name] && error[name].message || ""

    if(error && parent){
        const errorItem = error[parent.id];
        console.log(error, 'bllllllllll', index, props, parent.id, errorItem)

        if(Array.isArray(errorItem) && errorItem.length > 0){
            errorMsg = errorItem[index] && errorItem[index][item.name]?.message || "";
            console.log(error, 'bllllllllllwwww', errorMsg, item.name)
        }

    }



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
