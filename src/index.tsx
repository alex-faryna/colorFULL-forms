import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import {Provider} from "react-redux";
import store from './store/index';
import {createBrowserRouter, createRoutesFromElements, redirect, Route, RouterProvider} from "react-router-dom";

export class RoutesConfig {
    public static root = '/';
    public static any = '*';
    public static tests = 'tests';
    public static test = `${RoutesConfig.tests}/:testId`; // for unauthorized users too
    public static edit = `${RoutesConfig.test}/edit`;
}

const redirectFn = (to: string) => () => redirect(to);

function A() {
    return <span>A</span>
}

function B() {
    return <span>B</span>
}
function C() {
    return <span>C</span>
}



const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={RoutesConfig.root} Component={App}>
            <Route path={RoutesConfig.tests} Component={A} />
            <Route path={RoutesConfig.edit} Component={C}>
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
