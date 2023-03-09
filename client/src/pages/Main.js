import React, {useEffect, useState} from 'react';
import SpinnerSm from "../components/SpinnerSM";
import Categories from "./Categories";

const Main = () => {

    const [loading, setLoading] = useState(true)

    const [pageTitle, setPageTitle] = useState('')

    useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    useEffect(() => {
        setLoading(true)

        setPageTitle('Main')

        setLoading(false)
    }, [])

    if (loading) {
        return <SpinnerSm/>
    } else {

        return (
            <div>
                {/*<BaliInput labelText={'Name'}/>*/}
                <Categories presetPageTitle={'Main'}/>
            </div>
        );
    }
};

export default Main;