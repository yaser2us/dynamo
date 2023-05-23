function actionsRunner(action, localFunction, item, dataStore) {
    let resultPromise = Promise.resolve(item);

    for (const functionName in action) {
        const config = action[functionName];
        const asyncFunction = localFunction[functionName];
        resultPromise = resultPromise.then((result) => {
            console.log(functionName, asyncFunction, 'dyno actionsRunner', result)
            return asyncFunction(config)(dataStore)(result);
        });
    }

    return resultPromise;
}

export default actionsRunner;