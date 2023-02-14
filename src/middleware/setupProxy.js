import _ from "lodash";
import schemaProxy from "./schemaProxy";

const setupProxy = (item, extraValues = {}, extraFunctions = {}) => {
    const proxyItems = schemaProxy(item, extraValues, extraFunctions);

    let newSchema = {};
    const y = Object.keys(proxyItems).map((el) => {
        if (el === "sharedItems") return;
        newSchema = _.set(newSchema, el, proxyItems[el]);
        console.log("dyno ;)", el, "flattttttttten");
    });

    return _.cloneDeep(newSchema);
}

export default setupProxy;
