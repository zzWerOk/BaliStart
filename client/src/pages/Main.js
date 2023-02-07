import React, {useContext, useEffect, useState} from 'react';
import MainPageFeed from "../components/mainpage/MainPageFeed";
import {Context} from "../index";
import {delay} from "../utils/consts";
import {getTableUpdateByName} from "../http/tableUpdatesAPI";
import {getAll} from "../http/topicsCategoryAPI";
import SpinnerSm from "../components/SpinnerSM";

const Main = () => {
    // const {navBarTitle} = useContext(Context)
    const {topicsCategoryStore} = useContext(Context)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)

        delay(0).then(() => {

            getTableUpdateByName('TopicsCategory').then(tuData => {
                getAll(true).then(data => {
                    /**
                     Сохраняем список
                     **/
                    topicsCategoryStore.saveCategoriesList(data.rows)
                }).finally(() => {
                    // setItems_arr(topicsCategoryStore.itemsArr)
                })
                /**
                 Сохраняем дату последнего изменения таблицы
                 **/
                topicsCategoryStore.saveLastDateTableTopicsCategory(tuData.date)

            }).finally(() => {
                setLoading(false)
            })

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