import { useMemo, useState } from "react";
import _ from "lodash";

const rebuildHistory = (history = {}, to = 0, from = 0) => {
    const newHistory = [...history].slice(from, to);
    console.log('rebuildHistory', newHistory, to)
    return new Set(newHistory);
}

export default function useHistory(init = { name: "" }) {

    const [states, setStates] = useState(init);

    //history
    const [history, updateHistory] = useState(new Set());
    const [index, setIndex] = useState(0);
    const [currentPage, updateCurrentPage] = useState(init?.name);

    const state = useMemo(() => states[currentPage], [index, currentPage]);
    // const state = useMemo(() => states[init?.name], [states, init.name]);

    // {
    //     "dashboard": { }
    // }

    const setState = (value) => {
        if (value === undefined || value === null || value === {}) return;
        // check the existing one with name
        // { name: "pageName" }
        const pageName = value.name;

        const existing = _.get(states, pageName);

        // check whether equal or it changed ;)
        if (history.has(pageName)) {
            // if (_.isEqual(existing, value)) {
            // const existingPage = _.get(states,pageName);
            // const newHistory = [...history].slice(0,existing["x-index"]);
            const newHistory = rebuildHistory(history, existing["x-index"]);
            updateHistory(newHistory)

            const copy = _.cloneDeep(_.set(states, pageName, { ...value, "x-index": existing["x-index"] }));
            setStates(copy);

            // updateHistory(new Set(newHistory));
            setIndex(existing["x-index"])
            updateCurrentPage(pageName);

            console.log("lolllllllllllllllllll", history, '99999', existing["x-index"], newHistory);
            return;
        }
        console.log("histlori", value, _.set(states, pageName, value), state, history.size)
        const newIndex = index + 1;
        const copy = _.cloneDeep(_.set(states, pageName, { ...value, "x-index": newIndex }));
        // setIndex(pageName);
        setIndex(newIndex);
        // copy = _.set(copy,value.name, value);
        updateHistory(history.add(pageName));
        setStates(copy);
        updateCurrentPage(pageName);
        console.log('hissssstory', history)
        console.log(value, 'drooooomemppppppphistlori', existing)
        console.log(states, '31231232323132', state, currentPage, _.isEqual(existing, value))
    }

    const setStateOld = (value) => {
        if (_.isEqual(state, value)) {
            return;
        }
        const copy = _.cloneDeep(states);
        copy.length = index + 1;
        copy.push(value);
        setStates(copy);
        setIndex(copy.length - 1);
        console.log(states, 'drooooomemppppppp', _.isEqual(state, value), copy, index)
    };

    const resetState = (init = { name: "" }) => {
        setIndex(0);
        setStates({});
        updateHistory([])
        console.log(":::::resetState", history, states, index)
    };

    const goBack = (steps = 1, reset = false) => {
        if(Number(steps)){
            goBackByIndex(steps, reset);
            return;
        }
        console.log('gobackbyname', steps)
        if(!states[steps]){
            throw "gobackbyname is not available ;)";
        }
        goBackByName(steps, reset);
    }


    const goBackByIndex = (steps = 1, reset = false) => {
        console.log(steps, 'stepsssssss')
        const newIndex = Math.max(0, Number(index) - (Number(steps) || 1));
        const previousPageName = Object.keys(states)[newIndex - 1];
        // setIndex(Math.max(0, Number(index) - (Number(steps) || 1)));
        console.log(Math.max(0, Number(index) - (Number(steps) || 1)), 'drooooomempppppppdrooooo45678mempppppppdrooooomemppppppp', index, previousPageName, states[previousPageName])
        updateCurrentPage(previousPageName);
        setIndex(newIndex);
        if (reset) {
            const existingPage = _.get(states, previousPageName);
            const newHistory = rebuildHistory(history, newIndex);
            // let copy = {}
            // newHistory.map(page => copy = _.set(copy, states[page]))
            // setStates(copy);
            updateHistory(newHistory)
            console.log(
                previousPageName,
                newIndex,
                'resetHardddddddd',
                history,
                newHistory,
                existingPage["x-index"],
                // copy
            )
        }
    };

    const goBackByName = (steps = 1, reset = false) => {
        console.log(steps, 'stepsssssss')
        const existingPage = _.get(states, steps);


        const newIndex = Math.max(0, Number(index) - (Number(steps) || 1));
        const previousPageName = Object.keys(states)[newIndex - 1];
        // setIndex(Math.max(0, Number(index) - (Number(steps) || 1)));
        console.log(Math.max(0, Number(index) - (Number(steps) || 1)), 'drooooomempppppppdrooooo45678mempppppppdrooooomemppppppp', index, previousPageName, states[previousPageName])
        updateCurrentPage(previousPageName);
        setIndex(newIndex);
        if (reset) {
            const existingPage = _.get(states, previousPageName);
            const newHistory = rebuildHistory(history, newIndex);
            // let copy = {}
            // newHistory.map(page => copy = _.set(copy, states[page]))
            // setStates(copy);
            updateHistory(newHistory)
            console.log(
                previousPageName,
                newIndex,
                'resetHardddddddd',
                history,
                newHistory,
                existingPage["x-index"],
                // copy
            )
        }
    };

    const goForward = (steps = 1) => {
        setIndex(Math.min(states.length - 1, Number(index) + (Number(steps) || 1)));
    };

    const updatePage = (value) => {
        const existing = _.get(states, currentPage);
        existing.defaultValues = { ...value };
        console.log(value, 'updatePage youuuuupppp', existing)
    }

    return {
        state: state,
        setState: setState,
        resetState: resetState,
        currentPage,
        index: index,
        lastIndex: states?.length - 1 || 0,
        goBack: goBack,
        goForward: goForward,
        updatePage: updatePage,
        history
    };
}