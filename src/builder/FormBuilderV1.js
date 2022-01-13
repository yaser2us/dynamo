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
} from "../useForm"
import {
    Controller
} from "../Controller"

// import { Subject, AsyncSubject } from 'rxjs'
// import pubsub from "./pubsub";
import _ from 'lodash'
// import { unitDependencies } from 'mathjs'
// import { getResetValue } from './utils/methods'
// import { JsonEditor } from 'jsoneditor-react/es'
// import { namespace } from 'store/dist/store.legacy'
import deepEqual from "../utils/deepEqual"
import { defaultValidationResolver } from "../utils/defaultValidationResolver"

// const subject = new Subject()

// export const pubsub = {
//     publish: (name, message) => subject.next(name, message),
//     clearMessages: () => subject.next(),
//     getMessage: () => subject.asObservable(),
// }

const useStateWithPromise = (initialState) => {
    const [state, setState] = useState(initialState)
    const resolverRef = useRef(null)

    useEffect(() => {
        if (resolverRef.current) {
            resolverRef.current(state)
            resolverRef.current = null
        }
        /**
         * Since a state update could be triggered with the exact same state again,
         * it's not enough to specify state as the only dependency of this useEffect.
         * That's why resolverRef.current is also a dependency, because it will guarantee,
         * that handleSetState was called in previous render
         */
    }, [resolverRef.current, state])

    const handleSetState = useCallback(
        (stateAction) => {
            setState(stateAction)
            return new Promise((resolve) => {
                resolverRef.current = resolve
            })
        },
        [setState],
    )

    return [state, handleSetState]
}

export const ControlledComponentsV2 = (props) => {
    // console.log('current', props.control.current);
    // if(props.control.current === undefined) return;
    const [field, setField] = useState(props.control.current && props.control.current[props.name])

    // console.log(props.name, "ControlledComponentsV2 renderrrrrrrrrr <1>", field, props.errors, props?.errors?.current && props?.errors?.current[props.name], props.name)
    console.log(
        props.name,
        'ControlledComponentsV2 renderrrrrrrrrr <1>',
        field,
        props.errors,
        props.name,
    )

    const titlellll = props.control.current['textbox-5'].value
    const error = props.errors && props.errors.current && props.errors?.current[props.name]

    const [fields, setFields] = useState('')



    const onChange = (value) => {
        // messageService.sendMessage(`${props.name}`);
        // pubsub.publish("anEvent", props.name);
        console.log('valuelavue', value)
        // const [newValue, error] = props.updateReference(value.target.value, props.name);

        // update(value);

        props.updateReference(value, props.name)
        setField({ ...field, value: value })
        // subscription(props)
    }

    // const subscription = pubsub.getMessage().subscribe((data) => {
    //     // console.log(`${props.name}, ControlledTextInput, message was published with this data: "${data}"`);

    //     if (props.name === 'textbox-0') {
    //         setFields(data)
    //     }
    // })

    return props.render({ onChange, value: field.value, field, error, index: props.index })
}

const IINNOMEMO = (props) => <ControlledComponentsV2 {...props} />

const IIN = React.memo(
    (props) => <ControlledComponentsV2 {...props} />,
    (prevProps, nextProps) => {
        // if (prevProps === nextProps) {
        const oldE = (prevProps.errors?.current && prevProps.errors?.current[prevProps.name]) || {}
        const newE = nextProps.errors?.current[nextProps.name] || {}

        const errror = _.isEqual(oldE, newE)
        const errrorlol = nextProps.errors?.current[prevProps.name]

        console.log(
            prevProps,
            nextProps,
            prevProps.name + ' ControlledComponentsV2 renderrrrrrrrrr <2>',
            errror,
            'is===',
            errrorlol,
            prevProps.name,
        )
        // if(!errror) return false;
        // return errror;
        // return errror;
        if (JSON.stringify(nextProps) === JSON.stringify(prevProps)) {
            return true // props are equal
        }
        return false // props are not equal -> update the component
    },
)

const createValidationObject = (item) => {


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
    console.log(errors, 'dataerrors')
    console.time('renderFormmm')
    const r = data
        .filter((element) => element.visible)
        .map((item, index) => {
            // console.log(item, "ittttem")

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
            // console.log("validationValidation", validation)

            // if (!item.visible) return null

            // const name = parentName && `${parentName}.0.${item.name}` || item.name
            // console.log(name, "namename")
            result = (
                <Controller
                    key={item.isArray === true && `${name}container` || name}
                    name={item.isArray === true && `${name}container` || name}
                    control={control}
                    item={item}
                    // defaultValue={"hi5"}
                    // { required: true, minLength: 5 }
                    rules={item.rule || validation}
                    render={({ field }) => {
                        // const myCondition = item.preCondition && useWatch({
                        //     control,
                        //     name: item.preCondition[0].name, // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
                        //     defaultValue: undefined // default value before the render
                        // });
                        // console.log(item.name, myCondition, "myConditionssss")
                        // if (!item.visible && myCondition !== "13333") return null


                        // return (
                        //     <>
                        //         {`${item.name}   ${name}`}
                        //         <br />
                        //         <input {...field} />
                        //         {errors && errors[name] && `${name} errororrr`}

                        //         {/* {errors && errors[item.name] && `${item.name} errororrr`} */}
                        //         {child && child}
                        //         <br />
                        //         <br />
                        //         <br />
                        //     </>
                        // )
                        // child && child;
                        // const { useFieldArray } = useFormContext()

                        if (item.isArray) {
                            // console.log(name, "useFieldArray")
                            const { fields, append, remove } = useFieldArray({
                                control,
                                name: name
                            });

                            // const myaCondition = useWatch({
                            //     control,
                            //     name: 'textbox-0.test.0.firstName', // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
                            //     defaultValue: undefined // default value before the render
                            // });
                            // console.log(myaCondition, "myaCondition", getValue("textbox-3"))
                            child =
                                <>
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
                                        console.log(getValue(), "unregisterrrr")
                                    }}> unregister 10 now ;) </button> */}

                                    {/* <button type="button" onClick={() => setValue("textbox-9", { hi: "wowwwwww" })}> Change 9 now ;) </button> */}
                                    <button
                                        type="button"
                                        // onClick={() => append({ "actionURL": "" })}
                                        onClick={() => append({})}

                                    >
                                        +
                                    </button>
                                </>

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
    console.timeEnd('renderFormmm')
    return r
}

const SimpleRender = props => renderForm({ ...props });
const MemoRenderForm = props => SimpleRender(props) //React.memo(renderForm, (prev, next)=>{
// console.log(prev,next,"memoRenderForm");
// })



const RenderForm = (
    data,
    updateReference,
    myControl,
    getValue,
    errors,
    ControlledComponents,
    components,
    managedCallback,
    parentName,
    control,
    setValue
) => {
    console.log(errors, 'dataerrors')
    console.time('renderFormmm')
    if (data === undefined) return null;
    const r = data
        .filter((element) => element.visible)
        .map((item, index) => {
            // console.log(item, "ittttem")

            // if (!item.visible) return null
            const name = parentName && `${parentName}.${item.name}` || item.name

            let result = null
            let child = []
            if (item.items) {
                child = RenderForm(
                    item.items,
                    updateReference,
                    myControl,
                    getValue,
                    errors,
                    ControlledComponents,
                    components,
                    managedCallback,
                    item?.items && name || undefined,
                    control,
                    setValue
                )
            }
            // if (!item.visible) return null



            // const name = parentName && `${parentName}.0.${item.name}` || item.name
            // console.log(name, "namename")
            result = (
                <Controller
                    key={name}
                    name={name}
                    control={control}
                    item={item}
                    // defaultValue={"hi5"}
                    // { required: true, minLength: 5 }
                    rules={item.rule || {}}
                    render={({ field }) => {
                        // const myCondition = item.preCondition && useWatch({
                        //     control,
                        //     name: item.preCondition[0].name, // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
                        //     defaultValue: undefined // default value before the render
                        // });
                        // console.log(item.name, myCondition, "myConditionssss")
                        // if (!item.visible && myCondition !== "13333") return null

                        // if (item.name === "textbox-0") {
                        //     const { fields, append, remove } = useFieldArray({
                        //         control,
                        //         name: "textbox-0.test"
                        //     });

                        //     // const myaCondition = useWatch({
                        //     //     control,
                        //     //     name: 'textbox-0.test.0.firstName', // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
                        //     //     defaultValue: undefined // default value before the render
                        //     // });
                        //     // console.log(myaCondition, "myaCondition", getValue("textbox-3"))
                        //     return (
                        //         <>
                        //             {/* <>
                        //                 {`${item.name}`}
                        //                 <br />
                        //                 <input {...field} />
                        //                 {errors && errors[item.name] && `${item.name} errororrr`}
                        //                 {child && child}
                        //                 <br />
                        //                 <br />
                        //                 <br />
                        //             </> */}
                        //             <ul>
                        //                 {fields.map((el, index) => (
                        //                     <li key={el.id}>
                        //                         <input {...control.register(`textbox-0.test.${index}.firstName`)} />
                        //                         {<Controller
                        //                             render={({ field }) => <input {...field} />}
                        //                             name={`textbox-0.test.${index}.lastName`}
                        //                             control={control}
                        //                         />}
                        //                         <button type="button" onClick={() => remove(index)}>Delete</button>
                        //                     </li>
                        //                 ))}
                        //             </ul>
                        //             {JSON.stringify(getValue("textbox-3"))}
                        //             <button type="button" onClick={() => {
                        //                 control.unregister("textbox-10")
                        //                 console.log(getValue(), "unregisterrrr")
                        //             }}> unregister 10 now ;) </button>

                        //             <button type="button" onClick={() => setValue("textbox-9", { hi: "wowwwwww" })}> Change 9 now ;) </button>
                        //             <button
                        //                 type="button"
                        //                 onClick={() => append({ firstName: "bill", lastName: "luo" })}
                        //             >
                        //                 append
                        //             </button>
                        //         </>
                        //     )
                        // }
                        // return (
                        //     <>
                        //         {`${item.name}   ${name}`}
                        //         <br />
                        //         <input {...field} />
                        //         {errors && errors[name] && `${name} errororrr`}

                        //         {/* {errors && errors[item.name] && `${item.name} errororrr`} */}
                        //         {child && child}
                        //         <br />
                        //         <br />
                        //         <br />
                        //     </>
                        // )

                        const Component = components(item.type, {
                            field,
                            item,
                            name,
                            index,
                            managedCallback
                        })
                        // console.log(Component, 'ControlledComponentsV2 renderrrrrrrrrr <3>', field.name)
                        return Component
                    }}

                />
                // <ControlledComponents
                //     managedCallback={managedCallback}
                //     updateReference={updateReference}
                //     // key={item.name}
                //     name={name}
                //     control={myControl}
                //     errors={errors}
                //     formName={'formName'}
                //     index={index}
                //     child={child}
                //     render={({ onUpdate, value, fields, field, error, index, child, managedCallback }) => {
                //         const Component = components(item.type, {
                //             onUpdate,
                //             value,
                //             fields,
                //             field,
                //             error,
                //             child,
                //             errors,
                //             item,
                //             index,
                //             managedCallback
                //         })
                //         console.log(Component, 'ControlledComponentsV2 renderrrrrrrrrr <3>', error, field.name)
                //         // return Component
                //         // return (
                //         //     <Component
                //         //         {...{ onUpdate, value, fields, field, error, child, errors, item, index }}
                //         //     />
                //         // )

                //         return <>
                //             <br />
                //             <div style={{ backgroundColor: child.length > 0 && "blanchedalmond" || "whitesmoke", padding: 11 }}>
                //                 <Input onChange={(e) => onUpdate(e.target.value)} defaultValue={value} value={value} />------{fields && fields.value}
                //                 {field.name}
                //                 {error && error.error && "Hiiiii i am here" || "no way ;)"}
                //             </div>
                //             {child.length > 0 && <div style={{ backgroundColor: "blanchedalmond", padding: 11 }}>
                //                 child ;)
                //                 {child && child}
                //             </div>}
                //         </>
                //     }}
                // />
            )

            return result
        })
    console.timeEnd('renderFormmm')
    return r
}
const InRenderform = React.memo(props => RenderForm(props),
    (prevProps, nextProps) => {
        if (!deepEqual(nextProps, prevProps)) {
            return true // props are equal
        }
        return false // props are not equal -> update the component
    },
)
InRenderform.displayName = "RenderForm"
InRenderform.whyDidYouRender = true

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
        // console.log(name, 'convertIdToRefconvertIdToRef', item, name, parent, itemName, isArray)

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
        // console.log(name, 'convertIdToRefconvertIdToRef', item, name, parent)
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
        // console.log(name, "convertIdToRefconvertIdToRef", item)
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
    // console.time('prepareWtchingComponents')
    const initialValue = new Map()

    Object.keys(items).forEach((key) => {
        if (items[key].preCondition) {
            const preConditionObj = convertArrayToObject(items[key].preCondition, 'value')

            // const thisShitIsBananas = items[key].preCondition.reduce((accumulator, fruit) => {
            //     return accumulator.concat(fruit.value);
            // }, []);
            // console.log(items[key], "prepareWtchingComponents", Object.values(preConditionObj), '----===----', preConditionObj)
            const keys = Object.keys(preConditionObj)
            for (let index = 0; index < keys.length; index++) {
                const internalItem = preConditionObj[keys[index]]
                initialValue.set(internalItem.name, [
                    ...((initialValue.get(internalItem.name) && initialValue.get(internalItem.name)) || []),
                    { refId: items[key].refId, ...internalItem },
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
            //     // console.log(thisShitIsBananas, "prepareWtchingComponentsYY ---->", initialValue.get(preConditionObj[e].name),initialValue)

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
    console.timeEnd('prepareWtchingComponents')
    return initialValue
}

// const convertArrayToObject = (array, key) => {
//     const initialValue = {};
//     return array.reduce((obj, item) => {
//         return {
//             ...obj,
//             [item[key]]: item,
//         };
//     }, initialValue);
// };

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
    // console.time("convertArrayToObjectPOC")
    const initialValue = {}
    const givenArray =
        (isParent && array.concat()) || array.filter((el) => el.parent === undefined).concat()

    const result = givenArray.reduce((obj, item) => {
        // console.log(item, obj, "reducereduce", item[key], original[[item[key]]][value], original)

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
    // console.timeEnd("convertArrayToObjectPOC")
    return result
}

let renderCount = 0
const FormBuilderV1 = React.forwardRef(({ items,
    validationResolver = defaultValidationResolver,
    ControlledComponents,
    components,
    managedCallback,
    defaultValues = {} }, ref) => {

    console.log(defaultValues, "defaultValues")

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control,
        trigger,
        setFocus,
        getValues,
        setValue,
        triggerBackground
    } = useForm({
        mode: 'onChange',
        // criteriaMode: 'all',
        // criteriaMode: "firstError",
        defaultValues
    })

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
        triggerBackground
    }

    const myComponents = React.useRef()
    // const errors = React.useRef({})
    const watchingComponents = React.useRef()
    const preConditionItems = React.useRef()


    const [data, setData] = useState()

    React.useEffect(() => {
        if (items === undefined) return

        console.time('convertIdToRefffff')
        myComponents.current = convertIdToRef(items, 'name')
        console.timeEnd('convertIdToRefffff')
        watchingComponents.current = prepareWtchingComponents(myComponents.current)
        console.log(myComponents, 'myComponentsmyComponents')
        console.log(watchingComponents, 'prepareWtchingComponents', [...watchingComponents.current.keys()])

        const subscription = watch(async (value, { name, type }) => {
            if (watchingComponents.current.get(name)) {
                // if(!Array.isArray(data)) return;
                console.log("checkPreCondition ;) checkPreCondition", value, name, type, data, items)
                const [a, b] = await checkPreCondition(name, value[name], items);
                if (!deepEqual(data, b) && a) {
                    setData([...b])
                    // preConditionItems.current = [...b];
                    return;
                }

            }
        });

        setData(items)
    }, items)

    // const watchingList = watch("textbox-2");

    // const watchingList = useWatch({
    //     control,
    //     name: "textbox-2", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
    //     // defaultValue: 'default' // default value before the render
    //   });
    // const watchingList = ""//watchingComponents.current && watch([...watchingComponents.current.keys()]);
    // const watchingList = watchingComponents.current && watch([...watchingComponents.current.keys()]);

    const getValue = (name) => {
        return myComponents.current[name].value
    }

    const resetValues = () => {
        myComponents.current = resetItems(items, 'name');
        setData(items);
    }

    const onSubmit = (data) => {
        console.log("SUBMITFORM SUBMITFORM", data)
        return data;
    }

    const getValuesPOC = async () => {
        //TODO: hot fix for double validations
        if (Object.keys(errors).length > 0) return false;
        const result = await trigger();
        console.log("SUBMITFORM SUBMITFORM result trigger", result, errors)
        if (result === true) {
            return await getValues();
        } else {
            return false;
        }
    }

    ref.current = {
        getValues: getValuesPOC,
        resetValues: resetValues
    }

    const validationOnce = async (name, value, result) => {
        console.time('validationssss')
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
            // console.log("error", n, error, value)
        } else {
            delete newErrors[name]
        }
        // }

        errors.current = { ...newErrors } // {...errors.current ,...newErrors};
        // console.log("errorolo", errors.current, originalErrors, _.isEqual(originalErrors, newErrors))
        console.log(errors, "errrrrrrrrr", newErrors,)
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

        console.timeEnd('validationssss')
        return [!_.isEqual(originalErrors, newErrors), [...n], newErrors[name]]
    }

    const updateReference = async (value, name) => {

        console.time('myComponentsFind')
        myComponents.current[name].value = value
        console.timeEnd('myComponentsFind')

        console.log(myComponents.current, 'getValues', await getValuesPOC())

        console.time('iam here')
        const [hasValidationChanged, result, error] = await validationOnce(name, value, [...data])
        const [hasPreconditionChanged, preResult] = await checkPreCondition(name, value, result)
        // console.log(error, "asyncValidation", result, hasValidationChanged)

        if (hasValidationChanged === true || hasPreconditionChanged === true) {
            // if (hasPreconditionChanged === true) {

            console.log(
                'lololololololololololoolol',
                hasValidationChanged,
                hasPreconditionChanged,
                errors,
            )
            setData([...preResult])
        }

        // console.log("getValues", await getValues())
        console.timeEnd('iam here')
        // return [value, error]
    }

    const checkPreCondition = async (name, value, result) => {
        // const hasCondition = watchingComponents.current[name];
        const hasCondition = watchingComponents.current.get(name)

        console.log(data, "checkPreConditionInside", name, myComponents.current, hasCondition, watchingComponents.current);

        // TODO: ;)
        // how to update the Array
        // OR update and dont itterate the Object
        // _.set({ a: myComponents.current }, "a.textbox-2.items[0].value", "leila")
        let n = [...result]

        let updated = false

        if (hasCondition !== undefined) {
            // for(let i = 0; i < hasCondition.length; i++){
            //     const touched = item.value == value;
            //         console.log("hashas", _.get({a:n},`a${item.refId}.visible` ))
            //         n = _.set({ a: n }, `a${item.refId}.visible`, touched).a;

            // }

            await hasCondition.map(async (item) => {
                const realValue = value["value"] || value;
                const touched = item?.type && (await validationResolver[item.type](item, realValue)) // || validationResolver["eq"](item,value); //value !== "" && item.value.includes(value) || false;
                // if(touched){
                if (_.get({ a: n }, `a${item.refId}.visible`) !== touched) { //touched
                    // myComponents.current[item.name].visible = touched;
                    n = _.set({ a: n }, `a${item.refId}.visible`, touched).a
                    updated = true
                    console.log(
                        'hashas',
                        await _.get({ a: n }, `a${item.refId}.visible`),
                        await touched,
                        hasCondition,
                        updated,
                    )
                }

                // }
            })
        }
        return [updated, [...n]]
    }

    console.log('renderCount', renderCount++)
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

FormBuilderV1.whyDidYouRender = true
FormBuilderV1.displayName = "FormBuilderV1"

export default FormBuilderV1
