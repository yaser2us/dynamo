import _ from "lodash";

const dataTransformer = (data, name, obj) => (local) => {
    // const { getValues, dataStore } = obj.sharedItems || { getValues: undefined };
    // const values = { ...dataStore, ...(getValues() || {}) };
    // console.log("dyno ;)", data, values, 'getValues()()()')
    //

    const { getValues, dataStore } = local.sharedItems || { getValues: undefined };
    const values = { ...dataStore, ...(getValues && getValues() || {}) };
    console.log("dyno ;)", data, values, 'getValues()()()')


    //Need to check later ;)
    // if (typeof data === 'function') {
    //     return data()(values)
    // }

    if (typeof data === "string") {
        if (data !== undefined && data.includes("$$")) {
            console.log("dyno ;)", "blaherebla", data, values)
            return _.get(values, data.substring(2));
        }
        // check fx first 
        if (data !== undefined && data.includes("fx")) {
            console.log("dyno ;)", data.slice(2), 'sliceeeeeee')
            try {
                // const result = eval(data.slice(2));
                const result = eval(`local.${data.slice(2)}`);

                console.log("dyno ;)", result, 'rrrrrrrsulttttttttt')
                if (typeof result === 'function') {
                    return result(values);
                }
                return result;
            } catch (error) {
                console.log("dyno ;)", error, 'rrrrrrrsulttttttttt errorororrororor')
            }
        };

        let patternResult = data;

        if (data !== undefined && data.includes("dx")) {
            patternResult = patternResult.replace(/dx.*?\(.*?\)/g, (_, name) => {

                try {
                    console.log("dyno ;)", _, name, 'pattern waaaaaalalala 2nd', patternResult)
                    const result = eval(`local.${_}`);
                    if (typeof result === 'function') {
                        return result(values);
                    }
                    return result;
                } catch (error) {
                    console.log("dyno ;)", error, 'dxxxxxxxxxxxxdxdxxdxdxx')
                    return _;
                }
            });
        }

        patternResult = patternResult.replace(/\$\{(.*?)\}/g, (_, name) => {

            const result = values[name] || ''; //_.get(values, name);
            console.log("dyno ;)", values, 'valuesssssssssssssssssRGEX')
            console.log("dyno ;)", name, '------>>>>>>------', result, 'pattern waaaaaalalala only', patternResult)

            return result !== undefined && result//"";//field[name];
        });

        return patternResult;

    };

    return data;
}

export { dataTransformer };