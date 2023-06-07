import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Outlet} from "react-router-dom";
import {RootState} from './store';
import {setLoading} from "./store/tests-state";





function App() {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.tests);

    useEffect(() => {
        // dispatch(setLoading());
    }, []);

    console.log('render');
    return <>
        {
            // addd header here too
        }
        {
            {
                loading: <span>Loading</span>,
                error: <span>Error</span>,
                idle: <Outlet />
            }[state.loading]
        }
    </>
}

export default App;
