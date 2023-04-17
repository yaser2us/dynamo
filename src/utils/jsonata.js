const jsonataOriginal = require('jsonata');

const htmltotext = (value, options) => { 
    return `${value} yasserrrrrrrr`
}

const registerWithJSONATA = (expression) => {
    if (typeof expression === 'undefined' || typeof expression.registerFunction === 'undefined') {
      throw new TypeError('Invalid JSONata Expression');
    }
    expression.registerFunction(
      'htmltotext',
      (value, options) => htmltotext(value, options),
      '<s?o?:s>'
    );
}

function jsonataExtended(expr, options) {
    const expression = jsonataOriginal(expr, options);
    registerWithJSONATA(expression);
    return expression;
}

export default jsonataExtended;