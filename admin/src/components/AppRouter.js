import React, {useContext, useEffect} from 'react';
import {Switch, Route, Redirect, useLocation} from 'react-router-dom'
import {adminRoutes, authUserRoutes, publicRoutes} from '../routes'
import {AUTH_ROUTE, LOGIN_ROUTE, MAIN_ROUTE} from "../utils/consts";
import {Context} from "../index";

const AppRouter = () => {
    const {user} = useContext(Context)
    const location = useLocation()
    const {navBarTitle} = useContext(Context)

    useEffect(() => {
        navBarTitle.navBarLink = location.pathname
    }, [location.pathname])


    return (
        <Switch>
            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )}
            {user.isAdmin && adminRoutes.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )}
            {(user.isAuthUser || user.isAdmin) && authUserRoutes.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )}

            return <Redirect to={AUTH_ROUTE}/>

        </Switch>
    );
};

export default AppRouter;