import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Test} from "../models/test.model";

// would need some rework when other pages are added, as sprint is just one of the state that can be stored here yk
// i would asy we need to store the tasks (even if in the http the come with the sprint) and the sprint separately
export type TestsState = {
    loading: 'idle' | 'loading' | 'error';
    // user or smth
    tests: Test[];
};

const initialState: TestsState = {
    loading: 'idle',
    tests: [],
};


// immer.js under the hood
export const testsSlice = createSlice({
    name: 'organizer',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = 'loading';
        },
        setLoadingError: (state) => {
            state.loading = 'error';
        },
        stubDataLoaded: (state) => {

        },
        testAdded: (state, { payload }: PayloadAction<{ color: string }>) => {

        },
    },
});

export const { setLoading, setLoadingError, stubDataLoaded, testAdded } = testsSlice.actions;

export default testsSlice.reducer;
