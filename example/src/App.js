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
import Fieldset from './Components/Fieldset/Fieldset';

const sample = {
  "root": {
    "name": "root",
    "items": [
      "dhRpEEKSr",
      "n#GT9ElP8"
    ],
    "visible": true
  },
  "dhRpEEKSr": {
    "id": "dhRpEEKSr",
    "type": "text",
    "name": "yasser",
    "label": "Yasser",
    "value": "",
    "visible": true,
    "parent": [
      "root",
      "0"
    ],
    "defaultValue": "",
    "placeholder": ""
  },
  "n#GT9ElP8": {
    "id": "n#GT9ElP8",
    "type": "text",
    "name": "ay5tbGMMPZ",
    "label": "Label",
    "value": "Value",
    "visible": false,
    "parent": [
      "root",
      "1"
    ],
    "preCondition": [
      {
        "name": "yasser",
        "value": "110",
        "type": "eq"
      }
    ]
  }
}

const sample110 = {
  "root": {
    "name": "root",
    "items": [
      "YReB8ij6Oko",
      "3GBtSH7SQlX"
    ],
    "visible": true
  },
  "YReB8ij6Oko": {
    "id": "OdGuig00o",
    "type": "text",
    "name": "YReB8ij6Oko",
    "label": "Textbox",
    "value": "",
    "visible": true
  },
  "3GBtSH7SQlX": {
    "id": "Q5lzi3Lgt",
    "type": "fieldset",
    "name": "3GBtSH7SQlX",
    "label": "Fieldset",
    "value": "",
    "visible": true,
    "items": [
      "f5Ou1GNVw2y",
      "D#lXsGb#ZVg",
      "9gChBnUqnGU",
      "aQSAHwaMWoc"
    ]
  },
  "aQSAHwaMWoc": {
    "id": "zawF9HrqM",
    "type": "button",
    "name": "aQSAHwaMWoc",
    "label": "Button",
    "value": "",
    "visible": true
  },
  "9gChBnUqnGU": {
    "id": "XVaBKVraB",
    "type": "select",
    "name": "9gChBnUqnGU",
    "label": "dropdown",
    "value": "",
    "visible": true
  },
  "D#lXsGb#ZVg": {
    "id": "t1Bv4mTZN",
    "type": "label",
    "name": "D#lXsGb#ZVg",
    "label": "Label",
    "value": "Value",
    "visible": true
  },
  "f5Ou1GNVw2y": {
    "id": "LnYRFHRB3",
    "type": "text",
    "name": "f5Ou1GNVw2y",
    "label": "Textbox",
    "value": "",
    "visible": true
  }
}

const realObject = {
  //recursive naming -
  "defaultValue": {
    "paymentType-value": "2345678",
    "paymentType-options": [
      {
        "label": "IBFT",
        "value": "IBFT"
      },
      {
        "label": "GIRO",
        "value": "GIRO"
      }
    ],
    "paymentType": "value",
    "ref1": "fdfdfdfs"
  },
  "root": {
    "name": "root",
    "parent": "root",
    "type": "Box",
    "items": [
      "accountContainer",
      "paymentContainer"
    ],
    "props": {},
    "visible": true
  },
  "accountContainer": {
    "name": "accountContainer",
    "parent": "root",
    "type": "fieldset",
    "items": [
      "paymentType",
      "amount"
    ],
    "props": {},
    "visible": true
  },
  "paymentContainer": {
    "name": "paymentContainer",
    "parent": "root",
    "type": "fieldset",
    "items": [
      "ref1",
      "ref2",
      "recurring",
      "recurringDate",
      "submit"
    ],
    "props": {},
    "visible": true
  },
  "paymentType": {
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
  "amount": {
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
        "message": "min payment amount is 1.00 MYR"
      }
    },
  },
  "ref1": {
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
  "ref2": {
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
  "recurring": {
    "type": "checkbox",
    "name": "recurring",
    "label": "Recurring",
    "value": "",
    "visible": true
  },
  "recurringDate": {
    "type": "date",
    "name": "recurringDate",
    "label": "Recurring Date",
    "value": "",
    "visible": false,
    "preCondition": [{
      "name": "recurring",
      "value": "true",
      "type": 'WHYEQ',
    }]
  },
  "submit": {
    "type": "button",
    "name": "submit",
    "label": "Pay Now",
    "value": "",
    "visible": true
  }
}

const objItems = {
  "root": {
    "name": "root",
    "parent": "root",
    "type": "Box",
    "items": [
      "comp-KZFKR95SVGQ8Y",
      "comp-KZFKR95SVGQ822222",
      "comp-KZFKR6JV50XQC"
    ],
    "props": {},
    "visible": true
  },
  "comp-KZFKR6JV50XQC": {
    "name": "comp-KZFKR6JV50XQC",
    "props": {},
    "items": [
      "comp-KZFKR95SVGQ8Z",
      "comp-KZFKRB8B3ID4A",
      "comp-KZFKRDRONJFTS",
      "comp-KZFKRMHTUF840"
    ],
    "type": "fieldset",
    "parent": "root",
    "rootParentType": "Flex",
    "visible": false,
    "preCondition": [{
      "name": "comp-KZFKR95SVGQ8Y",
      "value": "true",
      "type": 'WHYEQ',
    }]
  },
  "comp-KZFKR95SVGQ8Y": {
    "name": "comp-KZFKR95SVGQ8Y",
    "props": {
      "children": "Button text",
      "variant": "solid",
      "size": "md"
    },
    "type": "text",
    "parent": "root",
    "rootParentType": "Button",
    "visible": true
  },
  "comp-KZFKR95SVGQ822222": {
    "name": "comp-KZFKR95SVGQ822222",
    "props": {
      "children": "Button text",
      "variant": "solid",
      "size": "md"
    },
    "items": [],
    "type": "text",
    "parent": "root",
    "rootParentType": "Button",
    "visible": true
  },
  "comp-KZFKR95SVGQ8Z": {
    "name": "comp-KZFKR95SVGQ8Z",
    "props": {
      "children": "Button text",
      "variant": "solid",
      "size": "md"
    },
    "items": [],
    "type": "text",
    "parent": "comp-KZFKR6JV50XQC",
    "rootParentType": "Button",
    "visible": true
  },
  "comp-KZFKRB8B3ID4A": {
    "name": "comp-KZFKRB8B3ID4A",
    "props": {
      "children": "Button text",
      "variant": "solid",
      "size": "md"
    },
    "items": [],
    "type": "text",
    "parent": "comp-KZFKR6JV50XQC",
    "rootParentType": "Button",
    "visible": false,
    "preCondition": [{
      "name": "comp-KZFKR95SVGQ822222",
      "value": "true",
      "type": 'WHYEQ',
    }]
  },
  "comp-KZFKRDRONJFTS": {
    "name": "comp-KZFKRDRONJFTS",
    "props": {
      "children": "Button text",
      "variant": "solid",
      "size": "md"
    },
    "items": [],
    "type": "text",
    "parent": "comp-KZFKR6JV50XQC",
    "rootParentType": "Button",
    "visible": true
  },
  "comp-KZFKRMHTUF840": {
    "name": "comp-KZFKRMHTUF840",
    "props": {
      "children": "Button text",
      "variant": "solid",
      "size": "md"
    },
    "items": [],
    "type": "button",
    "parent": "comp-KZFKR6JV50XQC",
    "rootParentType": "Button",
    "visible": true
  }
}

const arrayItems = [
  {
    "name": "CjRF1MGcc",
    "type": "text",
    "name": "3bAHnqz39LK",
    "label": "Textbox",
    "value": "",
    "visible": true
  },
  {
    "name": "cv5sDWDU9",
    "type": "select",
    "name": "tfYfn#B#91L",
    "label": "dropdown",
    "value": "",
    "visible": true
  },
  {
    "name": "Ky1Vc__pX",
    "type": "checkbox",
    "name": "OmAJyFQBIX0",
    "label": "checkbox",
    "value": "",
    "visible": true
  },
  {
    "name": "trfsCrdEp",
    "type": "fieldset",
    "name": "9KsbjYImzix",
    "label": "Fieldset",
    "value": "",
    "visible": true,
    "items": [
      {
        "name": "G8RV9sXlj",
        "type": "radiobox",
        "name": "pkFvKtJNKO8",
        "label": "radiobox",
        "value": "",
        "visible": true
      },
      {
        "name": "NDPkA1nM5",
        "type": "checkbox",
        "name": "WYr0X9pJAYb",
        "label": "checkbox",
        "value": "",
        "visible": true
      },
      {
        "name": "5BkOuESxh",
        "type": "text",
        "name": "GvwiALRvfTs",
        "label": "Textbox",
        "value": "",
        "visible": true
      },
      {
        "name": "k0yh6QrG_",
        "type": "button",
        "name": "EWiXm3KOR53",
        "label": "Button",
        "value": "",
        "visible": true
      },
      {
        "name": "uuQiNNAEf",
        "type": "label",
        "name": "E9Ou2LotXUO",
        "label": "Label",
        "value": "Value",
        "visible": true
      }
    ]
  },
  {
    "name": "trfsCrdEp4567",
    "type": "fieldset",
    "name": "9KsbjYImzix3456",
    "label": "Fieldset",
    "value": "",
    "visible": true,
    "items": [
      {
        "name": "uuQiNNAEf",
        "type": "label",
        "name": "E9Ou2LotXUO",
        "label": "Label",
        "value": "Value",
        "visible": true
      },
      {
        "type": "checkbox",
        "name": "recurring12",
        "label": "Recurring",
        "value": "",
        "visible": true
      },
      {
        "type": "date",
        "name": "recurringDate12",
        "label": "Recurring Date",
        "value": "",
        "visible": true,
      }
    ]
  },
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
        "message": "min payment amount is 1.00 MYR"
      }
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
      "type": 'WHYEQ',
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

function App() {

  //form data store
  const [data, setData] = useState()

  //Access to form
  const myForm = useRef({});
  //Form elements
  const [items, setItems] = useState(
    sample
  );

  const newComponents = {
    text: (props) => <Text {...props} />,
    checkbox: (props => <Checkbox {...props} />),
    switch: (props => <Switch {...props} />),
    select: (props => <Dropdown {...props} />),
    date: (props => <DatePick {...props} />),
    button: (props) => <Button {...props} />,
    fieldset: (props) => <Fieldset {...props} />,
    none: (props) => (<pre>
      {JSON.stringify(props.item, null, 2)}
      <i>{props.child && props.child}</i>
    </pre>)
  };

  const renderContainer = children =>
    <div className="inputContainer">
      {children}
    </div>

  const renderComponent = (type, propsItems) => {
    const selectedComponent = newComponents && newComponents[type] || newComponents['none'];
    // if (selectedComponent === undefined) return null;
    console.log(type)
    if (type === "button") {
      return selectedComponent({ ...propsItems })

    }

    return renderContainer(selectedComponent({ ...propsItems }))
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

  const validationResolver = {
    noteq: async (item, value) => {
      return (value !== '' && !item.value.includes(value)) || false;
    },
    eq: async (item, value) => {
      return value?.toString() === item.value;
    },
    WHYEQ: async (item, value) => {
      return value?.toString() === item.value;
    },
    notEmptyAndEqual: async (item, value) => {
      return (value !== '' && item.value.includes(value)) || false;
    },
  };

  return (
    <>
      <div
        className="fieldsssss"
        style={{ padding: "2rem", marginTop: "2rem" }}>
        <DynoBuilder
          validationResolver={validationResolver}
          ref={myForm}
          items={items}
          components={renderComponent}
          managedCallback={managedCallback}
        />
      </div>
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
