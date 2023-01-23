import React, {useContext, useEffect} from 'react';
import {Context} from "../index";

const ToursPage = () => {
    const {navBarTitle} = useContext(Context)

    useEffect(() => {
        navBarTitle.navBarTitle = 'Tours Page'
    }, [])

    return (
        <div>
            Tours PAGE
        </div>
    );
};

export default ToursPage;