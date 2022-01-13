import React, { useRef, useState } from 'react'

import { DynoBuilder } from 'dynamo'
import 'dynamo/dist/index.css'

import "./App.css";

import Button from "./Components/Button/Button";
import Label from "./Components/Label/Label";
// import Sidebar from "./Components/Sidebar/Sidebar";
import Text from "./Components/Textbox/Text";
import Checkbox from "./Components/Checkbox/Checkbox";
import Switch from "./Components/Switch/Switch";
import Radio from "./Components/RadioButton/Radio";
import DatePick from "./Components/Date/DatePick";
import Dropdown from "./Components/Select/Dropdown";
import Progress from "./Components/ProgressBar/Progress";
import Tooltips from "./Components/Tooltips/Tooltips";

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
      "placeholder": "saving",
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
      "description": "The min amount is always 0.01 MYR",
      "visible": true,
      "rule": {
        "required": "amount is required.",
        "min": { value: 0.01, message: "min payment amount is 0.01 MYR" }
      },
    },
    {
      "type": "text",
      "name": "ref1",
      "label": "Refrence 1",
      "value": "",
      "placeholder": "8888",
      "visible": true
    },
    {
      "type": "switch",
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
