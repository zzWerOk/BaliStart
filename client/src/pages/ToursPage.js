import React, {useContext, useEffect, useState} from 'react';
import {delay} from "../utils/consts";
import SpinnerSm from "../components/SpinnerSM";
import FeedTopBar from "../components/mainpage/FeedTopBar";
import {getAllTours} from "../http/toursAPI";
import {getAllTours_Type} from "../http/toursTypeAPI";
import {getAll_ToursCat} from "../http/toursCategoryAPI";
import {Context} from "../index";
import FeedTour from "../components/mainpage/feed/Feed_Tour";

const ToursPage = (props) => {

    const {toursCategoryStore, toursTypeStore} = useContext(Context)

    const {id} = props

    const [loading, setLoading] = useState(true)
    const [loadingType, setLoadingType] = useState(true)
    const [loadingCat, setLoadingCat] = useState(true)
    const [toursList, setToursList] = useState([])

    useEffect(() => {
        setLoading(true)

        let tourId = id || null

        delay(0).then(() => {

            getAllTours(tourId).then(data => {
                if (data.hasOwnProperty('count')) {
                    if (data.hasOwnProperty('rows')) {
                        if (data.count > 0) {
                            setToursList(data.rows)
                        }
                    }
                }
            }).finally(() => {
                setLoading(false)
                getAllTours_Type().then(data => {

                    if (data.hasOwnProperty('count')) {
                        if (data.hasOwnProperty('rows')) {
                            if (data.count > 0) {
                                toursTypeStore.itemsArr = data.rows
                            }
                        }
                    }

                }).finally(() => {
                    setLoadingType(false)
                    getAll_ToursCat().then(data => {

                        if (data.hasOwnProperty('count')) {
                            if (data.hasOwnProperty('rows')) {
                                if (data.count > 0) {
                                    toursCategoryStore.itemsArr = data.rows
                                }
                            }
                        }

                    }).finally(() => {
                        setLoadingCat(false)
                    })
                })
            })

        })

    }, [])

    if (loading || loadingType || loadingCat) {
        return <SpinnerSm/>
    } else {

        return (<div>
                <div style={{marginTop: '20px'}}>

                    <FeedTopBar
                        isSearch={false}
                        isBackBtn={!!id}
                        backBtnTitle={'Back'}
                    />

                    {
                        toursList.length === 0
                            ?
                            <div //style={{marginTop: '20px'}}
                            >
                                <span>Нет записей</span>
                            </div>
                            :
                            <div
                                style={{height: 'calc(100vh - 129px', overflowX: 'hidden', overflowY: 'auto',}}
                            >
                                <ul
                                    className="list-group list-group-flush"
                                    style={{padding: '0 40px'}}
                                >
                                    {toursList.map(function (item, index) {
                                        return <FeedTour item={item} key={index}/>
                                    })}
                                </ul>
                            </div>
                    }

                </div>
            </div>
        );
    }
};

export default ToursPage;