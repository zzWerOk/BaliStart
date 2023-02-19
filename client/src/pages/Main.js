import React, {useContext, useEffect, useState} from 'react';
import MainPageFeed from "../components/mainpage/MainPageFeed";
import {Context} from "../index";
import {delay} from "../utils/consts";
import {getAll} from "../http/topicsCategoryAPI";
import SpinnerSm from "../components/SpinnerSM";

const Main = () => {
    const {topicsCategoryStore} = useContext(Context)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)

        delay(0).then(() => {

            if (!topicsCategoryStore.loaded) {
                getAll(true).then(data => {
                    /**
                     Сохраняем список
                     **/
                    topicsCategoryStore.saveCategoriesList(data.rows)
                }).catch(() => {
                    topicsCategoryStore.saveCategoriesList([])
                }).finally(() => {

                })
            }

            setLoading(false)

        })
    }, [])

    if (loading) {
        return <SpinnerSm/>
    } else {

        return (
            <div>
                <MainPageFeed/>
            </div>
        );
    }
};

export default Main;