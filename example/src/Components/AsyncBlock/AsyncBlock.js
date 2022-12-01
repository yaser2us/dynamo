import React, { useEffect, useState } from "react";

const AsyncBlock = (props) => {
  const { child, error, name, item, field,
    sharedItems, managedCallback } = props;
  console.log(props, "Asyncblocks");
  const errorMsg = (error && error[name] && error[name].message) || "";
  const { label, options, placeholder, description } = item || { label: "" };

  const { getValues } = sharedItems;


  const [existingOptions, setExistingOptions] = useState(options);

  const { value, onChange } = field;

  // existOptions = existOptions === undefined && options;

  const customOnChange = (e) => {
    onChange([{
      value: e,
      label: e
    }]);
  }

  useEffect(() => {
    if (item === undefined) return null;
    console.log("helllllllllllom ;)", getValues(label))
    const result = getValues(label);
    // if(result === "3"){
      customOnChange(result);
    // }

    if (props.item?.action) {
      setTimeout(() => {
        managedCallback({ item: props.item, actionType: "merge" }).then((result) => {
          console.log(result, "hereeeeeeeeeeeeeeeeeeeee merge 999999");
          //   managedCallback({item: result, actionType: "update"}).then((result) => {
          //     console.log(result, "hereeeeeeeeeeeeeeeeeeeee update 999999");
          //   });
          //   setExistingOptions(result.options)
        });
      }, 1000);
    }
  // }, [getValues(label)]);
  }, [getValues(label)]);

  return <>{child && child}</>;
};

export default AsyncBlock;
