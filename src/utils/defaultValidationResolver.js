const defaultValidationResolver = {
    noteq: async (item, value) => {
        return (value !== '' && !item.value.includes(value)) || false;
    },
    eq: async (item, value) => {
        return value?.toString() === item.value;
    },
    notEmptyAndEqual: async (item, value) => {
        return (value !== '' && item.value.includes(value)) || false;
    },
};

export {
    defaultValidationResolver
}