import React, {useContext, useEffect} from 'react';
import {Context} from "../index";

const Login = () => {
    const {navBarTitle} = useContext(Context)

    useEffect(() => {
        navBarTitle.navBarTitle = 'Login Page'
    }, [])

    return (
        <div>
            Login PAGE
        </div>
    );
};

export default Login;