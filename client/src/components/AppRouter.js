import React, {} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import { publicRoutes} from '../routes'
import { MAIN_ROUTE} from "../utils/consts";

const AppRouter = () => {
    // const location = useLocation()
    // const {navBarTitle} = useContext(Context)

    // useEffect(() => {
    //     navBarTitle.navBarLink = location.pathname
    // }, [location.pathname])


    return (
        <Switch>
            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )}

            return <Redirect to={MAIN_ROUTE}/>

        </Switch>
    );
};

export default AppRouter;