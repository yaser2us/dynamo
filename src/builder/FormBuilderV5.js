import React, { useCallback, useEffect, useState, useRef } from 'react'

import {
    useWatch
} from "../useWatch"
import {
    useFieldArray
} from "../useFieldArray"
import {
    FormProvider,
    useFormContext
} from "../useFormContext"
import {
    useForm
} from "../useFormV1"
import {
    Controller
} from "../controller"

import _ from 'lodash'
// import deepEqual from "../utils/deepEqual"
import deepEqual from "../utils/deepEqual"
import { defaultValidationResolver } from "../utils/defaultValidationResolver"
import { dataTransformer as defaultDataTransformer } from '../middleware/dataTransformer'
// import { defaultValidationResolver } from "../dynamo/utils/defaultValidationResolver"

const renderComponentInd = (name, data, { updateReference,
    myComponents,
    getValues,
    errors,
    ControlledComponents,
    components,
    managedCallback,
    undefined,
    sharedItems,
    index,
    parent,
    givenName = undefined,
    dataTransformer
}
) => {

    const selectedComponent = { ...data[name], givenName };
    // Add givenName here ;)
    // selectedComponent.givenName = givenName;


    if (selectedComponent === undefined) return null;
    // if (proxyItem === undefined) return null;

    //proxy here ;)
    const proxyHandler = {
        get(target, prop, receiver) {
            if (typeof target[prop] === "object" && target[prop] !== null) {
                console.log("dyno ;)", target[prop], "proxyHanlerrrrrrrr me ;)");
                return new Proxy(target[prop], proxyHandler);
            }
            return dataTransformer(target[prop], prop, target)({
                ...sharedItems.localFunction,
                sharedItems: {
                    ...sharedItems,
                    index
                },
                // ...sharedItems
            });
        }
    };

    const proxyItem = new Proxy({
        ...selectedComponent,
        sharedItems: sharedItems
    }, proxyHandler);
    // debugger;
    // if (selectedComponent?.visible === false) return null
    // name === "howAreYouThen" && console.log(proxyItem?.visible, 'Vaaaaala Result proxyItem?.visible', name, proxyItem?.visible === false)
    if (proxyItem?.visible === false) return null

    return renderComponentForm(
        proxyItem,
        updateReference,
        myComponents,
        getValues,
        { ...errors },
        ControlledComponents,
        components,
        managedCallback,
        undefined,
        sharedItems,
        index,
        data,
        parent,
        dataTransformer
    )
}

const renderComponentForm = (
    item,
    updateReference,
    myControl,
    getValue,
    errorss,
    ControlledComponents,
    components,
    managedCallback,
    parentName,
    sharedItems,
    index,
    data,
    parent,
    dataTransformer
) => {
    console.log("dyno ;)", errorss, 'dataerrors')
    //console.time('renderFormmm')
    // const r = data
    //     .filter((element) => element.visible)
    //     .map((item, index) => {
    //         // console.log("dyno ;)", item, "ittttem")

    const {
        register,
        handleSubmit,
        watch,
        errors,
        control,
        trigger,
        setFocus,
        getValues,
        setValue,
        useFieldArray,
        useWatch,
        triggerBackground
    } = sharedItems

    // if (!item.visible) return null
    const name = parentName && `${parentName}.${item.name}` || item.givenName && item.givenName || item.name

    let result = null
    let child = []
    if (item.items) {
        child = item.items.map((name, idx) => renderComponentInd(name, data, {
            updateReference,
            myControl,
            getValue,
            errors,
            ControlledComponents,
            components,
            managedCallback,
            parentName: item?.items && name || undefined,
            sharedItems,
            index: idx,
            data,
            parent: { name: item.name, index, id: item.id },
            itemName: name,
            dataTransformer
        }))

        // renderComponentForm(
        //     item.items,
        //     updateReference,
        //     myControl,
        //     getValue,
        //     errors,
        //     ControlledComponents,
        //     components,
        //     managedCallback,
        //     item?.items && name || undefined,
        //     sharedItems,
        //     setValue
        // )
    }

    const validation = {
        maxLength: item.maxLength && item.maxLength.value !== "" && item.maxLength || undefined,
        minLength: item.minLength && item.minLength.value !== "" && item.minLength || undefined,
        max: item.max && item.max.value !== "" && item.max || undefined,
        min: item.min && item.min.value !== "" && item.min || undefined,
        pattern: item.pattern && item.pattern.value !== "" && item.pattern || undefined,
        required: item.required && item.required.value !== "" && item.required || undefined
    }

    const { validate = {} } = item?.rule || { validate: {} };

    if (item?.rule) {
        console.log("dyno ;)", validate, 'validate[', sharedItems?.localFunction)
        Object.keys(validate).forEach(key => {
            if (typeof validate[key] === "function") return;
            validate[key] = sharedItems?.localFunction[key](validate[key])({ ...sharedItems, getItem: () => item });
            console.log("dyno ;)", validate, 'validate[ within', validate[key])
        });
        console.log("dyno ;)", validate, 'validate[ after')
    }


    // let rule = _.cloneDeep(item?.rule || {});
    // debugger;
    // rule.pattern?.value = new RegExp(item.rule?.pattern?.value);

    result = (
        <Controller
            key={item.isArray === true && `${name}container` || name}
            name={item.isArray === true && `${name}container` || name}
            control={control}
            item={{...item, index}}
            rules={{ ...item.rule } || validation}
            // eventBus={sharedItems?.eventBus}
            render={({ field }) => {

                if (item.isArray) {
                    console.log("dyno ;)", name, item.items, "useFieldArray")
                    const { fields, append, remove } = useFieldArray({
                        control,
                        name: name,
                        rules: { ...item.rule } || validation
                    });

                    child =
                        <div>
                            <ul>
                                {fields.map((el, index) => (
                                    <li key={el.id}>
                                        {item.items.map((element, indx) => (
                                            <Controller
                                                key={`${name}.${index}.${data[element].name}`}
                                                name={`${name}.${index}.${data[element].name}`}
                                                control={control}
                                                render={({ field }) => {
                                                    console.log("dyno ;)", `${name}.${index}.${element}`, '`${name}.${index}.${element}`')
                                                    return renderComponentInd(element, {...data, index}, {
                                                        updateReference,
                                                        myControl,
                                                        getValue,
                                                        errors,
                                                        ControlledComponents,
                                                        components,
                                                        managedCallback,
                                                        parentName: item?.items && name || undefined,
                                                        sharedItems: {
                                                            ...sharedItems,
                                                            // fields,
                                                            append,
                                                            remove: () => remove(index)
                                                        },
                                                        index: index,
                                                        data,
                                                        parent: { name: item.name, index, id: item.id },
                                                        givenName: `${name}.${index}.${data[element].name}`,
                                                        dataTransformer
                                                    })

                                                    const Component = components(element.type, {
                                                        field,
                                                        item: element,
                                                        name: `${name}.${index}.${element.name}`,
                                                        indx,
                                                        managedCallback,
                                                        child,
                                                        useFieldArray
                                                    })
                                                    return Component
                                                }}
                                            />
                                        ))}
                                        <button type="button" onClick={() => remove(index)}>-</button>
                                    </li>
                                ))}

                            </ul>
                            {/* <button type="button" onClick={() => {
                                        control.unregister("textbox-10")
                                        console.log("dyno ;)", getValue(), "unregisterrrr")
                                    }}> unregister 10 now ;) </button> */}

                            {/* <button type="button" onClick={() => setValue("textbox-9", { hi: "wowwwwww" })}> Change 9 now ;) </button> */}
                            <button
                                type="button"
                                // onClick={() => append({ "actionURL": "" })}
                                onClick={() => append({})}

                            >
                                +
                            </button>
                        </div>
                }

                // //proxy here ;)
                // const proxyHandler = {
                //     get(target, prop, receiver) {
                //         if (typeof target[prop] === "object" && target[prop] !== null) {
                //             console.log("dyno ;)", target[prop], "proxyHanlerrrrrrrr me ;)");
                //             return new Proxy(target[prop], proxyHandler);
                //         }
                //         return dataTransformer(target[prop], prop, target)({
                //             ...sharedItems.localFunction,
                //             sharedItems: sharedItems,
                //             // ...sharedItems
                //         });
                //     }
                // };

                // const proxyItem = new Proxy({
                //     ...item,
                //     sharedItems: sharedItems
                // }, proxyHandler);


                //end of proxy


                const Component = components(item.type, {
                    field,
                    // item: proxyItem,//item,
                    item,
                    name,
                    index,
                    managedCallback,
                    child,
                    useFieldArray,
                    error: errors,
                    sharedItems,
                    parent
                })

                return Component
            }}

        />
    )

    //     return result
    // })
    //console.timeEnd('renderFormmm')
    return result
}

const renderForm = (
    data,
    updateReference,
    myControl,
    getValue,
    errors,
    ControlledComponents,
    components,
    managedCallback,
    parentName,
    sharedItems,
    setValue
) => {
    console.log("dyno ;)", errors, 'dataerrors')
    //console.time('renderFormmm')
    const r = data
        .filter((element) => element.visible)
        .map((item, index) => {
            // console.log("dyno ;)", item, "ittttem")

            const {
                register,
                handleSubmit,
                watch,
                errors,
                control,
                trigger,
                setFocus,
                getValues,
                setValue,
                useFieldArray,
                useWatch,
                triggerBackground
            } = sharedItems

            // if (!item.visible) return null
            const name = parentName && `${parentName}.${item.name}` || item.name

            let result = null
            let child = []
            if (item.items) {
                child = renderForm(
                    item.items,
                    updateReference,
                    myControl,
                    getValue,
                    errors,
                    ControlledComponents,
                    components,
                    managedCallback,
                    item?.items && name || undefined,
                    sharedItems,
                    setValue
                )
            }

            const validation = {
                maxLength: item.maxLength && item.maxLength.value !== "" && item.maxLength || undefined,
                minLength: item.minLength && item.minLength.value !== "" && item.minLength || undefined,
                max: item.max && item.max.value !== "" && item.max || undefined,
                min: item.min && item.min.value !== "" && item.min || undefined,
                pattern: item.pattern && item.pattern.value !== "" && item.pattern || undefined,
                required: item.required && item.required.value !== "" && item.required || undefined
            }
            // console.log("dyno ;)", "validationValidation", validation)

            // if (!item.visible) return null

            // const name = parentName && `${parentName}.0.${item.name}` || item.name
            // console.log("dyno ;)", name, "namename")
            result = (
                <Controller
                    key={item.isArray === true && `${name}container` || name}
                    name={item.isArray === true && `${name}container` || name}
                    control={control}
                    item={item}
                    rules={item.rule || validation}
                    // eventBus={sharedItems?.eventBus}
                    render={({ field }) => {

                        if (item.isArray) {
                            // console.log("dyno ;)", name, "useFieldArray")
                            const { fields, append, remove } = useFieldArray({
                                control,
                                name: name
                            });

                            // const myaCondition = useWatch({
                            //     control,
                            //     name: 'textbox-0.test.0.firstName', // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
                            //     defaultValue: undefined // default value before the render
                            // });
                            // console.log("dyno ;)", myaCondition, "myaCondition", getValue("textbox-3"))
                            child =
                                <div>
                                    {/* <>
                                        {`${item.name}`}
                                        <br />
                                        <input {...field} />
                                        {errors && errors[item.name] && `${item.name} errororrr`}
                                        {child && child}
                                        <br />
                                        <br />
                                        <br />
                                    </> */}
                                    <ul>
                                        {fields.map((el, index) => (
                                            <li key={el.id}>
                                                {item.items.map((element, indx) => (
                                                    <Controller
                                                        name={`${name}.${index}.${element.name}`}
                                                        control={control}
                                                        render={({ field }) => {
                                                            const Component = components(element.type, {
                                                                field,
                                                                item: element,
                                                                name: `${name}.${index}.${element.name}`,
                                                                indx,
                                                                managedCallback,
                                                                child,
                                                                useFieldArray
                                                            })
                                                            return Component
                                                        }}
                                                    />
                                                ))}
                                                <button type="button" onClick={() => remove(index)}>-</button>
                                            </li>
                                        ))}

                                    </ul>
                                    {/* <button type="button" onClick={() => {
                                        control.unregister("textbox-10")
                                        console.log("dyno ;)", getValue(), "unregisterrrr")
                                    }}> unregister 10 now ;) </button> */}

                                    {/* <button type="button" onClick={() => setValue("textbox-9", { hi: "wowwwwww" })}> Change 9 now ;) </button> */}
                                    <button
                                        type="button"
                                        // onClick={() => append({ "actionURL": "" })}
                                        onClick={() => append({})}

                                    >
                                        +
                                    </button>
                                </div>

                        }

                        const Component = components(item.type, {
                            field,
                            item,
                            name,
                            index,
                            managedCallback,
                            child,
                            useFieldArray,
                            error: errors,
                            sharedItems
                        })

                        return Component
                    }}

                />
            )

            return result
        })
    //console.timeEnd('renderFormmm')
    return r
}

// where is item
// need 1st render recursive
// -> DFS & flat => ref for each field
// preCondition -> array(store) - flat, value -> set?
// leftIconA => 7
// _.set({}, "b.c.d")

const convertIdToRef = (array, key, name, parent, isArray) => {
    // const initialValue = {};
    // const initialValue = new Map();
    const result = array.reduce((obj, item, currentIndex) => {
        // TODO: remove console comment ;)
        const itemName = isArray === undefined && item[key] || `${parent}.0.${item[key]}`
        // console.log("dyno ;)", name, 'convertIdToRefconvertIdToRef', item, name, parent, itemName, isArray)

        const refId = (name && `${name}.items[${currentIndex}]`) || `[${currentIndex}]`
        return {
            ...obj,
            // [item[key]]: { ...item, refId: name && `${name}.items[${currentIndex}]` || item.name },
            [itemName]: {
                ...item,
                name: itemName,
                refId,
                ...(parent && { parent }),
            },
            // ...(item.items !== undefined && convertIdToRef(item.items, "name", item.name)),`[${currentIndex}]`
            ...(item.items !== undefined && convertIdToRef(item.items, 'name', refId, item[key], item.isArray)),
        }
    }, new Map())

    return result
}

const resetItems = (array, key, name, parent) => {
    // const initialValue = {};
    // const initialValue = new Map();
    const result = array.reduce((obj, item, currentIndex) => {
        // TODO: remove console comment ;)
        // console.log("dyno ;)", name, 'convertIdToRefconvertIdToRef', item, name, parent)
        const refId = (name && `${name}.items[${currentIndex}]`) || `[${currentIndex}]`
        return {
            ...obj,
            // [item[key]]: { ...item, refId: name && `${name}.items[${currentIndex}]` || item.name },
            [item[key]]: {
                ...item,
                refId,
                value: "",
                ...(parent && { parent }),
            },
            // ...(item.items !== undefined && convertIdToRef(item.items, "name", item.name)),`[${currentIndex}]`
            ...(item.items !== undefined && convertIdToRef(item.items, 'name', refId, item[key])),
        }
    }, new Map())

    return result
}

const convertIdToRefV2 = (array, key, name) => {
    // const initialValue = {};
    const initialValue = new Map()
    const result = array.reduce((obj, item, currentIndex) => {
        // TODO: remove console comment ;)
        // console.log("dyno ;)", name, "convertIdToRefconvertIdToRef", item)
        const refId = (name && `${name}.items[${currentIndex}]`) || item[key] // `[${currentIndex}]`;
        return {
            ...obj,
            // [item[key]]: { ...item, refId: name && `${name}.items[${currentIndex}]` || item.name },
            [item[key]]: { ...item, refId },
            // ...(item.items !== undefined && convertIdToRef(item.items, "name", item.name)),`[${currentIndex}]`
            ...(item.items !== undefined && convertIdToRef(item.items, 'name', refId)),
        }
    }, new Map())

    return result
}

const prepareWtchingComponents = (items, key) => {
    // const initialValue = {};
    // //console.time('prepareWtchingComponents')
    const initialValue = new Map()

    Object.keys(items).forEach((key) => {
        if (items[key].watch) {
            initialValue.set(items[key].name);//POC only
        }
        if (items[key].preCondition) {
            const preConditionObj = convertArrayToObject(items[key].preCondition, 'value')

            // const thisShitIsBananas = items[key].preCondition.reduce((accumulator, fruit) => {
            //     return accumulator.concat(fruit.value);
            // }, []);
            // console.log("dyno ;)", items[key], "prepareWtchingComponents", Object.values(preConditionObj), '----===----', preConditionObj)
            const keys = Object.keys(preConditionObj)
            for (let index = 0; index < keys.length; index++) {
                const internalItem = preConditionObj[keys[index]]
                console.log("dyno ;)", items[key], 'items[key]')
                initialValue.set(internalItem.name, [
                    ...((initialValue.get(internalItem.name) && initialValue.get(internalItem.name)) || []),
                    { refId: items[key].id, ...internalItem },
                ])
            }
            // keys.forEach( e => {
            //     // initialValue[preConditionObj[e].name] = [
            //     //     // ...(initialValue[preConditionObj.name] && initialValue[preConditionObj.name] || []),
            //     //     ...(initialValue[preConditionObj[e].name] && initialValue[preConditionObj[e].name] || []),
            //     //     // {refId: items[key].refId, ...preConditionObj  }
            //     //     {refId: items[key].refId, ...preConditionObj[e] }
            //     // ];
            //     initialValue.set(preConditionObj[e].name, [
            //         // ...(initialValue[preConditionObj.name] && initialValue[preConditionObj.name] || []),
            //         ...(initialValue.get(preConditionObj[e].name) && initialValue.get(preConditionObj[e].name) || []),
            //         // {refId: items[key].refId, ...preConditionObj  }
            //         {refId: items[key].refId, ...preConditionObj[e] }
            //     ]);
            //     // console.log("dyno ;)", thisShitIsBananas, "prepareWtchingComponentsYY ---->", initialValue.get(preConditionObj[e].name),initialValue)

            // })

            // initialValue[preConditionObj.name] = [
            // initialValue[items[key].preCondition.name] = [
            //     // ...(initialValue[preConditionObj.name] && initialValue[preConditionObj.name] || []),
            //     ...(initialValue[items[key].preCondition.name] && initialValue[items[key].preCondition.name] || []),
            //     // {refId: items[key].refId, ...preConditionObj  }
            //     {refId: items[key].refId, ...items[key].preCondition }
            // ];
        }
    })
    //console.timeEnd('prepareWtchingComponents')
    return initialValue
}

const convertArrayToObject = (array, key, value) => {
    const initialValue = {}
    if (!Array.isArray(array)) return
    const givenArray = array.concat()
    return givenArray.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: (value && item[value]) || (value === undefined && item) || '',
        }
    }, initialValue)
}

const convertArrayToObjectPOC = (array, key, value, isParent, original) => {
    // //console.time("convertArrayToObjectPOC")
    const initialValue = {}
    const givenArray =
        (isParent && array.concat()) || array.filter((el) => el.parent === undefined).concat()

    const result = givenArray.reduce((obj, item) => {
        // console.log("dyno ;)", item, obj, "reducereduce", item[key], original[[item[key]]][value], original)

        return {
            ...obj,
            [item[key]]:
                (item.items && convertArrayToObjectPOC(item.items, key, 'value', true, original)) ||
                (isParent && original[[item[key]]][value]) ||
                (value && item[value]) ||
                (value === undefined && item) ||
                '',
        }
    }, initialValue)
    // //console.timeEnd("convertArrayToObjectPOC")
    return result
}

let renderCount = 0

function keysWithDoubleDollar(obj) {
    const result = [];

    function checkForKey(obj, path) {
        if (typeof obj === 'object') {
            if (Array.isArray(obj)) {
                obj.forEach((item, index) => {
                    checkForKey(item, `${path}[${index}]`);
                });
            } else {
                if(obj != undefined && obj != null){
                    Object.keys(obj).forEach(key => {
                        const newPath = path ? `${path}.${key}` : key;
                        checkForKey(obj[key], newPath);
                    });
                }
            }
        } else if (typeof obj === 'string' && (obj.includes('$$') || obj.includes('{{') || obj.includes('${'))) {
            result.push(path);
        }
    }

    checkForKey(obj, '');

    return result;
}

const FormBuilderNext = React.forwardRef(({ items,
    validationResolver,
    // = defaultValidationResolver,
    ControlledComponents,
    components,
    managedCallback,
    localFunction,
    shouldUnregister = true,
    defaultValues = {},
    devMode = false,
    dataTransformer = defaultDataTransformer,
    dataStore
    // eventBus
}, ref) => {

    if (!devMode) {
        console.log = (function () {
            const log = console.log;

            return function () {
                const args = Array.from(arguments);
                if (!args.includes("dyno ;)")) {
                    log.apply(console, args);
                }
            }
        })();
    }

    const neededKeys = keysWithDoubleDollar(defaultValues);
    console.log("dyno ;)", neededKeys, "[neededKeys]", defaultValues)

    //proxy here ;)
    const proxyHandler = {
        get(target, prop, receiver) {
            if (neededKeys.includes(prop)) {
                if (typeof target[prop] === "object" && target[prop] !== null) {
                    // console.log("dyno ;)", target[prop], "dddproxyHanlerrrrrrrr me ;)");
                    return new Proxy(target[prop], proxyHandler);
                }
                return dataTransformer(target[prop], prop, target)({
                    ...localFunction,
                    sharedItems: { dataStore },
                    // ...sharedItems
                });
            }
            return target[prop];
        }
    };

    const proxyDefaultValues = new Proxy({
        ...defaultValues
    }, proxyHandler);

    console.log("dyno ;)", defaultValues, "defaultValues", { ...proxyDefaultValues }, dataStore)


    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty, isValid },
        control,
        trigger,
        setFocus,
        getValues,
        setValue,
        triggerBackground,
        triggerBackgroundOptimised,
        triggerCustom,
        unregister,
        clearErrors,
        reset
    } = useForm({
        mode: 'onChange',
        shouldUnregister: true,
        reValidateMode: 'onChange',
        // resolver: async (data, context) => {
        //     const { error, value: values } = validationSchema.validate(data, {
        //         abortEarly: false,
        //     });

        //     if (!error) return { values: values, errors: {} };

        //     return {
        //         values: {},
        //         errors: error.details.reduce(
        //             (previous, currentError) => ({
        //                 ...previous,
        //                 [currentError.path[0]]: currentError,
        //             }),
        //             {},
        //         ),
        //     };
        // },,
        // criteriaMode: "firstError",
        defaultValues: { ...proxyDefaultValues }
    })

    React.useEffect(() => {
        reset({ ...proxyDefaultValues })
    }, [defaultValues]);

    // Shared Items
    const sharedItems = {
        register,
        handleSubmit,
        watch,
        errors,
        control,
        trigger,
        setFocus,
        getValues,
        setValue,
        useFieldArray,
        useWatch,
        triggerBackground,
        triggerBackgroundOptimised,
        unregister,
        localFunction: {
            ...localFunction,
            reset: reset,
            triggerBackground: () => !_.isEmpty(errors),
            getValues,
            triggerBackgroundOptimised: (formId) => {
                // console.log(triggerBackground(), 'triggerSyncBackground()')
                const result = triggerBackgroundOptimised(formId)().then(r => r);
                console.log('yasssss', result)
                return result;
            },
            triggerGroup: async (resources) => {
                const localErrors = await triggerBackgroundOptimised()(true);
                // if (!isValid) return true;

                // console.log(resources, errors, 'triggerreggirt',
                //     isDirty,
                //     '---=====----',
                //     isValid,
                //     localErrors
                // )
                let result = true;
                for (let i = 0; i < resources.length; i++) {
                    const item = resources[i];
                    const isItemExist = localErrors[item];
                    if (isItemExist) {
                        // console.log(item, '------>', 'triggerreggirt', errors[item], 'found', result)
                        result = false;
                        break;
                    }
                }
                // console.log('triggerreggirt ', result)
                return result;
            },
        },
        dataStore,
        // eventBus,
        clearErrors
    }
    // console.log("dyno ;)", typeof errors, 'hereeeeeeeeeerroooooors')

    const myComponents = React.useRef()
    // const errors = React.useRef({})
    const watchingComponents = React.useRef()
    const preConditionItems = React.useRef()


    const [data, setData] = useState()

    React.useEffect(() => {
        if (items === undefined) return

        // if(items !== data && data !== undefined){
        //     for (const [key, value] of Object.entries(data)) {
        //         unregister(value?.name);
        //     }
        // }


        //console.time('convertIdToRefffff')
        myComponents.current = items; // convertIdToRef(items, 'name')
        //console.timeEnd('convertIdToRefffff')
        watchingComponents.current = prepareWtchingComponents(myComponents.current)
        console.log("dyno ;)", myComponents, 'myComponentsmyComponents')
        console.log("dyno ;)", watchingComponents, 'prepareWtchingComponents', [...watchingComponents.current.keys()])

        const subscription = watch(async (value, { name, type }) => {
            //  For watch items
            //  Re-render watch items


            // has better than get ;)
            // if (watchingComponents.current.get(name)) {
            if (watchingComponents.current.get(name)) {
                const allValues = Object.assign(value, dataStore);
                console.log("dyno ;)", "origincheckPreCondition ;) checkPreCondition", value, name, type, data, items)
                // const [a, b] = await checkPreCondition(name, value[name], items);
                const [a, b] = await checkPreCondition(name, allValues[name], items);

                if (!deepEqual(data, b) && a) {
                    setData({ ...b });
                    return;
                }
            } else if (watchingComponents.current.has(name)) {
                console.log("dyno ;)", watchingComponents.current.has(name), "before checkPreCondition ;) checkPreCondition", value, name, type, { data }, items)
                setData({ ...items });
                return;
            }
        });

        setData(items)
    }, [items])

    const getValue = (name) => {
        return myComponents.current[name].value
    }

    const resetValues = () => {
        myComponents.current = resetItems(items, 'name');
        setData(items);
    }

    const onSubmit = (data) => {
        console.log("dyno ;)", "SUBMITFORM SUBMITFORM", data)
        return data;
    }

    const getValuesBackground = async () => {
        //TODO: hot fix for double validations
        if (Object.keys(errors).length > 0) return false;
        const result = await triggerBackgroundOptimised()(true) //trigger();
        console.log("dyno ;)", "SUBMITFORM SUBMITFORM result trigger", result, errors)
        if (_.isEmpty(result)) {
            return await getValues();
        } else {
            return false;
        }
    }

    const getValuesPOC = async (options = {triggerAll: false}) => {
        //TODO: hot fix for double validations
        if (Object.keys(errors).length > 0) return false;
        const result = await triggerCustom(options);
        console.log("dyno ;)", "SUBMITFORM SUBMITFORM result trigger", result, errors, options)
        if (result === true) {
            return await getValues();
        } else {
            return false;
        }
    }

    const getValuesWithoutValidation = async () => {
        return await getValues();
    }

    ref.current = {
        getValuesByGroup: async (props) => {
            const valid = await sharedItems.localFunction.triggerGroup(props);
            if (valid) {
                const result = await getValues();
                return result;
            }
            return valid;

        },
        getValues: (options) => getValuesPOC(options),
        getGroupValuesBackground: async (props) => {
            console.log(props, 'getValuesBackgroundgetValuesBackgroundgetValuesBackground')
            if (Array.isArray(props)) {
                const valid = await sharedItems.localFunction.triggerGroup(props);
                if (valid) {
                    const result = await getValues();
                    return result;
                }
                return valid;
            }
            return getValuesPOC();
        },
        getValuesBackground: async (validation = true) => {
            if (validation) {
                if (Object.keys(errors).length > 0) return false;
                const result = await triggerBackgroundOptimised()(true);
                console.log("dyno ;)", "SUBMITFORM SUBMITFORM result trigger", result, errors)
                if (_.isEmpty(result)) {
                    return await getValues();
                } else {
                    return false;
                }
            }
            const result = await getValues();
            return result;
        },
        resetValues: resetValues,
        setValue: setValue,
        errors: errors,
        reset,
        clearErrors,
        localFunction: sharedItems.localFunction
    }

    const validationOnce = async (name, value, result) => {
        //console.time('validationssss')
        const validatedItem = myComponents.current[name];
        let n = result
        const originalErrors = { ...errors.current } || {}
        const newErrors = errors.current || {}

        let error = false

        // if (item && item.visible) {
        if (value !== '') {
            const error = value === '313'
            if (error) {
                newErrors[name] = {
                    error,
                    errorMsg: validatedItem.errorMsg && validatedItem.errorMsg || '313 cant be here.',
                }
            } else {
                delete newErrors[name]
            }
            // n = _.set({ a: n }, `a${item.refId}.error`, error).a;
            // console.log("dyno ;)", "error", n, error, value)
        } else {
            delete newErrors[name]
        }
        // }

        errors.current = { ...newErrors } // {...errors.current ,...newErrors};
        // console.log("dyno ;)", "errorolo", errors.current, originalErrors, _.isEqual(originalErrors, newErrors))
        console.log("dyno ;)", errors, "errrrrrrrrr", newErrors,)
        if (error.current !== originalErrors) {
        }

        // setData([...n])

        // setData([...n])
        // Object.values(newC).forEach(element => {
        //     if(element.value){
        //         element["error"] = true;
        //         error = element.value !== "313";
        //     }
        // });
        // error && pubsub.publish('textbox-3', {error: Date.now()});

        //console.timeEnd('validationssss')
        return [!_.isEqual(originalErrors, newErrors), [...n], newErrors[name]]
    }

    const updateReference = async (value, name) => {

        //console.time('myComponentsFind')
        myComponents.current[name].value = value
        //console.timeEnd('myComponentsFind')

        console.log("dyno ;)", myComponents.current, 'getValues', await getValuesPOC())

        //console.time('iam here')
        const [hasValidationChanged, result, error] = await validationOnce(name, value, { ...data })
        const [hasPreconditionChanged, preResult] = await checkPreCondition(name, value, data)
        // console.log("dyno ;)", error, "asyncValidation", result, hasValidationChanged)

        if (hasValidationChanged === true || hasPreconditionChanged === true) {
            // if (hasPreconditionChanged === true) {

            console.log("dyno ;)",
                'lololololololololololoolol',
                hasValidationChanged,
                hasPreconditionChanged,
                errors,
            )
            setData({ ...preResult })
        }

        // console.log("dyno ;)", "getValues", await getValues())
        //console.timeEnd('iam here')
        // return [value, error]
    }

    const checkPreCondition = async (name, value, result) => {
        // const hasCondition = watchingComponents.current[name];
        const hasCondition = watchingComponents.current.get(name)

        console.log("dyno ;)", data, "checkPreConditionInside", name, myComponents.current, hasCondition, watchingComponents.current);

        // TODO: ;)
        // how to update the Array
        // OR update and don't iterate the Object
        // _.set({ a: myComponents.current }, "a.textbox-2.items[0].value", "leila")
        // let n = _.cloneDeep(result);
        let n = { ...result }

        let updated = false

        if (hasCondition !== undefined) {
            // for(let i = 0; i < hasCondition.length; i++){
            //     const touched = item.value == value;
            //         console.log("dyno ;)", "hashas", _.get({a:n},`a${item.refId}.visible` ))
            //         n = _.set({ a: n }, `a${item.refId}.visible`, touched).a;

            // }

            await hasCondition.map(async (item) => {
                const realValue = value && value["value"] || value;
                const touched = item?.type && (await validationResolver[item.type](item, realValue)) // || validationResolver["eq"](item,value); //value !== "" && item.value.includes(value) || false;
                // if(touched){
                // debugger
                // if (n[item.refId] && n[item.refId].visible !== touched) {
                //     n[item.refId].visible = touched;
                //     updated = true
                // }
                const i = n[item.refId];
                console.log("dyno ;)", n["accountNo"], "accountNoaccountNo", '-----', i)
                if (i !== undefined && i.visible !== touched) {
                    n[item.refId].visible = touched;
                    updated = true
                }
                // if (_.get({ a: n }, `a${item.refId}.visible`) !== touched) { //touched
                //     // myComponents.current[item.name].visible = touched;
                //     n = _.set({ a: n }, `a${item.refId}.visible`, touched).a
                //     updated = true
                //     console.log("dyno ;)", 
                //         'hashas',
                //         await _.get({ a: n }, `a${item.refId}.visible`),
                //         await touched,
                //         hasCondition,
                //         updated,
                //     )
                // }

                // }
            })
        }
        return [updated, n]
        return [updated, { ...n }]
    }

    console.log("dyno ;)", 'renderCount', renderCount++)

    return (
        (data && data.root?.items?.map((name, index) => renderComponentInd(name, data, {
            updateReference,
            myComponents,
            getValues,
            errors,
            ControlledComponents,
            components,
            managedCallback,
            undefined,
            sharedItems,
            index,
            dataTransformer
        })
        )) || null
    )


    return (
        (data &&
            renderForm(
                data,
                updateReference,
                myComponents,
                getValues,
                { ...errors },
                ControlledComponents,
                components,
                managedCallback,
                undefined,
                sharedItems,
                setValue
            ))
        ||
        null
    )
});

FormBuilderNext.whyDidYouRender = true
FormBuilderNext.displayName = "FormBuilderNext"

export default FormBuilderNext
