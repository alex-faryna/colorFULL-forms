import React, {Component, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import {Provider} from "react-redux";
import store from './store/index';
import {
    createBrowserRouter,
    createRoutesFromElements,
    redirect,
    Route,
    RouterProvider, Routes, useLocation, useMatch, useNavigate
} from "react-router-dom";
import TestsListPage from "./pages/tests-list.page";
import EditTestPage from "./pages/edit-test.page";
import {globalInjector} from "./services/global-injector.service";
import TestPage from './pages/test.page';
import LoginPage from "./pages/login.page";
import useAuthUser from "./hooks/auth-user.hook";
import TestResultsPage from "./pages/test-results.page";

export class RoutesConfig {
    public static root = '/';
    public static any = '*';
    public static tests = 'tests';
    public static test = `${RoutesConfig.tests}/:testId`; // for unauthorized users too
    public static edit = `${RoutesConfig.test}/edit`;
    public static stats = `${RoutesConfig.test}/stats`;
    public static login = `login`;
    // add stats mb page or mb in edit
}

const redirectFn = (to: string) => () => redirect(to);

function RequireAuth() {
    const [user, loading] = useAuthUser(globalInjector.authService);
    const path = useMatch(RoutesConfig.test);
    const navigate = useNavigate();

    useEffect(() => {
        if (!path && !loading && !user) {
            // console.log("HERE 2");
            navigate('/login',{ replace: true });
        }
    }, [path, loading, user]);

    return <App loadingUser={loading}/>
}

function NoAuth() {
    const [user] = useAuthUser(globalInjector.authService);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user]);

    return <LoginPage />
}


// stats of test too (mb in test)
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={RoutesConfig.root} Component={RequireAuth}>
            <Route path={RoutesConfig.login} Component={NoAuth} />
            <Route path={RoutesConfig.tests} Component={TestsListPage} />
            <Route path={RoutesConfig.edit} Component={EditTestPage}>
                <Route path={RoutesConfig.any} loader={redirectFn("") }></Route>
            </Route>
            <Route path={RoutesConfig.test} Component={TestPage}>
                <Route path={RoutesConfig.any} loader={redirectFn("") }></Route>
            </Route>
            <Route path={RoutesConfig.stats} Component={TestResultsPage}>
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
