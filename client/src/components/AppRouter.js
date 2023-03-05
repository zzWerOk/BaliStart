import React, {useContext, useEffect} from 'react';
import {Route, Redirect, Switch, useHistory} from 'react-router-dom'
import {publicRoutes} from '../routes'
import {NOPAGE_ROUTE} from "../utils/consts";
import {Context} from "../index";

const AppRouter = () => {
    const {rightSideBarStore} = useContext(Context)

    const history = useHistory()

    useEffect(() => {
        history.listen(() => {
            rightSideBarStore.clear()
        })
    }, [])

    return (
        <div>
            <Switch>
                {publicRoutes.map(({path, Component}) => (
                        <Route key={path} path={path} component={Component} exact/>
                    )
                )}

                return <Redirect to={NOPAGE_ROUTE}/>

            </Switch>
        </div>
    );
};

export default AppRouter;