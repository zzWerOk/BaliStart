import React, {useContext, useEffect} from 'react';
import {Context} from "../index";

const LogOut = () => {
    const {navBarTitle} = useContext(Context)

    useEffect(() => {
        navBarTitle.navBarTitle = 'Logout Page'
    }, [])

    return (
        <div>
            LogOut Page
        </div>
    );
};

export default LogOut;