const sample = {
  root: {
    name: "root",
    items: ["Fozik6DQV", "M6W1Nk1aN", "KLL68VGG8"],
    visible: true,
  },
  M6W1Nk1aN: {
    id: "M6W1Nk1aN",
    type: "fieldset",
    name: "7rgq_tX10h",
    label: "Fieldset",
    value: "",
    visible: true,
    items: [
      "MppdeTIIp",
      "89xelIkUq",
      "4jyM#2#OK",
      "##sk5BfXl",
      "z1XvRhvpW",
      "qv#DFnYxa",
      "IKGXunixL",
    ],
    parent: ["root", "1"],
  },
  Fozik6DQV: {
    id: "Fozik6DQV",
    type: "label",
    name: "L8eD8ZdXtE",
    label: "Make a FD Placement",
    value: "Value",
    visible: true,
    parent: ["root", "0"],
    defaultValue: "",
    placeholder: "",
  },
  KLL68VGG8: {
    id: "KLL68VGG8",
    type: "button",
    name: "next",
    label: "Next",
    value: "",
    visible: true,
    parent: ["root", "2"],
    defaultValue: "",
    placeholder: "",
  },
  "4jyM#2#OK": {
    id: "4jyM#2#OK",
    type: "select",
    action: {
      actionURL: "http://localhost:3033/data/transfer/transferType",
    },
    name: "fromBank",
    label: "Transfer From Bank",
    value: "",
    visible: true,
    parent: ["M6W1Nk1aN", "2"],
    defaultValue: "",
    placeholder: "Select bank",
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
    options: [
      {
        value: "Maybank",
        label: "Maybank",
      },
      {
        value: "CIMB",
        label: "CIMB",
      },
      {
        value: "PublicBank",
        label: "Public Bank",
      },
    ],
  },
  "89xelIkUq": {
    id: "89xelIkUq",
    type: "select",
    name: "fdAccountNo",
    label: "FD Account Number",
    value: "",
    visible: true,
    parent: ["M6W1Nk1aN", "1"],
    defaultValue: "",
    placeholder: "Select FD account Number",
    rule: {
      required: "FD Account Number is required.",
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
    options: [
      {
        value: "433423332212",
        label: "4334 2333 2212",
      },
      {
        value: "433411182212",
        label: "4334 1118 2212",
      },
    ],
  },
  MppdeTIIp: {
    id: "MppdeTIIp",
    type: "select",
    name: "accountType",
    label: "Account Type",
    value: "",
    visible: true,
    parent: ["M6W1Nk1aN", "0"],
    defaultValue: "",
    placeholder: "Select account type",
    rule: {
      required: "Account Type is required.",
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
    options: [
      {
        value: "eIFD",
        label: "Islamic Fixed Deposit (eIFD)",
      },
      {
        value: "eFD",
        label: "Fixed Deposit (eFD)",
      },
    ],
  },
  "qv#DFnYxa": {
    id: "qv#DFnYxa",
    type: "select",
    name: "term",
    label: "Term",
    value: "",
    visible: false,
    parent: ["M6W1Nk1aN", "4"],
    defaultValue: "",
    placeholder: "select term",
    options: [
      {
        value: "1",
        label: "1 month",
      },
      {
        value: "2",
        label: "2 month",
      },
    ],
    rule: {
      required: "term is required.",
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
      {
        name: "accountNo",
        value: "",
        type: "exist",
      },
      {
        name: "otherBankAccount",
        value: "Maybank",
        type: "exist",
      },
    ],
  },
  "##sk5BfXl": {
    id: "##sk5BfXl",
    type: "select",
    name: "accountNo",
    label: "Account No",
    value: "",
    visible: false,
    parent: ["M6W1Nk1aN", "4"],
    defaultValue: "",
    placeholder: "",
    rule: {
      required: "Account is required.",
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
      {
        name: "fromBank",
        value: "Maybank",
        type: "eq",
      },
    ],
    options: [
      {
        value: "7777777777777",
        label: "7777 7777 77777",
      },
      {
        value: "4345453454355",
        label: "4345 4534 54355",
      },
    ],
  },
  IKGXunixL: {
    id: "IKGXunixL",
    type: "text",
    name: "amount",
    label: "Amount",
    value: "",
    visible: false,
    parent: ["M6W1Nk1aN", "4"],
    defaultValue: "",
    placeholder: "",
    preCondition: [
      {
        name: "accountNo",
        value: "",
        type: "exist",
      },
      {
        name: "otherBankAccount",
        value: "Maybank",
        type: "exist",
      },
    ],
  },
  z1XvRhvpW: {
    id: "z1XvRhvpW",
    type: "text",
    name: "otherBankAccount",
    label: "Account No",
    value: "",
    visible: false,
    parent: ["M6W1Nk1aN", "6"],
    defaultValue: "",
    placeholder: "",
    preCondition: [
      {
        name: "fromBank",
        value: "Maybank",
        type: "noteq",
      },
    ],
  },
};

const sample999 = {
  root: {
    name: "root",
    items: ["dhRpEEKSr", "n#GT9ElP8"],
    visible: true,
  },
  dhRpEEKSr: {
    id: "dhRpEEKSr",
    type: "text",
    name: "yasser",
    label: "Yasser",
    value: "",
    visible: true,
    parent: ["root", "0"],
    defaultValue: "",
    placeholder: "",
  },
  "n#GT9ElP8": {
    id: "n#GT9ElP8",
    type: "text",
    name: "ay5tbGMMPZ",
    label: "Label",
    value: "Value",
    visible: false,
    parent: ["root", "1"],
    preCondition: [
      {
        name: "yasser",
        value: "110",
        type: "eq",
      },
    ],
  },
};


const dddd = { "dataModel": {}, "items": { "root": { "name": "root", "items": ["duitnowType", "icTextbox", "phoneTextbox"], "visible": true }, "duitnowType": { "id": "duitnowType", "type": "select", "name": "duitnowType", "label": "Type", "value": "", "visible": true, "parent": ["root", "0"], "defaultValue": "", "header": "", "tooltip": "", "description": "", "placeholder": "", "valueType": "", "suffix": "", "prefix": "", "inputType": "", "disabled": false, "watch": false, "templateName": "", "theme": "", "optionLabelSchema": "", "optionValueSchema": "", "optionsSchema": "", "options": [{ "value": "army", "label": "Army" }, { "value": "ic", "label": "ic" }, { "value": "phone", "label": "phone" }, { "value": "passport", "label": "passport" }] }, "icTextbox": { "id": "icTextbox", "type": "text", "name": "duitnowValue", "label": "IC", "value": "", "visible": false, "parent": ["root", "1"], "defaultValue": "", "header": "", "tooltip": "", "description": "", "placeholder": "", "valueType": "", "suffix": "", "prefix": "", "inputType": "", "disabled": false, "watch": false, "templateName": "", "theme": "", "preCondition": [{ "name": "duitnowType", "value": "ic", "type": "eq" }] }, "phoneTextbox": { "id": "phoneTextbox", "type": "text", "name": "duitnowValue", "label": "Phone", "value": "", "visible": false, "parent": ["root", "2"], "defaultValue": "", "header": "", "tooltip": "", "description": "", "placeholder": "", "valueType": "", "suffix": "", "prefix": "", "inputType": "", "disabled": false, "watch": false, "templateName": "", "theme": "" } } }


const realObject = {
  //recursive naming -
  defaultValue: {
    "paymentType-value": "2345678",
    "paymentType-options": [
      {
        label: "IBFT",
        value: "IBFT",
      },
      {
        label: "GIRO",
        value: "GIRO",
      },
    ],
    paymentType: "value",
    ref1: "fdfdfdfs",
  },
  root: {
    name: "root",
    parent: "root",
    type: "Box",
    items: ["accountContainer", "paymentContainer"],
    props: {},
    visible: true,
  },
  accountContainer: {
    name: "accountContainer",
    parent: "root",
    type: "fieldset",
    items: ["paymentType", "amount"],
    props: {},
    visible: true,
  },
  paymentContainer: {
    name: "paymentContainer",
    parent: "root",
    type: "fieldset",
    items: ["ref1", "ref2", "recurring", "recurringDate", "submit"],
    props: {},
    visible: true,
  },
  paymentType: {
    type: "select",
    name: "paymentType",
    label: "Payment Type",
    value: "",
    visible: true,
    placeholder: "Select Payment Type",
    description: "IBFT sameday, GIRO tomorrow",
    rule: { required: "please select payment type." },
    options: [
      {
        label: "IBFT",
        value: "IBFT",
      },
      {
        label: "GIRO",
        value: "GIRO",
      },
    ],
  },
  amount: {
    type: "text",
    name: "amount",
    label: "Amount MYR",
    value: "",
    placeholder: "0.0 RM",
    visible: true,
    description: "Min is 1.0 MYR",
    rule: {
      required: "amount is required.",
      min: {
        value: 1.0,
        message: "min payment amount is 1.00 MYR",
      },
    },
  },
  ref1: {
    type: "text",
    name: "ref1",
    label: "Refrence 1",
    value: "",
    placeholder: "8888",
    visible: true,
    rule: {
      required: "Reference is required.",
    },
  },
  ref2: {
    type: "text",
    name: "ref2",
    label: "Refrence 2",
    value: "",
    placeholder: "phone number",
    visible: true,
    rule: {
      required: "Reference is required.",
    },
  },
  recurring: {
    type: "checkbox",
    name: "recurring",
    label: "Recurring",
    value: "",
    visible: true,
  },
  recurringDate: {
    type: "date",
    name: "recurringDate",
    label: "Recurring Date",
    value: "",
    visible: false,
    preCondition: [
      {
        name: "recurring",
        value: "true",
        type: "WHYEQ",
      },
    ],
  },
  submit: {
    type: "button",
    name: "submit",
    label: "Pay Now",
    value: "",
    visible: true,
  },
};

const objItems = {
  root: {
    name: "root",
    parent: "root",
    type: "Box",
    items: [
      "comp-KZFKR95SVGQ8Y",
      "comp-KZFKR95SVGQ822222",
      "comp-KZFKR6JV50XQC",
    ],
    props: {},
    visible: true,
  },
  "comp-KZFKR6JV50XQC": {
    name: "comp-KZFKR6JV50XQC",
    props: {},
    items: [
      "comp-KZFKR95SVGQ8Z",
      "comp-KZFKRB8B3ID4A",
      "comp-KZFKRDRONJFTS",
      "comp-KZFKRMHTUF840",
    ],
    type: "fieldset",
    parent: "root",
    rootParentType: "Flex",
    visible: false,
    preCondition: [
      {
        name: "comp-KZFKR95SVGQ8Y",
        value: "true",
        type: "WHYEQ",
      },
    ],
  },
  "comp-KZFKR95SVGQ8Y": {
    name: "comp-KZFKR95SVGQ8Y",
    props: {
      children: "Button text",
      variant: "solid",
      size: "md",
    },
    type: "text",
    parent: "root",
    rootParentType: "Button",
    visible: true,
  },
  "comp-KZFKR95SVGQ822222": {
    name: "comp-KZFKR95SVGQ822222",
    props: {
      children: "Button text",
      variant: "solid",
      size: "md",
    },
    items: [],
    type: "text",
    parent: "root",
    rootParentType: "Button",
    visible: true,
  },
  "comp-KZFKR95SVGQ8Z": {
    name: "comp-KZFKR95SVGQ8Z",
    props: {
      children: "Button text",
      variant: "solid",
      size: "md",
    },
    items: [],
    type: "text",
    parent: "comp-KZFKR6JV50XQC",
    rootParentType: "Button",
    visible: true,
  },
  "comp-KZFKRB8B3ID4A": {
    name: "comp-KZFKRB8B3ID4A",
    props: {
      children: "Button text",
      variant: "solid",
      size: "md",
    },
    items: [],
    type: "text",
    parent: "comp-KZFKR6JV50XQC",
    rootParentType: "Button",
    visible: false,
    preCondition: [
      {
        name: "comp-KZFKR95SVGQ822222",
        value: "true",
        type: "WHYEQ",
      },
    ],
  },
  "comp-KZFKRDRONJFTS": {
    name: "comp-KZFKRDRONJFTS",
    props: {
      children: "Button text",
      variant: "solid",
      size: "md",
    },
    items: [],
    type: "text",
    parent: "comp-KZFKR6JV50XQC",
    rootParentType: "Button",
    visible: true,
  },
  "comp-KZFKRMHTUF840": {
    name: "comp-KZFKRMHTUF840",
    props: {
      children: "Button text",
      variant: "solid",
      size: "md",
    },
    items: [],
    type: "button",
    parent: "comp-KZFKR6JV50XQC",
    rootParentType: "Button",
    visible: true,
  },
};

const arrayItems = [
  {
    name: "CjRF1MGcc",
    type: "text",
    name: "3bAHnqz39LK",
    label: "Textbox",
    value: "",
    visible: true,
  },
  {
    name: "cv5sDWDU9",
    type: "select",
    name: "tfYfn#B#91L",
    label: "dropdown",
    value: "",
    visible: true,
  },
  {
    name: "Ky1Vc__pX",
    type: "checkbox",
    name: "OmAJyFQBIX0",
    label: "checkbox",
    value: "",
    visible: true,
  },
  {
    name: "trfsCrdEp",
    type: "fieldset",
    name: "9KsbjYImzix",
    label: "Fieldset",
    value: "",
    visible: true,
    items: [
      {
        name: "G8RV9sXlj",
        type: "radiobox",
        name: "pkFvKtJNKO8",
        label: "radiobox",
        value: "",
        visible: true,
      },
      {
        name: "NDPkA1nM5",
        type: "checkbox",
        name: "WYr0X9pJAYb",
        label: "checkbox",
        value: "",
        visible: true,
      },
      {
        name: "5BkOuESxh",
        type: "text",
        name: "GvwiALRvfTs",
        label: "Textbox",
        value: "",
        visible: true,
      },
      {
        name: "k0yh6QrG_",
        type: "button",
        name: "EWiXm3KOR53",
        label: "Button",
        value: "",
        visible: true,
      },
      {
        name: "uuQiNNAEf",
        type: "label",
        name: "E9Ou2LotXUO",
        label: "Label",
        value: "Value",
        visible: true,
      },
    ],
  },
  {
    name: "trfsCrdEp4567",
    type: "fieldset",
    name: "9KsbjYImzix3456",
    label: "Fieldset",
    value: "",
    visible: true,
    items: [
      {
        name: "uuQiNNAEf",
        type: "label",
        name: "E9Ou2LotXUO",
        label: "Label",
        value: "Value",
        visible: true,
      },
      {
        type: "checkbox",
        name: "recurring12",
        label: "Recurring",
        value: "",
        visible: true,
      },
      {
        type: "date",
        name: "recurringDate12",
        label: "Recurring Date",
        value: "",
        visible: true,
      },
    ],
  },
  {
    type: "select",
    name: "paymentType",
    label: "Payment Type",
    value: "",
    visible: true,
    placeholder: "Select Payment Type",
    description: "IBFT sameday, GIRO tomorrow",
    rule: { required: "please select payment type." },
    options: [
      {
        label: "IBFT",
        value: "IBFT",
      },
      {
        label: "GIRO",
        value: "GIRO",
      },
    ],
  },
  {
    type: "text",
    name: "amount",
    label: "Amount MYR",
    value: "",
    placeholder: "0.0 RM",
    visible: true,
    description: "Min is 1.0 MYR",
    rule: {
      required: "amount is required.",
      min: {
        value: 1.0,
        message: "min payment amount is 1.00 MYR",
      },
    },
  },
  {
    type: "text",
    name: "ref1",
    label: "Refrence 1",
    value: "",
    placeholder: "8888",
    visible: true,
    rule: {
      required: "Reference is required.",
    },
  },
  {
    type: "text",
    name: "ref2",
    label: "Refrence 2",
    value: "",
    placeholder: "phone number",
    visible: true,
    rule: {
      required: "Reference is required.",
    },
  },
  {
    type: "checkbox",
    name: "recurring",
    label: "Recurring",
    value: "",
    visible: true,
  },
  {
    type: "date",
    name: "recurringDate",
    label: "Recurring Date",
    value: "",
    visible: false,
    preCondition: [
      {
        name: "recurring",
        value: "true",
        type: "WHYEQ",
      },
    ],
  },
  {
    type: "button",
    name: "submit",
    label: "Pay Now",
    value: "",
    visible: true,
  },
];