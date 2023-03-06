import React, {useEffect, useState} from 'react';
import SpinnerSm from "../components/SpinnerSM";
import Categories from "./Categories";

const Main = () => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)

        setLoading(false)
    }, [])

    if (loading) {
        return <SpinnerSm/>
    } else {

        return (
            <div>
                {/*<BaliInput labelText={'Name'}/>*/}
                <Categories/>
            </div>
        );
    }
};

export default Main;