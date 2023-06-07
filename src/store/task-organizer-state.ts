import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Sprint} from "../models/sprint.model";
import {Note, NoteStates} from "../models/note.model";

export interface Status {
    id: number;
    label: string;
}

export interface Epic {
    id: number;
    label: string;
    // description
}

export interface Tag {
    id: number;
    label: string;
}

// would need some rework when other pages are added, as sprint is just one of the state that can be stored here yk
// i would asy we need to store the tasks (even if in the http the come with the sprint) and the sprint separately
export type TaskOrganizerState = {
    loading: 'idle' | 'loading' | 'error' | 'loaded',
    statues: Status[],
    epics: Epic[],
    sprints: Sprint[],
    notes: Note[],
};

const initialState: TaskOrganizerState = {
    loading: 'idle',
    statues: [],
    epics: [],
    sprints: [],
    notes: [],
};

// remove

const statuses = [
    { id: 0, label: 'To Do'},
    { id: 1, label: 'In Progress'},
    { id: 2, label: 'Test'},
    { id: 3, label: 'Done'}
];
const epics = [
    { id: 0, label: 'Main'},
    { id: 1, label: 'Bugs'}
];
const sprint = {
    id: 0,
    tasks: {
        0: {
            0: [
                {
                    id: 0,
                    title: 'Test task 1'
                }
            ],
            1: [
                {
                    id: 1,
                    title: 'Test task 2'
                }
            ],
        },
        1: {
            1: [
                {
                    id: 3,
                    title: 'Test task 3'
                }
            ],
            3: [
                {
                    id: 4,
                    title: 'Test task 4'
                },
                {
                    id: 5,
                    title: 'Test task 5'
                }
            ]
        },
    }
}

export interface DragLocationData {
    epic: number;
    status: number;
    idx: number;
}

// immer.js under the hood
export const organizerSlice = createSlice({
    name: 'organizer',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = 'loading';
        },
        setError: (state) => {
            state.loading = 'error';
        },
        stubDataLoaded: (state) => {
            state.epics = epics;
            state.statues = statuses;
            state.sprints = [sprint];
            state.loading = 'loaded';

            state.notes = [
                {
                    id: 0,
                    title: 'Note 1',
                    content: 'Content 1',
                    state: NoteStates.LOADING,
                },
                {
                    id: 1,
                    title: 'Note 2',
                    content: 'Content 2',
                    state: NoteStates.LOADING,
                },
                {
                    id: 2,
                    title: 'Note 3',
                    content: 'Content 3',
                    state: NoteStates.LOADING,
                }
            ];
        },
        taskCreated: (state, { payload }: PayloadAction<{ color: string }>) => {
            state.notes = [
                {
                    id: state.notes.length,
                    title: `New note ${state.notes.length}`,
                    content: '',
                    color: payload.color,
                    state: NoteStates.CREATING,
                },
                ...state.notes,
            ];
        },
    },
});

export const { setLoading, setError, stubDataLoaded, taskCreated } = organizerSlice.actions;

export default organizerSlice.reducer;
