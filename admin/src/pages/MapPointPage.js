import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import SpinnerSM from "../components/SpinnerSM";
import {getAll} from "../http/mapPointsAPI";
import {delay} from "../utils/consts";
import {getTableUpdateByName} from "../http/tableUpdatesAPI";
import MapPointsList from "../components/mappoints/MapPointsList";
import {getAllAgents} from "../http/agentAPI";
import ToursCategories from "../components/ToursCategories";

const MapPointPage = () => {
    const {navBarTitle} = useContext(Context)
    const {mapPointsStore, agentsStore} = useContext(Context)
    const [loading, setLoading] = useState(true)
    const [redraw, setRedraw] = useState(true)

    const getAllData = () => {
        setLoading(true)
        getAll().then(data => {

            if (data.hasOwnProperty('rows')) {

                mapPointsStore.saveMapPointsListRows(data.rows)

                /**
                 Сохраняем список пользователей преобразовав его в строку
                 **/
            }

        }).finally(() => {
            mapPointsStore.loadMapPointsList()

            getAllAgents().then(data => {

                if (data.hasOwnProperty('rows')) {

                    agentsStore.saveAgentsListRows(data.rows)

                }
            }).finally(() => {
                // agentsStore.loadAgentsList()
                setLoading(false)
            })

        })

    }

    useEffect(() => {
        navBarTitle.navBarTitle = 'Map Point Page'
        setLoading(true)

        delay(0).then(() => {

            getTableUpdateByName('MapPoints').then(tuData => {
                const lastDateTable = mapPointsStore.getSavedLastDateTableMapPoints()

                if (tuData.date !== lastDateTable) {
                    getAllData()
                    /**
                     Сохраняем дату последнего изменения таблицы
                     **/
                    mapPointsStore.saveLastDateTableMapPoints(tuData.date)
                } else {
                    mapPointsStore.loadMapPointsList()
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
            <>
                <div className={'pt-3'}>
                    <ToursCategories tagType={'types'}/>
                </div>

                <div>
                    <MapPointsList getAllData={getAllData} redrawPage={redrawPage}/>
                </div>
            </>
        )
    }
};

export default MapPointPage;