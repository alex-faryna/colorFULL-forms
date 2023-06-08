import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import {Provider} from "react-redux";
import store from './store/index';
import {createBrowserRouter, createRoutesFromElements, redirect, Route, RouterProvider} from "react-router-dom";
import TestsListPage from "./pages/tests-list.page";
import EditTestPage from "./pages/edit-test.page";

export class RoutesConfig {
    public static root = '/';
    public static any = '*';
    public static tests = 'tests';
    public static test = `${RoutesConfig.tests}/:testId`; // for unauthorized users too
    public static edit = `${RoutesConfig.test}/edit`;
    // add stats mb page or mb in edit
}

const redirectFn = (to: string) => () => redirect(to);


function B() {
    return <span>B</span>
}
function C() {
    return <span>C</span>
}


// stats of test too (mb in test)
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={RoutesConfig.root} Component={App}>
            <Route path={RoutesConfig.tests} Component={TestsListPage} />
            <Route path={RoutesConfig.edit} Component={EditTestPage}>
                <Route path={RoutesConfig.any} loader={redirectFn("") }></Route>
            </Route>
            <Route path={RoutesConfig.test} Component={B}>
                <Route path={RoutesConfig.any} loader={redirectFn("") }></Route>
            </Route>
            <Route path={RoutesConfig.root} loader={redirectFn(RoutesConfig.tests) } />
            <Route path={RoutesConfig.any} loader={redirectFn(RoutesConfig.tests) } />
        </Route>
    )
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
