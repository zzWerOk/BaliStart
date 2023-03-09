import React, {useEffect, useState} from 'react';
import TourMpCard from "../components/tours/TourMPCard";
import {getAllMP} from "../http/mapPointsAPI";
import FeedTopBar from "../components/mainpage/FeedTopBar";
import {Col} from "react-bootstrap";
import {sortMapPoints, } from "../utils/consts";

const MapPointsPage = () => {

    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])

    const [selectedSortCode, setSelectedSortCode] = useState('')
    const [isLoadingSorted, setIsLoadingSorted] = useState(true)
    const [sortCode, setSortCode] = useState('alpha')
    const [searchKey, setSearchKey] = useState('')

    const [pageTitle, setPageTitle] = useState('')

    useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    useEffect(() => {

        setPageTitle('Map points')

        setLoading(true)

        const sortCode = localStorage.getItem("sort_code_MapPoints") || 'alpha'
        setSelectedSortCode(sortCode)
        setSortCode(sortCode)

        getMPData(sortCode, searchKey)

    }, [])

    const getMPData = (sortCode, searchKey) => {
        getAllMP(sortCode, searchKey).then(data => {
            setIsLoadingSorted(true)

            if (data.hasOwnProperty('count') && data.hasOwnProperty('rows')) {
                setItems(data.rows)
            }

        }).finally(() => {
            setLoading(false)
            setIsLoadingSorted(false)
        })

    }

    const setSortHandler = (value) => {

        setSortCode(value)
        localStorage.setItem("sort_code_Tours", value)
        getMPData(value, searchKey)
    }

    const setSearchHandler = (value) => {
        setSearchKey(value)
        getMPData(sortCode, value)
    }

    if (loading) {

    } else {
        return (
            <div className={''}
            >
                <div className={''}
                     style={{marginTop: '20px', flex: '1'}}
                >
                    <FeedTopBar
                        isSearch={true}
                        setSearchHandler={setSearchHandler}
                        setSort={setSortHandler}
                        isLoading={isLoadingSorted}
                        selectedSortCode={selectedSortCode}
                        sortCodes={sortMapPoints}

                    />
                    <div className={'d-flex'}
                         style={{height: 'calc(100vh - 129px'}}
                    >
                        <Col className={' '}
                             style={{overflowX: 'hidden', overflowY: 'auto'}}
                        >
                            {
                                !isLoadingSorted
                                    ?
                                    items.map(function (item, index) {
                                        return <TourMpCard
                                            item={item}
                                            key={item.id + " " + index}
                                        />
                                    })
                                    :
                                    null
                            }

                        </Col>
                    </div>
                </div>
            </div>
        );
    }
};

export default MapPointsPage;