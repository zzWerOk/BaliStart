import React, {useContext, useEffect} from 'react';
import {Context} from "../index";

const Registration = () => {
    const {navBarTitle} = useContext(Context)

    useEffect(() => {
        navBarTitle.navBarTitle = 'Registration Page'
    }, [])

    return (
        <div>
            Registration PAGE
        </div>
    );
};

export default Registration;