import _ from "lodash";

const schemaTransformation = (data, name, obj) => (local) => {
    const values = { ...obj.sharedItems };
    if (data === undefined || data === null) return data;

    if (typeof data === "string") {
        // check fx first
        if (data !== undefined && data.includes("fx")) {
            try {
                // const result = eval(data.slice(2));
                const result = eval(`extraFunctions.${data.slice(2)}`);
                if (typeof result === "function") {
                    return result(values);
                }
                return result;
            } catch (error) {
                console.log("dyno ;)", error, "rrrrrrrsulttttttttt errorororrororor");
            }
        }

        if (data !== "") {
            const result = _.get(values, data.substring(2)) ?? data; // values[data] || data;
            // if(result!== undefined) return result;
            return result;
        }
    }

    return data;
};

export default schemaTransformation;