import React, { useEffect, useState } from "react";

const AsyncBlock = (props) => {
  const { child, error, name, item, field, managedCallback } = props;
  console.log(props, "Asyncblocks");
  const errorMsg = (error && error[name] && error[name].message) || "";
  const { label, options, placeholder, description } = item || { label: "" };

  const [existingOptions, setExistingOptions] = useState(options);

  useEffect(() => {
    if (item === undefined) return null;

    if (props.item?.action) {
      setTimeout(() => {
        managedCallback({item: props.item, actionType: "merge"}).then((result) => {
          console.log(result, "hereeeeeeeeeeeeeeeeeeeee merge 999999");
        //   managedCallback({item: result, actionType: "update"}).then((result) => {
        //     console.log(result, "hereeeeeeeeeeeeeeeeeeeee update 999999");
        //   });
          //   setExistingOptions(result.options)
        });
      }, 1000);
    }
  }, []);

  return <>{child && child}</>;
};

export default AsyncBlock;
