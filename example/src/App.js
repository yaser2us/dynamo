import React, { useRef, useState } from 'react'

import { DynoBuilder } from 'dynamo'
import 'dynamo/dist/index.css'

import "./App.css";

import Button from "./Components/Button/Button";
import Text from "./Components/Textbox/Text";
import Checkbox from "./Components/Checkbox/Checkbox";
import Switch from "./Components/Switch/Switch";
import DatePick from "./Components/Date/DatePick";
import Dropdown from "./Components/Select/Dropdown";

function App() {

  //form data store
  const [data, setData] = useState()

  //Access to form
  const myForm = useRef({});
  //Form elements
  const [items, setItems] = useState([
    {
      "type": "select",
      "name": "paymentType",
      "label": "Payment Type",
      "value": "",
      "visible": true,
      "placeholder": "Select Payment Type",
      "description": "IBFT sameday, GIRO tomorrow",
      "rule": { "required": "please select payment type." },
      "options": [
        {
          label: "IBFT",
          value: "IBFT"
        },
        {
          label: "GIRO",
          value: "GIRO"
        }
      ]
    },
    {
      "type": "text",
      "name": "amount",
      "label": "Amount MYR",
      "value": "",
      "placeholder": "0.0 RM",
      "visible": true,
      "description": "Min is 1.0 MYR",
      "rule": {
        "required": "amount is required.",
        "min": { 
          "value": 1.00, 
          "message": "min payment amount is 1.00 MYR" }
      },
    },
    {
      "type": "text",
      "name": "ref1",
      "label": "Refrence 1",
      "value": "",
      "placeholder": "8888",
      "visible": true,
      "rule": {
        "required": "Reference is required.",
      }
    },
    {
      "type": "text",
      "name": "ref2",
      "label": "Refrence 2",
      "value": "",
      "placeholder": "phone number",
      "visible": true,
      "rule": {
        "required": "Reference is required.",
      }
    },
    {
      "type": "checkbox",
      "name": "recurring",
      "label": "Recurring",
      "value": "",
      "visible": true
    },
    {
      "type": "date",
      "name": "recurringDate",
      "label": "Recurring Date",
      "value": "",
      "visible": false,
      "preCondition": [{
        "name": "recurring",
        "value": "true",
        "type": 'eq',
      }]
    },
    {
      "type": "button",
      "name": "submit",
      "label": "Pay Now",
      "value": "",
      "visible": true
    }
  ]
  );

  const newComponents = {
    text: (props) => <Text {...props} />,
    checkbox: (props => <Checkbox {...props} />),
    switch: (props => <Switch {...props} />),
    select: (props => <Dropdown {...props} />),
    date: (props => <DatePick {...props} />),
    button: (props) => <Button {...props} />
  };

  const renderContainer = children =>
    <div className="inputContainer">
      {children}
    </div>

  const renderComponent = (type, propsItems) => {
    const selectedComponent = newComponents && newComponents[type];
    if (selectedComponent === undefined) return null;

    return renderContainer(selectedComponent({ ...propsItems }))
    // return selectedComponent({ ...propsItems })
  };

  const managedCallback = async () => {
    //Get dynamo form values
    const formData = await myForm.current.getValues();

    //false means error is there
    //otherwise the data object returns
    if (!formData) return null;

    //just sample store data in component
    setData(formData);

    console.log('this is result from dynamo ;)', formData);
    return true;
  };

  return (
    <>
      <fieldset
        className="field"
        style={{ padding: "2rem", marginTop: "2rem" }}>
        <DynoBuilder
          ref={myForm}
          items={items}
          components={renderComponent}
          managedCallback={managedCallback}
        />
      </fieldset>
      <fieldset
        className="field"
        style={{ padding: "2rem", marginTop: "2rem" }}>
        <b>Result ;)</b>
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      </fieldset>
    </>
  );
}

export default App;


{/* <Switch />
      <div className="inputContainer">
        <Text />
      </div>
      <Checkbox />
      <Radio />
      <Button />
      <DatePick />
      <Dropdown /> */}

      // <Progress />
