import flattenObject from "../utils/flattenObject";
import schemaTransformation from "./schemaTransformer";

const schemaProxy = (item, extraValues = {}, extraFunctions = {}) => {
    if (item === undefined) return {};

    const proxyHandler = {
        get(target, prop, receiver) {
            if (typeof target[prop] === "object" && target[prop] !== null) {
                console.log(target[prop], "proxyHanlerrrrrrrr ;)");
                return new Proxy(target[prop], proxyHandler);
            } else {
                return schemaTransformation(
                    target[prop],
                    prop,
                    target
                )({
                    ...extraFunctions
                });
            }
        }
    };

    const proxySchema = new Proxy(
        {
            ...flattenObject({
                ...item.action.schema
            }),
            sharedItems: { ...extraValues, ...item }
        },
        proxyHandler
    );
    return proxySchema
}

export default schemaProxy;


