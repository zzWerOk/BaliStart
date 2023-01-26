import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import SpinnerSM from "../components/SpinnerSM";
import {getAll} from "../http/toursAPI";
import {delay} from "../utils/consts";
import {getTableUpdateByName} from "../http/tableUpdatesAPI";
import TopicsList from "../components/topics/TopicsList";
import ToursCategories from "../components/ToursCategories";
import TopicListsCell from "../components/topics/TopicListsCell";
import TourListsCell from "../components/tours/TourListsCell";

const ToursPage = () => {
    const {toursStore, navBarTitle, user} = useContext(Context)
    const {toursCategoryStore} = useContext(Context)

    const [loading, setLoading] = useState(true)
    const [redraw, setRedraw] = useState(true)

    useEffect(() => {
        navBarTitle.navBarTitle = 'Tours Page'
    }, [])

    const getAllData = () => {
        setLoading(true)
        getAll().then(data => {

            if (data.hasOwnProperty('rows')) {

                toursStore.saveToursListRows(data.rows)

                /**
                 Сохраняем список пользователей преобразовав его в строку
                 **/
            }
        }).finally(() => {
            toursStore.loadToursList()
            setLoading(false)
        })
    }

    useEffect(() => {
        delay(0).then(r => {

            getTableUpdateByName('Tours').then(tuData => {
                const lastDateTable = toursStore.getSavedLastDateTableTours()

                if (tuData.date !== lastDateTable) {
                    getAllData()
                    /**
                     Сохраняем дату последнего изменения таблицы
                     **/
                    toursStore.saveLastDateTableTours(tuData.date)
                } else {
                    toursStore.loadToursList()
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
                <div>
                    {
                        user.isAdmin
                            ?
                            <div>
                                <ToursCategories/>
                                <TopicsList
                                    topicsStore={toursStore}
                                    categoriesStore={toursCategoryStore}
                                    getAllData={getAllData}
                                    redrawPage={redrawPage}
                                    ItemsListsCell={TourListsCell}
                                />
                            </div>
                            :
                            <div>
                                <TopicsList
                                    topicsStore={toursStore}
                                    categoriesStore={toursCategoryStore}
                                    getAllData={getAllData}
                                    redrawPage={redrawPage}
                                    ItemsListsCell={TourListsCell}
                                />
                            </div>
                    }
                </div>
            </div>
        );
    }
};

export default ToursPage;