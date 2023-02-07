import React, {} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import { publicRoutes} from '../routes'
import {NOPAGE_ROUTE} from "../utils/consts";

const AppRouter = () => {

    return (
        <div>
            <Switch>
                {publicRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} component={Component} exact/>
                )}

                return <Redirect to={NOPAGE_ROUTE}/>

            </Switch>
        </div>
    );
};

export default AppRouter;