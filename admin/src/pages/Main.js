import React, {useContext, useEffect} from 'react';
import {Context} from "../index";

const Main = () => {
    const {navBarTitle} = useContext(Context)

    useEffect(() => {
        navBarTitle.navBarTitle = 'MAIN Page'
    }, [])

    return (
        <div>
            Main PAGE
        </div>
    );
};

export default Main;