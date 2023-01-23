import React, {useContext, useEffect} from 'react';
import {Context} from "../index";

const MapPointPage = () => {
    const {navBarTitle} = useContext(Context)

    useEffect(() => {
        navBarTitle.navBarTitle = 'Map Point Page'
    }, [])

    return (
        <div>
            MapPoint PAGE
        </div>
    );
};

export default MapPointPage;