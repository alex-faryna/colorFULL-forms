import {configureStore} from "@reduxjs/toolkit";
import testsReducer, {TestsState} from './tests-state'

export interface RootState {
    tests: TestsState,
}

const logger = (store: { getState: () => any; }) => (next: (arg0: any) => any) => (action: { type: any; }) => {
    console.group(action.type)
    console.info('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    console.groupEnd()
    return result
}

const store = configureStore({
    reducer: {
        tests: testsReducer,
    },
    // middleware: [logger],
});

export default store;
