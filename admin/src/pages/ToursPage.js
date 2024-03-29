import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import SpinnerSM from "../components/SpinnerSM";
import {getAll} from "../http/toursAPI";
import {delay} from "../utils/consts";
import TopicsList from "../components/topics/TopicsList";
import ToursCategories from "../components/ToursCategories";
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

            }
        }).finally(() => {
            toursStore.loadToursList()
            setLoading(false)
        })
    }

    useEffect(() => {
        delay(0).then(() => {

            getAllData()

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
                                <div style={{display: 'flex'}}>
                                    <ToursCategories tagType={'categories'}/>
                                    <ToursCategories tagType={'types'}/>
                                </div>
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