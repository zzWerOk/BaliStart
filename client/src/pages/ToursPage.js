import React, {useContext, useEffect, useState} from 'react';
import {delay, sortTours} from "../utils/consts";
import SpinnerSm from "../components/SpinnerSM";
import FeedTopBar from "../components/mainpage/FeedTopBar";
import {getAllTours} from "../http/toursAPI";
import {getAllTours_Type} from "../http/toursTypeAPI";
import {getAll_ToursCat} from "../http/toursCategoryAPI";
import {Context} from "../index";
import FeedTour from "../components/mainpage/feed/Feed_Tour";

const ToursPage = () => {

    const {toursCategoryStore, toursTypeStore} = useContext(Context)

    // const {id} = props

    const [loading, setLoading] = useState(true)
    const [loadingType, setLoadingType] = useState(true)
    const [loadingCat, setLoadingCat] = useState(true)
    const [toursList, setToursList] = useState([])

    const [selectedSortCode, setSelectedSortCode] = useState('')
    const [isLoadingSorted, setIsLoadingSorted] = useState(true)
    const [sortCode, setSortCode] = useState('alpha')
    const [searchKey, setSearchKey] = useState('')

    useEffect(() => {
        setLoading(true)

        delay(0).then(() => {

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

                    const sortCode = localStorage.getItem("sort_code_Tours") || 'alpha'
                    setSelectedSortCode(sortCode)
                    setSortCode(sortCode)

                    getToursData(sortCode, searchKey)

                })
            })


        })

    }, [])

    const getToursData = (sortCode, searchKey) => {
        setIsLoadingSorted(true)

        getAllTours(sortCode, searchKey).then(data => {
            if (data.hasOwnProperty('count')) {
                if (data.hasOwnProperty('rows')) {
                    setToursList(JSON.parse(JSON.stringify(data.rows)))
                }
            }
        }).finally(() => {
            setLoading(false)
            setIsLoadingSorted(false)
        })

    }

    const setSortHandler = (value) => {

        setSortCode(value)
        localStorage.setItem("sort_code_Tours", value)
        getToursData(value, searchKey)
    }

    const setSearchHandler = (value) => {
        setSearchKey(value)
        getToursData(sortCode, value)
    }


    if (loading || loadingType || loadingCat) {
        return <SpinnerSm/>
    } else {

        return (<div>
                <div style={{marginTop: '20px'}}>

                    <FeedTopBar
                        isSearch={true}
                        setSearchHandler={setSearchHandler}
                        setSort={setSortHandler}
                        isLoading={isLoadingSorted}
                        selectedSortCode={selectedSortCode}
                        sortCodes={sortTours}
                    />

                    {
                        toursList.length === 0
                            ?
                            <div>
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
                                    {
                                        !isLoadingSorted
                                            ?
                                            toursList.map(function (item, index) {
                                                return <FeedTour item={item} key={index}/>
                                            })
                                            :
                                            null
                                    }
                                </ul>
                            </div>
                    }

                </div>
            </div>
        );
    }
};

export default ToursPage;