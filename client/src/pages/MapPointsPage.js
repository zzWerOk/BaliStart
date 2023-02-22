import React, {useEffect, useState} from 'react';
import TourMpCard from "../components/tours/TourMPCard";
import {getAllMP} from "../http/mapPointsAPI";
import FeedTopBar from "../components/mainpage/FeedTopBar";
import {Col} from "react-bootstrap";

const MapPointsPage = () => {

    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])

    useEffect(() => {
        setLoading(true)

        getAllMP().then(data => {

            if(data.hasOwnProperty('count') && data.hasOwnProperty('rows')){
                setItems(data.rows)
            }

        }).finally(() => {

        })


        setLoading(false)
    }, [])

    if (loading) {

    } else {
        return (
            <div className={''}
            >
                <div className={''}
                     style={{marginTop: '20px', flex: '1'}}
                >
                    <FeedTopBar
                        isBackBtn={false}
                        backBtnTitle={''}
                        rightSideBarElements={
                            <div className={'d-flex'}>
                                <div className={'d-flex justify-content-between align-items-center'}>

                                </div>
                            </div>
                        }
                    />
                    <div className={'d-flex'}
                         style={{height: 'calc(100vh - 129px'}}
                    >
                        <Col className={' '}
                             style={{overflowX: 'hidden', overflowY: 'auto'}}
                        >
                            {
                                items.map(function (item, index) {
                                    return <TourMpCard
                                        item={item}
                                        key={item.id + " " + index}
                                    />
                                })
                            }

                        </Col>
                    </div>
                </div>
            </div>
        );
    }
};

export default MapPointsPage;