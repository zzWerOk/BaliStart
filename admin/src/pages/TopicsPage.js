import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import TopicsCategories from "../components/TopicsCategories";
import SpinnerSM from "../components/SpinnerSM";
import {delay} from "../utils/consts";
import {getAll} from "../http/topicsAPI";
import TopicsList from "../components/topics/TopicsList";
import TopicListsCell from "../components/topics/TopicListsCell";

const TopicsPage = () => {
    const {topicsCategoryStore} = useContext(Context)

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

            }
        }).finally(() => {
            topicsStore.loadTopicsList()
            setLoading(false)
        })
    }

    useEffect(() => {
        delay(0).then(() => {

            // getTableUpdateByName('Topics').then(tuData => {
                    getAllData()
                    /**
                     Сохраняем дату последнего изменения таблицы
                     **/
                    // topicsStore.saveLastDateTableTopics(tuData.date)

            // })

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
                            <TopicsList
                                topicsStore={topicsStore}
                                categoriesStore={topicsCategoryStore}
                                getAllData={getAllData}
                                redrawPage={redrawPage}
                                ItemsListsCell={TopicListsCell}
                            />
                        </div>
                        :
                        <div>
                            <TopicsList
                                topicsStore={topicsStore}
                                categoriesStore={topicsCategoryStore}
                                getAllData={getAllData}
                                redrawPage={redrawPage}
                                ItemsListsCell={TopicListsCell}
                            />
                        </div>
                }
            </div>
        )
    }
}

export default TopicsPage;