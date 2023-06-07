import React from 'react';
import {useDispatch} from 'react-redux';
import {Outlet} from "react-router-dom";





function App() {
    const dispatch = useDispatch();

    // add header too for menu or smth
    return <>
        <Outlet />
    </>
}

export default App;
