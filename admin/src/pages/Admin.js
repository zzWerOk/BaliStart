import React, {useContext, useEffect} from 'react';
import {Context} from "../index";

const Admin = () => {
    const {navBarTitle} = useContext(Context)
    useEffect(() => {
        navBarTitle.navBarTitle ='Admin Page'
    }, [])

    return (
        <div>
            Admin PAGE
        </div>
    );
};

export default Admin;