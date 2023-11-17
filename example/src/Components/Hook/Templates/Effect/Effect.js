import _ from "lodash";
import React from "react";
import { useEffect, useState } from "react";

const Effect = (props) => {
    const { child, item, field, managedCallback } = props;
    console.log(props, "dynamo => hook => Effect");

    const { name, extra = {}, value } = item;
    // const { value, onChange } = field;
    const [isLoaded, updateLoading] = useState(false);

    useEffect(() => {
        if (item === undefined) return null;
        console.log("dynamo => init => hook => Effect => result");

        // if (isLoaded) return;
        if (item?.action) {
            managedCallback({ item }).then((result) => {
                console.log(result, "dynamo => hook => Effect => result");
                updateLoading(true);
            });
        }
    }, []); //[value]

   

    return null;
    // if (isLoading) return <NoDataView title="Retriving data. Please Wait!" />;
    // return <React.Fragment key={name}>{child && child}</React.Fragment>;
};

export default Effect;
