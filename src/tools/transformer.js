import jsonata from "../utils/jsonata";

export default async function transformer(data, schema)  {
    const expression = jsonata(schema);
    const result = await expression.evaluate(data);
    return result;
}