import React, { useRef, useState } from "react";
import axios from "axios";
// 1: install this dynamo
import {
  DynoBuilder,
  FormBuilderV4 as FormBuilderNext,
  schemaProxy,
  setupProxy,
  useStateWithHistory,
  useDynamoHistory,
  actionsRunner
} from "dynamo";

// import 'dynamo/dist/index.css'
import Select from "react-select";
import _ from "lodash";
import R from "ramda";
import "./App.css";

import Button from "./Components/Button/Button";
import Text from "./Components/Textbox/Text";
import Checkbox from "./Components/Checkbox/Checkbox";
import Switch from "./Components/Switch/Switch";
import DatePick from "./Components/Date/DatePick";
import Dropdown from "./Components/Select/Dropdown";
import Fieldset from "./Components/Fieldset/Fieldset";
import LocalPagination from "./Components/Fieldset/LocalPagination";
import Label from "./Components/Label/Label";
import ConfirmationButton from "./Components/Button/ConfirmationButton";
import AsyncBlock from "./Components/AsyncBlock/AsyncBlock";
import { generate } from 'astring'
import { parse } from "acorn";

const serverURL = "http://54.169.175.134:3033/";
const developmentURL = "http://localhost:3033/";
const serverPath = developmentURL;
let pppppp = {};
//from 942 to
function App() {

  const sample110 = {
    root: {
      name: "root",
      items: ["header", "whatsYourName", "whatsMyName", "container", "dataSource", "submitTrigger"],
      visible: true,
    },
    whatsMyName: {
      id: "whatsMyName",
      type: "text",
      name: "whatsMyName",
      label: "Whats my Name buddy? ${wathchMei}",
      // label: (props) => (values) => `hi hi from f(x) ;)`,
      // value: "",
      disabled: (props) => (values) => Valid('wathchMei', '==', '900')(values),
      visible: true,
      rule: {
        formId: "yasser",
        required: "I dont know my name yet hmmmmm.",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: 3,
          message: "min 3",
        },
        maxLength: {
          value: 3,
          message: "max 3",
        },
        pattern: {
          value: "",
          message: "",
        },
        validate: {
          positiveNumber: "only positive number pls yeah :)",
          // lessThanHundred: "cant be less than hundred ;)",
        },
        validateCompse: {
          letsComposeValidation: {
            positiveNumber: "only positive number pls yeah :)",
            lessThanHundred: "cant be less than hundred ;)"
          }
        },
        deps: ["wathchMei"],
        validate2121: {
          positiveNumber: (value) => {
            console.log(value, 'positiveNumber validatevalidatevalidatevalidate')
            const result = parseFloat(value) > 0;
            return result && result || "errororororororororoo"
          },
          lessThanHundred: (value) => {
            console.log(value, 'lessThanHundred validatevalidatevalidatevalidate')
            return parseFloat(value) < 200 || "less than 200"
          },
        },
        validate1234: [
          {
            messages: "",
            validation: "fxPositiveNumber"
          }
        ]
      },
      watch: false
    },
    whatsYourName: {
      id: "whatsYourName",
      type: "text",
      name: "whatsYourName",
      label: "Whats heloooooo Name buddy? ${wathchMei}",
      // label: (props) => (values) => `hi hi from f(x) ;)`,
      // value: "",
      visible: "fxValid('whatsMyName', '==', '900')",
      // visible: false,
      rule: {
        // formId: "yasser",
        required: "I dont know your name yet ${whatsMyName}",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: 3,
          message: "errororororo Whats heloooooo Name buddy? ${wathchMei}",
        },
        maxLength: {
          value: 3,
          message: "max 3",
        },
        pattern: {
          value: "",
          message: "",
        },
        validate: {
          positiveNumber: "only positive number pls yeah :)",
          // lessThanHundred: "cant be less than hundred ;)",
        },
        validateCompse: {
          letsComposeValidation: {
            positiveNumber: "only positive number pls yeah :)",
            lessThanHundred: "cant be less than hundred ;)"
          }
        },
        deps: ["wathchMei"],
        validate2121: {
          positiveNumber: (value) => {
            console.log(value, 'positiveNumber validatevalidatevalidatevalidate')
            const result = parseFloat(value) > 0;
            return result && result || "errororororororororoo"
          },
          lessThanHundred: (value) => {
            console.log(value, 'lessThanHundred validatevalidatevalidatevalidate')
            return parseFloat(value) < 200 || "less than 200"
          },
        },
        validate1234: [
          {
            messages: "",
            validation: "fxPositiveNumber"
          }
        ]
      },
      // "preCondition": [
      //   {
      //     "name": "whatsMyName",
      //     "value": "900",
      //     "type": "eq"
      //   }
      // ],
      watch: false
    },
    "container": {
      id: "container",
      type: "fieldset",
      name: "container",
      label: "Fieldset",
      value: "",
      visible: true,
      isArray: false,
      items: ["wathchMei", "howAreYouThen", "submitME", "submitME2", "submitME3", "submitMETrigger"],
    },
    submitME: {
      id: "submitME",
      type: "button",
      name: "submitME",
      label: "Trigger Background Textbox only",
      value: "",
      disabled: "fxtriggerBackgroundOptimised('yasser')",
      visible: true,
    },
    submitME2: {
      id: "submitME2",
      type: "button",
      name: "submitME2",
      label: "Trigger Baackground Default",
      value: "",
      disabled: "fxtriggerBackgroundOptimised()",
      visible: true,
    },
    submitME3: {
      id: "submitME3",
      type: "button",
      name: "submitME3",
      label: "Trigger Baackground DropDown only",
      value: "",
      // disabled: true,
      disabled: "fxtriggerBackgroundOptimised('bank')",
      visible: true,
    },
    submitMETrigger: {
      id: "submitMETrigger",
      type: "button",
      name: "submitMETrigger",
      label: "Trigger only",
      value: "",
      // disabled: true,
      disabled: "fxtriggerGroup(['howAreYouThen','whatsYourName', 'whatsMyName'])",
      visible: true,
    },
    submitTrigger: {
      id: "submitTrigger",
      type: "button",
      name: "submitTrigger",
      label: "Trigger whatsMyName",
      value: "",
      // disabled: true,
      disableds: "fxtriggerGroup(['whatsMyName', 'whatsYourName'])",
      action: {
        getGroupValuesBackground: {},
        alertPopup: {},
        updateHistory: {}
      },
      actionlol: {
        validations: ['whatsMyName'],
        schema: {
          "wow": "fxValid('whatsMyName', '==', '900')",
          "bla": "$$whatsYourName",
          yasser: {
            nasser: {
              "bla": "$$whatsYourName"
            }
          }
        }
      },
      visible: true,
    },
    "howAreYouThen": {
      id: "howAreYouThen",
      type: "select",
      name: "howAreYouThen",
      label: "wathchMei read from dataSource",
      options: "dataSource",
      visible: true,
      rule: {
        formId: "bank",
        required: "Transfer select hello From Bank is required.",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: null,
          message: "",
        },
        maxLength: {
          value: null,
          message: "",
        },
        pattern: {
          value: "",
          message: "",
        },
      },
      preCondition: [

      ]
    },
    "header": {
      id: "header",
      type: "label",
      name: "header",
      label: "Example of Watch & DataSource",
      value: "Value",
      visible: true,
    },
    "dataSource": {
      id: "dataSource",
      type: "dataSource",
      name: "dataSource",
      label: "wathchMei",
      value: "Value",
      visible: true,
      watch: true
    },
    wathchMei: {
      id: "wathchMei",
      type: "text",
      name: "wathchMei",
      label: "watch me ;) 9999",
      value: "",
      valueType: "",
      visible: true,
      // visible: "fxValid('whatsYourName', '==', '900')",
      disabled: false,
      // "preCondition": [
      //   {
      //     "name": "whatsYourName",
      //     "value": "900",
      //     "type": "eq"
      //   }
      // ],
      rule: {
        required: "Transfer From Bank is required.",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: null,
          message: "",
        },
        maxLength: {
          value: null,
          message: "",
        },
        pattern: {
          value: "",
          message: "",
        },
      },
      watch: false
    },
  };

  const sample313 = {
    root: {
      name: "root",
      items: ["header", "whatsYourName", "whatsMyName", "container", "dataSource", "submitTrigger"],
      visible: true,
    },
    whatsMyName: {
      id: "whatsMyName",
      type: "text",
      name: "whatsMyName",
      label: "Whats my Name buddy? 313 and more ${cache.home.defaultValues.whatsMyName}",
      // label: (props) => (values) => `hi hi from f(x) ;)`,
      // value: "",
      disabled: (props) => (values) => Valid('wathchMei', '==', '900')(values),
      visible: true,
      rule: {
        formId: "yasser",
        required: "I dont know my name yet hmmmmm.",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: 3,
          message: "min 3",
        },
        maxLength: {
          value: 3,
          message: "max 3",
        },
        pattern: {
          value: "",
          message: "",
        },
        validate: {
          positiveNumber: "only positive number pls yeah :)",
          // lessThanHundred: "cant be less than hundred ;)",
        },
        validateCompse: {
          letsComposeValidation: {
            positiveNumber: "only positive number pls yeah :)",
            lessThanHundred: "cant be less than hundred ;)"
          }
        },
        deps: ["wathchMei"],
        validate2121: {
          positiveNumber: (value) => {
            console.log(value, 'positiveNumber validatevalidatevalidatevalidate')
            const result = parseFloat(value) > 0;
            return result && result || "errororororororororoo"
          },
          lessThanHundred: (value) => {
            console.log(value, 'lessThanHundred validatevalidatevalidatevalidate')
            return parseFloat(value) < 200 || "less than 200"
          },
        },
        validate1234: [
          {
            messages: "",
            validation: "fxPositiveNumber"
          }
        ]
      },
      watch: false
    },
    whatsYourName: {
      id: "whatsYourName",
      type: "text",
      name: "whatsYourName",
      label: "Whats heloooooo Name buddy? ${wathchMei}",
      // label: (props) => (values) => `hi hi from f(x) ;)`,
      // value: "",
      visible: "fxValid('whatsMyName', '==', '900')",
      // visible: false,
      rule: {
        // formId: "yasser",
        required: "I dont know your name yet ${whatsMyName}",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: 3,
          message: "errororororo Whats heloooooo Name buddy? ${wathchMei}",
        },
        maxLength: {
          value: 3,
          message: "max 3",
        },
        pattern: {
          value: "",
          message: "",
        },
        validate: {
          positiveNumber: "only positive number pls yeah :)",
          // lessThanHundred: "cant be less than hundred ;)",
        },
        validateCompse: {
          letsComposeValidation: {
            positiveNumber: "only positive number pls yeah :)",
            lessThanHundred: "cant be less than hundred ;)"
          }
        },
        deps: ["wathchMei"],
        validate2121: {
          positiveNumber: (value) => {
            console.log(value, 'positiveNumber validatevalidatevalidatevalidate')
            const result = parseFloat(value) > 0;
            return result && result || "errororororororororoo"
          },
          lessThanHundred: (value) => {
            console.log(value, 'lessThanHundred validatevalidatevalidatevalidate')
            return parseFloat(value) < 200 || "less than 200"
          },
        },
        validate1234: [
          {
            messages: "",
            validation: "fxPositiveNumber"
          }
        ]
      },
      // "preCondition": [
      //   {
      //     "name": "whatsMyName",
      //     "value": "900",
      //     "type": "eq"
      //   }
      // ],
      watch: false
    },
    "container": {
      id: "container",
      type: "fieldset",
      name: "container",
      label: "Fieldset",
      value: "",
      visible: true,
      isArray: false,
      items: ["wathchMei", "howAreYouThen", "submitME", "submitME2", "submitME3", "submitMETrigger"],
    },
    submitME: {
      id: "submitME",
      type: "button",
      name: "submitME",
      label: "Trigger Background Textbox only",
      value: "",
      disabled: "fxtriggerBackgroundOptimised('yasser')",
      visible: true,
    },
    submitME2: {
      id: "submitME2",
      type: "button",
      name: "submitME2",
      label: "Trigger Baackground Default",
      value: "",
      disabled: "fxtriggerBackgroundOptimised()",
      visible: true,
    },
    submitME3: {
      id: "submitME3",
      type: "button",
      name: "submitME3",
      label: "Trigger Baackground DropDown only",
      value: "",
      // disabled: true,
      disabled: "fxtriggerBackgroundOptimised('bank')",
      visible: true,
    },
    submitMETrigger: {
      id: "submitMETrigger",
      type: "button",
      name: "submitMETrigger",
      label: "Trigger only",
      value: "",
      // disabled: true,
      disabled: "fxtriggerGroup(['howAreYouThen','whatsYourName', 'whatsMyName'])",
      visible: true,
    },
    submitTrigger: {
      id: "submitTrigger",
      type: "button",
      name: "submitTrigger",
      label: "Trigger whatsMyName",
      value: "",
      // disabled: true,
      disabled: "fxtriggerGroup(['whatsMyName', 'whatsYourName'])",
      action: {
        validations: ['whatsMyName'],
        schema: {
          "wow": "fxValid('whatsMyName', '==', '900')",
          "bla": "$$whatsYourName",
          yasser: {
            nasser: {
              "bla": "$$whatsYourName"
            }
          }
        }
      },
      visible: true,
    },
    "howAreYouThen": {
      id: "howAreYouThen",
      type: "select",
      name: "howAreYouThen",
      label: "wathchMei read from dataSource",
      options: "dataSource",
      visible: true,
      rule: {
        formId: "bank",
        required: "Transfer select hello From Bank is required.",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: null,
          message: "",
        },
        maxLength: {
          value: null,
          message: "",
        },
        pattern: {
          value: "",
          message: "",
        },
      },
      preCondition: [

      ]
    },
    "header": {
      id: "header",
      type: "label",
      name: "header",
      label: "Example of Watch & DataSource",
      value: "Value",
      visible: true,
    },
    "dataSource": {
      id: "dataSource",
      type: "dataSource",
      name: "dataSource",
      label: "wathchMei",
      value: "Value",
      visible: true,
      watch: true
    },
    wathchMei: {
      id: "wathchMei",
      type: "text",
      name: "wathchMei",
      label: "watch me ;) 9999",
      value: "",
      valueType: "",
      visible: true,
      // visible: "fxValid('whatsYourName', '==', '900')",
      disabled: false,
      // "preCondition": [
      //   {
      //     "name": "whatsYourName",
      //     "value": "900",
      //     "type": "eq"
      //   }
      // ],
      rule: {
        required: "Transfer From Bank is required.",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: null,
          message: "",
        },
        maxLength: {
          value: null,
          message: "",
        },
        pattern: {
          value: "",
          message: "",
        },
      },
      watch: false
    },
  };

  const sample777 = {
    root: {
      name: "root",
      items: ["header", "whatsYourName", "whatsMyName", "container", "dataSource", "submitTrigger"],
      visible: true,
    },
    whatsMyName: {
      id: "whatsMyName",
      type: "text",
      name: "whatsMyName",
      label: "Whats my Name buddy? 777 and more and thanks ALLAH ${wathchMei}",
      // label: (props) => (values) => `hi hi from f(x) ;)`,
      // value: "",
      disabled: (props) => (values) => Valid('wathchMei', '==', '900')(values),
      visible: true,
      rule: {
        formId: "yasser",
        required: "I dont know my name yet hmmmmm.",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: 3,
          message: "min 3",
        },
        maxLength: {
          value: 3,
          message: "max 3",
        },
        pattern: {
          value: "",
          message: "",
        },
        validate: {
          positiveNumber: "only positive number pls yeah :)",
          // lessThanHundred: "cant be less than hundred ;)",
        },
        validateCompse: {
          letsComposeValidation: {
            positiveNumber: "only positive number pls yeah :)",
            lessThanHundred: "cant be less than hundred ;)"
          }
        },
        deps: ["wathchMei"],
        validate2121: {
          positiveNumber: (value) => {
            console.log(value, 'positiveNumber validatevalidatevalidatevalidate')
            const result = parseFloat(value) > 0;
            return result && result || "errororororororororoo"
          },
          lessThanHundred: (value) => {
            console.log(value, 'lessThanHundred validatevalidatevalidatevalidate')
            return parseFloat(value) < 200 || "less than 200"
          },
        },
        validate1234: [
          {
            messages: "",
            validation: "fxPositiveNumber"
          }
        ]
      },
      watch: false
    },
    whatsYourName: {
      id: "whatsYourName",
      type: "text",
      name: "whatsYourName",
      label: "Whats heloooooo Name buddy? ${wathchMei}",
      // label: (props) => (values) => `hi hi from f(x) ;)`,
      // value: "",
      visible: "fxValid('whatsMyName', '==', '900')",
      // visible: false,
      rule: {
        // formId: "yasser",
        required: "I dont know your name yet ${whatsMyName}",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: 3,
          message: "errororororo Whats heloooooo Name buddy? ${wathchMei}",
        },
        maxLength: {
          value: 3,
          message: "max 3",
        },
        pattern: {
          value: "",
          message: "",
        },
        validate: {
          positiveNumber: "only positive number pls yeah :)",
          // lessThanHundred: "cant be less than hundred ;)",
        },
        validateCompse: {
          letsComposeValidation: {
            positiveNumber: "only positive number pls yeah :)",
            lessThanHundred: "cant be less than hundred ;)"
          }
        },
        deps: ["wathchMei"],
        validate2121: {
          positiveNumber: (value) => {
            console.log(value, 'positiveNumber validatevalidatevalidatevalidate')
            const result = parseFloat(value) > 0;
            return result && result || "errororororororororoo"
          },
          lessThanHundred: (value) => {
            console.log(value, 'lessThanHundred validatevalidatevalidatevalidate')
            return parseFloat(value) < 200 || "less than 200"
          },
        },
        validate1234: [
          {
            messages: "",
            validation: "fxPositiveNumber"
          }
        ]
      },
      // "preCondition": [
      //   {
      //     "name": "whatsMyName",
      //     "value": "900",
      //     "type": "eq"
      //   }
      // ],
      watch: false
    },
    "container": {
      id: "container",
      type: "fieldset",
      name: "container",
      label: "Fieldset",
      value: "",
      visible: true,
      isArray: false,
      items: ["wathchMei", "howAreYouThen", "submitME", "submitME2", "submitME3", "submitMETrigger"],
    },
    submitME: {
      id: "submitME",
      type: "button",
      name: "submitME",
      label: "Trigger Background Textbox only",
      value: "",
      disabled: "fxtriggerBackgroundOptimised('yasser')",
      visible: true,
    },
    submitME2: {
      id: "submitME2",
      type: "button",
      name: "submitME2",
      label: "Trigger Baackground Default",
      value: "",
      disabled: "fxtriggerBackgroundOptimised()",
      visible: true,
    },
    submitME3: {
      id: "submitME3",
      type: "button",
      name: "submitME3",
      label: "Trigger Baackground DropDown only",
      value: "",
      // disabled: true,
      disabled: "fxtriggerBackgroundOptimised('bank')",
      visible: true,
    },
    submitMETrigger: {
      id: "submitMETrigger",
      type: "button",
      name: "submitMETrigger",
      label: "Trigger only",
      value: "",
      // disabled: true,
      disabled: "fxtriggerGroup(['howAreYouThen','whatsYourName', 'whatsMyName'])",
      visible: true,
    },
    submitTrigger: {
      id: "submitTrigger",
      type: "button",
      name: "submitTrigger",
      label: "Trigger whatsMyName",
      value: "",
      // disabled: true,
      disabled: "fxtriggerGroup(['whatsMyName', 'whatsYourName'])",
      action: {
        validations: ['whatsMyName'],
        schema: {
          "wow": "fxValid('whatsMyName', '==', '900')",
          "bla": "$$whatsYourName",
          yasser: {
            nasser: {
              "bla": "$$whatsYourName"
            }
          }
        }
      },
      visible: true,
    },
    "howAreYouThen": {
      id: "howAreYouThen",
      type: "select",
      name: "howAreYouThen",
      label: "wathchMei read from dataSource",
      options: "dataSource",
      visible: true,
      rule: {
        formId: "bank",
        required: "Transfer select hello From Bank is required.",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: null,
          message: "",
        },
        maxLength: {
          value: null,
          message: "",
        },
        pattern: {
          value: "",
          message: "",
        },
      },
      preCondition: [

      ]
    },
    "header": {
      id: "header",
      type: "label",
      name: "header",
      label: "Example of Watch & DataSource",
      value: "Value",
      visible: true,
    },
    "dataSource": {
      id: "dataSource",
      type: "dataSource",
      name: "dataSource",
      label: "wathchMei",
      value: "Value",
      visible: true,
      watch: true
    },
    wathchMei: {
      id: "wathchMei",
      type: "text",
      name: "wathchMei",
      label: "watch me ;) 9999",
      value: "",
      valueType: "",
      visible: true,
      // visible: "fxValid('whatsYourName', '==', '900')",
      disabled: false,
      // "preCondition": [
      //   {
      //     "name": "whatsYourName",
      //     "value": "900",
      //     "type": "eq"
      //   }
      // ],
      rule: {
        required: "Transfer From Bank is required.",
        min: {
          value: null,
          message: "",
        },
        max: {
          value: null,
          message: "",
        },
        minLength: {
          value: null,
          message: "",
        },
        maxLength: {
          value: null,
          message: "",
        },
        pattern: {
          value: "",
          message: "",
        },
      },
      watch: false
    },
  };

  //form data store
  const [data, setData] = useState("hihihihihihih");
  const [products, setProducts] = useState();
  const [options, setOptions] = useState();
  const [dataStore, setDataStore] = useState({});

  const [shouldUnregister, setShouldUnregister] = useState(false);
  //Access to form
  const myForm = useRef({});
  //Form elements
  // const [items, setItems] = useState(sample);
  const [items, setItems] = useState();
  const [defaultValues, updateDefaults] = useState({
    wathchMei: "Edwarddddddddddd 0)"
  });


  const [preparedValueTypes, setPreparedValueTypes] = useState();

  const itemsRefs = useRef({});

  //history 
  const [count, setCount, { history, pointer, back, forward, go }] = useStateWithHistory(1)

  const dd = [
    { id: 1, name: 'Object 1' },
    { id: 2, name: 'Object 2', type: "secondary" },
    { id: 3, name: 'Object 3', type: "secondary" }
  ];

  const navigatableArray = useDynamoHistory([{ name: 'home', items: sample110, defaultValues: {} }], 'name', 2, true, false);

  const handleInsertObject = () => {
    const newObject = { id: `4`, name: `Object duplication ${Date.now()}`, type: "secondary" };
    const insertIndex = 2; // Insert at index 2
    navigatableArray.insertObject(newObject, insertIndex, false, true);
  };

  const handleUpdateObject = () => {
    const newObject = { id: `4`, name: `Object duplication ${Date.now()}`, type: "secondary" };
    navigatableArray.updateCurrent(newObject);
  };

  const handleUpdateObjectById = () => {
    const newObject = { id: 2, name: `Object updated by id 4 ${Date.now()}`, type: "secondary" };
    navigatableArray.updateObjectById(newObject);
  };

  const handleInsertObjectAtEnd = () => {
    const randomNumber = Math.floor(Math.random() * 10000000) + 1;
    console.log(randomNumber, 'randomNumber');
    const newDynamoPage = { name: `mypage-${randomNumber}`, items: sample313, defaultValues: {} }

    const newObject = {
      id: `${Date.now()}`, name: `Object bla bro ha lalala ${Date.now()}`,
      ...(randomNumber === 1 && { type: "primary" }),
      // type: randomNumber === 1 ? "secondary" : "primary" 
    };
    navigatableArray.insertObject(newDynamoPage);
  };

  // const NavigatableObjectsArray = function (arr, field, id) {
  //   const cur = arr.map((e) => e[field]).indexOf(id);
  //   let nextId = cur + 1;
  //   let previousId = cur - 1;

  //   arr.next = (function () { return (nextId >= this.length) ? false : this[nextId]; });
  //   arr.current = (function () { return (cur >= this.length) ? false : this[cur]; });
  //   arr.previous = (function () { return (previousId < 0) ? false : this[previousId]; });
  //   arr.goToStart = (function () { return NavigatableObjectsArray(this, field, this[0][field]) });
  //   arr.goTo = (function (id) { const index = this.map((e) => e[field]).indexOf(id); return (index < 0) ? false : NavigatableObjectsArray(this, field, this[index][field]) });
  //   arr.goNext = (function () { return (nextId >= this.length) ? false : NavigatableObjectsArray(this, field, this[nextId][field]) });
  //   arr.goBack = (function () { return (previousId < 0) ? false : NavigatableObjectsArray(this, field, this[previousId][field]) });
  //   arr.goToEnd = (function () { return NavigatableObjectsArray(this, field, this[(this.length - 1)][field]) });
  //   return arr;
  // };

  var code = "Valid('33','hihi hihi')"
  // Parse it into an AST
  var ast = parse(code, { ecmaVersion: 6 })
  // Format it into a code string
  var formattedCode = generate(ast)
  // Check it
  console.log(code === formattedCode ? 'generate It works!' : 'generate Something went wrong…', ast)


  React.useEffect(() => {
    const fetchProducts = () => {
      axios
        .get(`${serverPath}forms/type/form`)
        .then((res) => {
          console.log(res.data, "formioioioioio, locallll");
          const newOptions = res.data.map((item, index) => {
            return {
              value: index,
              label: item.name,
            };
          });
          setProducts(res.data);
          setOptions(newOptions);
        })
        .catch((err) => console.log(err));
    };
    fetchProducts();
  }, []);

  const Valid = (a, b, c) => (values) => {
    if (!values) return false;
    const aValue = values[a] || 0;
    try {
      const result = eval(`${aValue} ${b} ${c}`);
      console.log(a, b, c, values, 'VALIDDDDDDDDDD', result)
      return result
    } catch (error) {
      return eval(`0 ${b} 0`);
    }
  }

  const newComponents = {
    text: (props) => <Text {...props} />,
    checkbox: (props) => <Checkbox {...props} />,
    switch: (props) => <Switch {...props} />,
    select: (props) => <Dropdown {...props} />,
    date: (props) => <DatePick {...props} />,
    button: (props) => <Button {...props} />,
    fieldset: (props) => <Fieldset {...props} />,
    // fieldset: (props) => <LocalPagination {...props} />,
    label: (props) => <Label {...props} />,
    confirmationButton: (props) => <ConfirmationButton {...props} />,
    asyncBlock: (props) => <AsyncBlock {...props} />,
    dataSource: (props) => <AsyncBlock {...props} />,
    none: (props) => (
      <pre>
        {JSON.stringify(props.item, null, 2)}
        <i>{props.child && props.child}</i>
      </pre>
    ),
  };

  const renderContainer = (children) => (
    <div className="inputContainer">{children}</div>
  );

  const renderComponent = (type, propsItems) => {
    const selectedComponent =
      (newComponents && newComponents[type]) || newComponents["none"];
    // if (selectedComponent === undefined) return null;
    console.log(type);
    if (type === "button") {
      return selectedComponent({ ...propsItems });
    }

    return renderContainer(selectedComponent({ ...propsItems }));
  };

  const getGroupValuesBackground = config => dataStore => async data => {
    return new Promise(async (resolve, reject) => {
      const formData = await myForm.current.getGroupValuesBackground(data.item?.action?.validations);
      console.log("getValues", formData);
      resolve(formData)
    })
  }

  const alertPopup = config => dataStore => async data => {
    return new Promise(async (resolve, reject) => {
      // Async processing
      if (!_.isEmpty(myForm.current.errors)) {
        alert(myForm.current.errors[Object.keys(myForm.current.errors)[0]].message);
        reject('helllooooo errrororo is there')
      }
      resolve(data)
    });
  }

  // const cache = config => async data => {
  //   return new Promise(async (resolve, reject) => {
  //     // Async processing
  //     if (!_.isEmpty(myForm.current.errors)) {
  //       alert(myForm.current.errors[Object.keys(myForm.current.errors)[0]].message);
  //       reject('helllooooo errrororo is there') 
  //     }
  //     resolve('goood to go >>')
  //   });
  // }


  const managedCallback = async ({ item, actionType = "partial" }) => {
    // if (item && actionType === "partial") {
    //   const result = await axios.get(item?.action?.actionURL);
    //   console.log("hereeeeeeeeeeeeeeeeeeeee", result);
    //   return { ...result.data };
    //   // .then(res => {
    //   //   console.log(res.data, "formioioioioio, locallll");
    //   //   return {...res.data};
    //   // }).catch(err => console.log(err));
    // } else if (item && actionType === "merge") {
    //   const result = await axios.get(item?.action?.actionURL);
    //   console.time(`lololololo ${item.id}`, items);

    //   item.items = result?.data?.items?.root?.items;

    //   let newItems = result.data.items;
    //   delete newItems.root;

    //   let oio = {
    //     root: items.root,
    //     ...itemsRefs?.current,
    //     [item.id]: item,
    //     ...newItems,
    //   };

    //   setItems(updateItemsRefs(oio));

    //   // pppppp = {
    //   //   ...{
    //   //     ...items,
    //   //     [item.id]: item,
    //   //     ...newItems,
    //   //   },
    //   //   ...itemsRefs?.current,
    //   // };

    //   // setItems(pppppp);
    //   // setItems((prevState) => {
    //   //   // Object.assign would also work
    //   //   console.log(pppppp, 'ertyuiortyuityu', prevState)
    //   //   return {
    //   //     ...{
    //   //       ...items,
    //   //       [item.id]: item,
    //   //       ...newItems,
    //   //     }
    //   //   };
    //   // });
    //   console.timeEnd(`lololololo ${item.id}`, items);
    //   console.log(`lololololo ${item.id}`, items);

    //   // setTimeout(() => {
    //   //   setItems({
    //   //     ...items,
    //   //     [item.id]: item,
    //   //     ...newItems,
    //   //   });
    //   // }, 1000);

    //   return pppppp;
    // } else if (item && actionType === "update") {
    //   setItems(item);
    //   console.log(`lololololo update ${item.id}`, items);

    //   return items;
    //   // return;
    // }

    if (item && item.action && typeof item.action === 'object') {
      const allLocalFunction = myForm.current.localFunction;
      actionsRunner(item.action, allLocalFunction, { item }, dataStore)
        // chainAsyncFunctions(item.action, localFunction, {item})
        .then((lastResult) => {

          console.log('Last result:', lastResult);
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    }

    return;


    //Get dynamo form values
    const schema = _.cloneDeep(item?.action?.schema);

    console.log(myForm.current, 'setValuesetValue', item?.action?.validations, schema)

    const formData = await myForm.current.getGroupValuesBackground(item?.action?.validations);

    alert(JSON.stringify(formData))
    if (!_.isEmpty(myForm.current.errors)) {
      alert(myForm.current.errors[Object.keys(myForm.current.errors)[0]].message);
      myForm.current.errors[Object.keys(myForm.current.errors)[0]].ref.focus();
      // throw new Error('Still there is an error at page heyyyy choyyyy! ;)');
    } else {
      const current = navigatableArray.current();

      navigatableArray.updateCurrent({
        ...current, defaultValues: {
          ...formData,
        }
      })
    }



    //false means error is there
    //otherwise the data object returns
    if (!formData) return null;

    // let resultData = {};
    // for (const [key, value] of Object.entries(preparedValueTypes)) {

    //   if (formData[key]) {
    //     const field = formData[key].value;
    //     const selectedValue = _.get(field, value);
    //     resultData = Object.assign(resultData, { [key]: formData[key][value] })
    //     console.log(field, selectedValue, 'insideeeeeeeee', value, formData[key][value])

    //   }
    // }


    // console.log(preparedValueTypes, 'managedCallback prepared Massaging', resultData)
    // //just sample store data in component
    // setShouldUnregister(false)

    // setData({ ...formData, ...resultData });
    // console.log("this is result from dynamo ;)", { ...formData, ...resultData });
    return true;
  };

  const validationResolver = {
    noteq: async (item, value) => {
      console.log(
        !(value === item.value),
        value,
        item,
        "noteqeq",
        item.value.includes(value),
        value === ""
      );
      return !(value === item.value);
      // return (value !== "" && !item.value.includes(value)) || false;
    },
    eq: async (item, value) => {
      console.log(item, value, "eqeqeq");
      return value === item.value;
    },
    exist: async (item, value) => {
      console.log(item, value, "exist");
      return value !== "";
    },
    eq1: async (item, value) => {
      return (value !== "" && item.value.includes(value)) || false;
    },
  };

  const updateItemsRefs = (data) => {
    itemsRefs.current = data;
    console.log(itemsRefs.current, "itemsRefs.current");
    return { ...data };
  };

  const customOnChange = (e) => {
    const selectedPage = _.cloneDeep(products[e.value].items);
    console.log(e, "customOnChange", selectedPage);

    let prepareValueTypes = {};
    for (const [key, value] of Object.entries(selectedPage)) {
      console.log(key, "customOnChange valueType", value, value['valueType']);
      if (value['valueType']) {
        const name = value.name;
        prepareValueTypes = Object.assign(prepareValueTypes, { [name]: value['valueType'] })
      }
    }

    // if(prepareValueTypes !== {}) {
    setPreparedValueTypes(prepareValueTypes);
    // }
    console.log(preparedValueTypes, "customOnChange valueType preparedValueTypes");

    // setItemsRefs(selectedPage);
    setItems(selectedPage);
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      marginTop: 10,
      "&:hover": { borderColor: "#74e3e4" },
      border: "1px solid lightgray",
      boxShadow: "none",
      borderRadius: 20,
    }),
  };

  const positiveNumber = (error) => (resources) => (value) => {
    console.log(value, 'positiveNumber validatevalidatevalidatevalidate', error, resources)
    const result = parseFloat(value) > 0;
    return result && result || error
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const lessThanHundred = (error) => (resources) => async (value) => {
    const formData = await resources.getValues("wathchMei");
    const item = resources.getItem();

    const { name } = item;
    // resources.clearErrors(name);

    // resources.setValue("wathchMei", value);

    console.log(value, 'lessThanHundred validatevalidatevalidatevalidate', error, '====', data, resources, '----- getValuesssssssssszzzzzz', formData, resources.getItem())
    await sleep(3000)
    // resources.setFocus("wathchMei")
    return parseFloat(value) < parseInt(formData) || error
  }

  //Should we have in dyno ???
  //Edward :)
  const letsComposeValidation = (validations) => (resources) => (value) => {
    console.log(value, 'letsComposeValidationME validatevalidatevalidatevalidate', validations, resources)
    let result = true;
    Object.keys(validations).every(key => {
      if (typeof validations[key] === "function") return;
      result = localFunction[key](validations[key])(value);
      console.log(key, 'letsComposeValidationWITHIN ---- within', result, typeof result === "string")
      if (typeof result === "string") {
        return false;
      };
      return true;
    });
    return result;
  }


  console.log(items, "itemsitemsitemsitems");

  const getDataStore = () => {
    const result = {
      cache: {
        ...navigatableArray.getHistory()
      },
      ...dataStore,
    }
    console.log(result, 'getDataStore')
    return result;
  }

  function updateHistory(config) {
    return function (dataStore) {
      return function (item) {
        return new Promise((resolve, reject) => {
          const current = navigatableArray.current();
          console.log(item, 'updateHistoryyyyy')
          navigatableArray.updateCurrent({
            ...current, defaultValues: {
              ...item,
            }
          })
          resolve(dataStore);
        });
      };
    }

  }

  function asyncFunction1(config) {
    return function (dataStore) {
      return function (item) {
        return new Promise((resolve, reject) => {
          // Async processing
          setTimeout(() => {
            const result = item + ' function 1';
            // Modify dataStore if needed
            dataStore.foo = 'bar';
            resolve(result);
          }, 1000); // Simulating async operation
        });
      };
    };
  }

  function asyncFunction2(config) {
    return function (dataStore) {
      return function (item) {
        return new Promise((resolve, reject) => {
          // Async processing
          setTimeout(() => {
            const result = item + ' function 2';
            // Modify dataStore if needed
            dataStore.baz = 'qux';
            resolve(result);
          }, 1000); // Simulating async operation
        });
      };
    };
  }

  function asyncFunction3(config) {
    return function (dataStore) {
      return function (item) {
        return new Promise((resolve, reject) => {
          // Async processing
          setTimeout(() => {
            const result = item + ' function 3';
            // Modify dataStore if needed
            dataStore.updated = true;
            resolve(result);
          }, 1000); // Simulating async operation
        });
      };
    };
  }

  const action = {
    asyncFunction1: { /* config for asyncFunction1 */ },
    asyncFunction2: { /* config for asyncFunction2 */ },
    asyncFunction3: { /* config for asyncFunction3 */ }
  };

  // const localFunction = {
  //   asyncFunction1,
  //   asyncFunction2,
  //   asyncFunction3
  // };

  function chainAsyncFunctions(action, localFunction, item, dataStore) {
    let resultPromise = Promise.resolve(item);

    for (const functionName in action) {
      const config = action[functionName];
      const asyncFunction = localFunction[functionName];
      resultPromise = resultPromise.then((result) => {
        console.log(functionName, asyncFunction, 'chainAsyncFunctions', result)
        return asyncFunction(config)(dataStore)(result);
      });
    }

    return resultPromise;
  }

  const localFunction = {
    Valid: Valid,
    positiveNumber: positiveNumber,
    lessThanHundred: lessThanHundred,
    letsComposeValidation: letsComposeValidation,
    asyncFunction1,
    asyncFunction2,
    asyncFunction3,
    getGroupValuesBackground,
    alertPopup,
    updateHistory
  }

  // Call the async functions in order with initial input value
  const item = 'Initial input';

  // chainAsyncFunctions(action, localFunction, item, dataStore)
  //   .then((lastResult) => {
  //     console.log('Last result:', lastResult);
  //     console.log('DataStore:', dataStore);
  //     // Access and use the configs as needed
  //     console.log('Config for asyncFunction1:', action.asyncFunction1);
  //     console.log('Config for asyncFunction2:', action.asyncFunction2);
  //     console.log('Config for asyncFunction3:', action.asyncFunction3);
  //   })
  //   .catch((error) => {
  //     console.error('An error occurred:', error);
  //   });




  // function chainAsyncFunctions(functionConfigs, functionMappings, initialInput) {
  //   let resultPromise = Promise.resolve(initialInput);

  //   for (const functionName in functionConfigs) {
  //     const config = functionConfigs[functionName];
  //     const asyncFunction = functionMappings[functionName];
  //     resultPromise = resultPromise.then((result) => {
  //       return asyncFunction(config)(result);
  //     });
  //   }

  //   return resultPromise;
  // }

  // // Call the async functions in order with initial input value
  // const initialInput = 'Initial input';

  // chainAsyncFunctions(functionConfigs, functionMappings, initialInput)
  //   .then((lastResult) => {
  //     console.log('Last result:', lastResult);
  //     // Access and use the configs as needed
  //     console.log('Config for asyncFunction1:', functionConfigs.asyncFunction1);
  //     console.log('Config for asyncFunction2:', functionConfigs.asyncFunction2);
  //     console.log('Config for asyncFunction3:', functionConfigs.asyncFunction3);
  //   })
  //   .catch((error) => {
  //     console.error('An error occurred:', error);
  //   });



  return (
    <>
      <div>
        <button className="button"
          onClick={() => navigatableArray.goToStart()}>Go to Start</button>
        <button className="button"
          onClick={() => navigatableArray.goNext()}>Go Next</button>
        <button className="button" onClick
          ={() => navigatableArray.goTo(3, true)}>Go Yasser</button>
        <button className="button" onClick
          ={() => navigatableArray.goBack()}>Go Back</button>
        <button className="button" onClick
          ={() => navigatableArray.goToEnd()}>Go to End</button>
        <button className="button" onClick
          ={() => handleInsertObject()}>Insert Object at Index</button>
        <button className="button" onClick
          ={() => handleInsertObjectAtEnd()}>Insert Object at End</button>
        <button className="button" onClick
          ={() => navigatableArray.goToIndex(10, true)}>Go to 10 ;)</button>
        <button className="button" onClick
          ={() => navigatableArray.removeObjectByIndex(10)}>Remove Object By Index to 10</button>
        <button className="button" onClick
          ={() => navigatableArray.removeObjectByName('4')}>Remove By Name 4</button>
        <button className="button" onClick
          ={() => navigatableArray.removeAll()}>Remove all, i mean it :)</button>
        <button className="button" onClick
          ={() => handleUpdateObject()}>update current 3></button>
        <button className="button" onClick
          ={() => handleUpdateObjectById()}>update by ID 4></button>
        <button className="button" onClick
          ={() => navigatableArray.goBackToPrimary()}>Go Back To Primary</button>
        <button className="button" onClick
          ={() => navigatableArray.goForwardToType()}>Go Forward To Primary</button>
        <button className="button" onClick
          ={() => navigatableArray.removeObjectByIndex(navigatableArray.currentIndex)}>Remove current one la</button>

        <h1>
          indexes: {navigatableArray.history.length}
        </h1>
        <h2>
          Current Object: {navigatableArray.current()?.name}
          <br />
          Current Index: {navigatableArray.currentIndex}
        </h2>
        <ul>
          {navigatableArray.history.map(obj => {
            if (navigatableArray.current()?.name === obj.name) {
              return (
                <li key={obj.id}><strong>{obj.name}</strong> <i>{obj.type}</i></li>
              )
            }
            return <li key={obj.id}>{obj.name} <i>{obj.type}</i></li>
          }
          )
          }
        </ul>
      </div>
      <Select
        name={"product"}
        key={"product"}
        id={"product"}
        placeholder={"select product"}
        styles={customStyles}
        options={options}
        onChange={customOnChange}
      />
      <div className="fieldd" style={{ padding: "2rem", marginTop: "2rem" }}>
        <p onClick={() => {
          updateDefaults({
            wathchMei: "Yasser" + Date.now()
          })
          // myForm.current.reset({
          //   wathchMei: "Yasser"
          // });
          console.log("brrrrrrrrrrr")
        }}>
          hi hihiihhihhihh
        </p>
        {sample110 && (
          <FormBuilderNext
            devMode={true}
            dataStore={getDataStore()}
            key={`${navigatableArray.current().name}`}
            // name={`dynamo-${dddd.items.length}`}
            ref={myForm}
            // items={sample110}
            items={navigatableArray.current().items}
            localFunction={
              localFunction
            }
            shouldUnregister={shouldUnregister}
            components={renderComponent}
            managedCallback={managedCallback}
            validationResolver={validationResolver}
            defaultValues={navigatableArray.current().defaultValues}
          />
        )}
      </div>
      <div className="fieldd" style={{ padding: "2rem", marginTop: "2rem" }}>
        <fieldset
          className="field"
          style={{ padding: "2rem", marginTop: "2rem" }}
        >
          <b>Result ;)</b>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </fieldset>
      </div>
    </>
  );
}

export default App;

{
  /* <Switch />
      <div className="inputContainer">
        <Text />
      </div>
      <Checkbox />
      <Radio />
      <Button />
      <DatePick />
      <Dropdown /> */
}

// <Progress />
