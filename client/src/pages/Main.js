import React, {useEffect} from 'react';
import MainPadeFeed from "../components/mainpage/MainPadeFeed";

const Main = () => {
    // const {navBarTitle} = useContext(Context)

    useEffect(() => {
        // navBarTitle.navBarTitle = 'MAIN Page'

    }, [])

    return (
        <div>
            <MainPadeFeed/>
        </div>
    );
};

export default Main;