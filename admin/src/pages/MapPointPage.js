import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import SpinnerSM from "../components/SpinnerSM";
import {getAll} from "../http/mapPointsAPI";
import {delay} from "../utils/consts";
import {getTableUpdateByName} from "../http/tableUpdatesAPI";

const MapPointPage = () => {
    const {navBarTitle} = useContext(Context)
    const {mapPointsStore} = useContext(Context)
    const [loading, setLoading] = useState(true)

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
            setLoading(false)
        })

    }

    useEffect(() => {
        navBarTitle.navBarTitle = 'Map Point Page'
        setLoading(true)

        delay(0).then(r => {

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


    if (loading) {
        return <SpinnerSM/>
    } else {
        return (
            <div>
                MapPoint PAGE
            </div>
        );
    }
};

export default MapPointPage;