import _ from "lodash";
// const console = {
//     log: () => null
// }

const debug = (...args) => {
    console.log("dynamo transformerrrrr ->", ...args)
}
const dataTransformer = (data, name, obj) => (local) => {
    // const { getValues, dataStore } = obj.sharedItems || { getValues: undefined };
    // const values = { ...dataStore, ...(getValues() || {}) };
    // console.log("dyno ;)", data, values, 'getValues()()()')
    //

    const { getValues, dataStore,  index = 1 } = local.sharedItems || { getValues: undefined };
    const values = { ...dataStore, ...(getValues && getValues() || {}), index, displayIndex: index + 1 };


    //Need to check later ;)
    // if (typeof data === 'function') {
    //     return data()(values)
    // }

    if (typeof data === "string") {

        //Happy birthday ;)
        // $$
        // fx
        // {{ amount && Valid() }}
        const ExpRE = /^\s*\{\{([\s\S]*)\}\}\s*$/
        const matched = data.match(ExpRE)
        if (matched) {
            try {
                console.log("dyno ;)", name, 'me getValues()()()', matched[1])

                const result = new Function('root', `return root.${matched[1]}`)({
                    ...values,
                    ...local,
                });

                console.log("dyno ;)", result, 'me getValues()()() after', matched[1])

                // const result = new Function('$root', `with($root) { return (${matched[1]}); }`)(
                //     {
                //         ...values,
                //         local
                //     }
                // )
                if (typeof result === 'function') {
                    return result({
                        ...values,
                        ...local,
                    });
                }
                return result;
            } catch (error) {
                console.log(error, '{{ error transformer }}');
                return data;
            }
        }
        //End fo Happy moment of birthday ;)



        if (data !== undefined && data.includes("$$")) {
            console.log("dyno ;)", "blaherebla", data, dataStore, _.get(values, data.substring(2)))
            return _.get(values, data.substring(2));
        }
        // check fx first 
        if (data !== undefined && data.includes("fx")) {
            console.log("dyno ;)", data.slice(2), 'sliceeeeeee')
            try {

                // const result = eval(`local.${data.slice(2)}`);
                console.log(local, '{{ local }}');

                const result = new Function('root', `return root.${data.slice(2)}`)({
                    ...values,
                    ...local
                });

                if (typeof result === 'function') {
                    console.log("dyno ;)", result, 'rrrrrrrsulttttttttt function')
                    return result({
                        ...values,
                        ...local
                    });
                }
                if (result?.then) {
                    console.log("dyno ;)", result, 'rrrrrrrsulttttttttt function.then')
                    return result.then(function (response) {
                        console.log("dyno ;)", response, 'rrrrrrrsulttttttttt [2] function.then result')
                        return response
                    })
                }
                console.log("dyno ;)", result, 'rrrrrrrsulttttttttt [3] function.then lol')
                return result;
            } catch (error) {
                console.log("dyno ;)", name, '----->', error, 'rrrrrrrsulttttttttt errorororrororor')
            }
        };

        let patternResult = data;

        // "hi dxTransform()"
        // no {{ 'hi ' && Transform()}}
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

        patternResult = patternResult.replace(/\$\{(.*?)\}/g, (w, name) => {

            const result = _.get(values, name) || ''; //_.get(values, name); values[name]
            // console.log("dyno ;)", values, 'valuesssssssssssssssssRGEX')
            // console.log("dyno ;)", name, '------>>>>>>------', result, 'pattern waaaaaalalala only', patternResult)

            return result !== undefined && result//"";//field[name];
        });

        return patternResult;

    };

    return data;
}

export { dataTransformer };