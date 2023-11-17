import React, { useEffect, useState } from 'react'
import Select, { components } from "react-select";
import Label from "../Label/Label"
import { Error } from "../Error"

import "./Dropdown.css"
const optionsDefault = [
  {
    value: "0",
    label: "2 Months"
  },
  {
    value: "1",
    label: "3 Months"
  },
  {
    value: "2",
    label: "4 Months"
  },
  {
    value: "3",
    label: "5 Months"
  },
  {
    value: "4",
    label: "6 Months"
  },
  {
    value: "5",
    label: "7 Months"
  },
  {
    value: "6",
    label: "8 Months"
  },
  {
    value: "7",
    label: "9 Months"
  },
];

const Dropdown = (props) => {

  const { child, error, name, item, field, managedCallback, sharedItems } = props;
  const errorMsg = error && error[name] && error[name].message || ""
  const { label, options = [], placeholder, description, disabled, theme } = item || { label: "" };
  const { getValues } = sharedItems;
  // const [ existingOptions, setExistingOptions] = useState(getValues(options));

  // useEffect(()=> {
  //   if (item === undefined) return null;
  //   const newOptions = getValues(options);
  //   // setExistingOptions(newOptions);
  //   customOnChange("")

  //   if(props.item?.action){
  //     setTimeout(() => {
  //       managedCallback({item: props.item}).then(result => {
  //         console.log(props, result, 'hereeeeeeeeeeeeeeeeeeeee droppppppp');
  //         // setExistingOptions(result.options)
  //       })       
  //     }, 7000);
  //   }
  // }, [getValues(options)])

  const { value, onChange } = field;

  // existOptions = existOptions === undefined && options;

  const customOnChange = (e) => {
    onChange(e);
  }

  const customStyles = {
    control: (base, state) => ({
      ...base,
      marginTop: 10,
      '&:hover': { borderColor: '#74e3e4' },
      border: '1px solid lightgray',
      boxShadow: 'none',
      borderRadius: 20,
    })
  }

  const Option = (props) => {
    const optionProps = {
      ...props,
      innerProps: {
        ...props.innerProps,
        "id": props.data.value
      }
    };
    return <components.Option {...optionProps} />;
  };
  

  console.log(name,value,"dropdowndropdown", props, getValues("f5Ou1GNVw2y"), getValues())

  return (
    <>
    {getValues("wathchMei")}
      <Label {...props} />
      <Select
        name={name}
        key={name}
        id={name}
        instanceId={name}
        inputId={name}

        placeholder={placeholder}
        // defaultValue={value}
        styles={customStyles}
        options={options}
        {...field}
        onChange={customOnChange}
        components={{ Option }}
        isDisabled={disabled}
      />
      <Error {...props} />
    </>
  );
};

export default Dropdown;
