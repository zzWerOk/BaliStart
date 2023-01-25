import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import TopicsCategories from "../components/TopicsCategories";
import SpinnerSM from "../components/SpinnerSM";
import {delay} from "../utils/consts";
import {getTableUpdateByName} from "../http/tableUpdatesAPI";
import {getAll} from "../http/topicsAPI";
import TopicsList from "../components/topics/TopicsList";

const ToursPage = () => {
    const {navBarTitle} = useContext(Context)
    const {topicsStore, user} = useContext(Context)
    const [loading, setLoading] = useState(true)
    const [redraw, setRedraw] = useState(true)

    useEffect(() => {
        navBarTitle.navBarTitle = 'Topics Page'
        setLoading(true)
    }, [])

    const getAllData = () => {
        setLoading(true)
        getAll().then(data => {

            if (data.hasOwnProperty('rows')) {

                topicsStore.saveTopicsListRows(data.rows)

                /**
                 Сохраняем список пользователей преобразовав его в строку
                 **/
            }
        }).finally(() => {
            topicsStore.loadTopicsList()
            setLoading(false)
        })
    }

    useEffect(() => {
        delay(0).then(r => {

            getTableUpdateByName('Topics').then(tuData => {
                const lastDateTable = topicsStore.getSavedLastDateTableTopics()

                if (tuData.date !== lastDateTable) {
                    getAllData()
                    /**
                     Сохраняем дату последнего изменения таблицы
                     **/
                    topicsStore.saveLastDateTableTopics(tuData.date)
                } else {
                    topicsStore.loadTopicsList()
                    setLoading(false)
                }

            })

        })
    }, [])

    const redrawPage = () => {
        setRedraw(!redraw)
    }

    if (loading) {
        return <SpinnerSM/>
    } else {

        return (
            <div>
                {
                    user.isAdmin
                        ?
                        <div>
                            <TopicsCategories/>
                            <TopicsList getAllData={getAllData} redrawPage={redrawPage}/>
                        </div>
                        :
                        <div>
                            <TopicsList getAllData={getAllData} redrawPage={redrawPage}/>
                        </div>
                }
            </div>
        )
    }
}

export default ToursPage;