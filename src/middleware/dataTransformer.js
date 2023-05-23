import _ from "lodash";
// const console = {
//     log: () => null
// }

const debug = (...args) => {
    // console.log(...args)
}
const dataTransformer = (data, name, obj) => (local) => {
    // const { getValues, dataStore } = obj.sharedItems || { getValues: undefined };
    // const values = { ...dataStore, ...(getValues() || {}) };
    // debug("dyno ;)", data, values, 'getValues()()()')
    //

    const { getValues, dataStore } = local.sharedItems || { getValues: undefined };
    const values = { ...dataStore, ...(getValues && getValues() || {}) };
    debug("dyno ;)", data, values, 'getValues()()()')


    //Need to check later ;)
    // if (typeof data === 'function') {
    //     return data()(values)
    // }

    if (typeof data === "string") {
        if (data !== undefined && data.includes("$$")) {
            debug("dyno ;)", "blaherebla", data, values)
            return _.get(values, data.substring(2));
        }
        // check fx first 
        if (data !== undefined && data.includes("fx")) {
            debug("dyno ;)", data.slice(2), 'sliceeeeeee')
            try {
                // const result = eval(data.slice(2));
                const result = eval(`local.${data.slice(2)}`);

                debug("dyno ;)", result, 'rrrrrrrsulttttttttt')
                if (typeof result === 'function') {
                    return result(values);
                }
                if (result?.then) {
                    return result.then(function (response) {
                        // debug(!tresult, "rrrrrrrsulttttttttt tresult")
                        return !response
                    })
                }
                return result;
            } catch (error) {
                debug("dyno ;)", error, 'rrrrrrrsulttttttttt errorororrororor')
            }
        };

        let patternResult = data;

        if (data !== undefined && data.includes("dx")) {
            patternResult = patternResult.replace(/dx.*?\(.*?\)/g, (_, name) => {

                try {
                    debug("dyno ;)", _, name, 'pattern waaaaaalalala 2nd', patternResult)
                    const result = eval(`local.${_}`);
                    if (typeof result === 'function') {
                        return result(values);
                    }
                    return result;
                } catch (error) {
                    debug("dyno ;)", error, 'dxxxxxxxxxxxxdxdxxdxdxx')
                    return _;
                }
            });
        }

        patternResult = patternResult.replace(/\$\{(.*?)\}/g, (w, name) => {

            const result = _.get(values, name) || ''; //_.get(values, name); values[name]
            // debug("dyno ;)", values, 'valuesssssssssssssssssRGEX')
            // debug("dyno ;)", name, '------>>>>>>------', result, 'pattern waaaaaalalala only', patternResult)

            return result !== undefined && result//"";//field[name];
        });

        return patternResult;

    };

    return data;
}

export { dataTransformer };