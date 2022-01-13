# dynamo

> the joy of development :star_struck:	

To experience smoother frontend development, *dynamo* was created to build flexible dynamic 

[![NPM](https://img.shields.io/npm/v/dynamo.svg)](https://www.npmjs.com/package/dynamo) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Goal

*dynamo*, less-code development with high flexibility


## Install
First step is to install *dynamo* into your project. 
As long as this library still is **private**, you need to run full path installation such as below:

```bash
npm install --save https://github.com/yaser2us/dynamo
```

**Note**: Soon it will be accessable from Maybank Github repository :wink:	

## Data Structure 
dynamo is all about data structure. 

The data structure generates any kind of data entry form (Payment/Transfer/Login) or display form such as listing (Transaction History/Accounts page).
We have freedom to design our data object to render as form or page. It is an array of elements. Each element represents a component in screen by **type**. 

*Example:* text as textbox, checkbox, button or custom name such as note, confirmationButtons or charts.

**Note**: we can define any name as type. There is no limitation to introduce types.

```json
[
    {
      "type": "select",
      "name": "paymentType",
      "label": "Payment Type",
      "value": "",
      "visible": true,
      "placeholder": "saving",
      "description": "IBFT sameday, GIRO tomorrow",
      "rule": { 
          "required": "please select payment type." 
      },
      "options": [
        {
          "label": "IBFT",
          "value": "IBFT"
        },
        {
          "label": "GIRO",
          "value": "GIRO"
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
        "min": { "value": 0.01, "message": "min payment amount is 0.01 MYR" }
      },
    },
...
```

## Components & Types
Once the data structure ready (the array of elements we discuss above), we need to bind our existing components into a dictionary of types. 

*dynamo* uses dictionary to find and use each component for rendering.

```jsx
 const componentsDictionary = {
    text: (props) => <Text {...props} />,
    checkbox: (props => <Checkbox {...props} />),
    switch: (props => <Switch {...props} />),
    select: (props => <Dropdown {...props} />),
    date: (props => <DatePick {...props} />),
    button: (props) => <Button {...props} />
  };
```

**Note:** extra props will be added to your component runtime by *dynamo*.

**Suggestion**: we suggest to bind component without any container. later we have section to inject container for all components and types.

*More details can be found at How to make existing component ready for dynamo.*


## Rendering Callback
*dynamo* gives us freedom to manage element rendering. For example, like below, we can introduce function to customize rendering. 

From legacy version of *dynamo*, we had to pass dictionary, however we can pass rendering function to have more customization such as injecting **Container**.

```jsx
const renderComponent = (type, propsItems) => {

    // find the respective type from dictionary
    const selectedComponent = componentsDictionary && componentsDictionary[type];
    
    // to ensure it is not undefined
    // prevent rendering error
    if (selectedComponent === undefined) return null;
    
    // return component with container together
    return renderContainer(selectedComponent({ ...propsItems }))
};
```

Here, we create extra function to render container, just to have cleaner code ;)

```jsx
const renderContainer = children =>
    <div className="inputContainer">
      {children}
    </div>
```

***wow! we are almost there*** :wink:	

## Managed Callbacks
*dynamo* can call any callback functions inside the element for seperating logic from presentation container, clean code and best practice. 

Other form generators, they generate elements only, submit button is needed to be implemented seperatly as static code.

In *dynamo*, also you can apply same approach, however, button can be part of element array. Therefore we need to pass callback function such as below example.

```jsx
 const managedCallback = async () => {
    //Get dynamo (form) values
    const formData = await myForm.current.getValues();

    //false means error is there
    //otherwise the data object returns
    if (!formData) return null;

    //just sample store data in component
    setData(formData);

    console.log('this is result from dynamo ;)', formData);
    return true;
  };
```

## Done
We are done. now just run the project. We suggest to try below example to kickstart dynamo inside your project. Then try to change the dictionary and components one by one to have safe journey.

## APIs

|| type | Required | Description | Documentation Status |
| ------------- | ------------- |-----------| ------------- | ------------- |
|ref|refrence|✓|bind reference to dynamo to call internal commands such as get values|✓|
|items|array|✓	|array of object|✓	|
|components|Function|✓	|rendering element finction|✓	|
|managedCallback|Async Function|✓	|access to private function from inside common component||


## Quickstart 
50% of requirements can be implemented by this example.

```jsx
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
      "placeholder": "saving",
      "description": "IBFT sameday, GIRO tomorrow",
      "rule": { "required": "please select payment type." },
      "options": [
        {
          "label": "IBFT",
          "value": "IBFT"
        },
        {
          "label": "GIRO",
          "value": "GIRO"
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
        "min": { "value": 0.01, "message": "min payment amount is 0.01 MYR" }
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
```

## Contributors

Thanks goes to all wonderful people, M2U, SME and enginerring team.

## License

MIT © [yaser2us](https://github.com/yaser2us)
