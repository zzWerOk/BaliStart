import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {delay} from "../utils/consts";
import FeedTopBar from "../components/mainpage/FeedTopBar";
import classes from "./TopicDetails.module.css";
import {Col, Row} from "react-bootstrap";
import CommentsFeed from "../components/comments/CommentsFeed";
import {getTourData} from "../http/toursAPI";
import {Context} from "../index";
import {getAllTours_Type} from "../http/toursTypeAPI";
import {getAll_ToursCat} from "../http/toursCategoryAPI";

const TourDetails = () => {
    let {id} = useParams();

    const {toursCategoryStore, toursTypeStore} = useContext(Context)

    const [loading, setLoading] = useState(true)
    const [loadingType, setLoadingType] = useState(true)
    const [loadingCat, setLoadingCat] = useState(true)

    const [currTour, setCurrTour] = useState({})
    // const [tourData, setTourData] = useState([])
    const [tourCategories, setTourCategories] = useState([])
    const [itemImage, setItemImage] = useState('')

    useEffect(() => {

        setLoading(true)

        delay(0).then(() => {

            getTourData(id).then(data => {
                let dataJson

                try {
                    dataJson = JSON.parse(data)
                } catch (e) {
                    dataJson = data
                }

                if (dataJson.hasOwnProperty('status')) {
                    if (dataJson.status === 'ok') {
                        if (dataJson.data.hasOwnProperty('data')) {
                            // setTourData(JSON.parse(dataJson.data.data))
                            delete dataJson.data.data
                        }
                        setCurrTour(dataJson.data)

                        console.log(dataJson.data)

                        setTourCategories(JSON.parse(dataJson.data.tour_category))

                        if (dataJson.data.image) {
                            setItemImage(process.env.REACT_APP_API_URL + '/static/' + dataJson.data.image + '?' + Date.now())
                        }

                    }
                } else if (dataJson.hasOwnProperty('name')) {

                }

            }).catch((e) => {
                console.log(e)
            }).finally(() => {
                setLoading(false)
                if (!toursCategoryStore.loaded) {
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
                } else {
                    setLoadingCat(false)
                }

                if (!toursTypeStore.loaded) {
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
                    })

                } else {
                    setLoadingType(false)
                }

            })

        })

    }, [])

    const getToutCatNameById = (catId) => {
        console.log(toursCategoryStore.itemsArr)
        const selectedCat = toursCategoryStore.itemsArr.find(element => element.id === catId)
        if(selectedCat){
            return selectedCat.name
        }
        return ""
    }

    const getToutCatDescriptionById = (catId) => {
        const selectedCat = toursCategoryStore.itemsArr.find(element => element.id === catId)
        if(selectedCat){
            return selectedCat.description
        }
        return ""
    }

    if (loading || loadingCat || loadingType) {

    } else {
        return (
            <div className={''}
            >
                <div className={''}
                     style={{marginTop: '20px', flex: '1'}}
                >
                    <FeedTopBar
                        isBackBtn={true}
                        backBtnTitle={'Back'}
                        rightSideBarElements={
                            <div className={'d-flex'}>
                                <div className={'d-flex justify-content-between align-items-center'}>

                                    <div className={'d-flex'}>

                                        <div className={'d-flex'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor"
                                                 className="bi bi-chat-left-text" viewBox="0 0 16 16"
                                                 style={{marginTop: '5px'}}
                                            >
                                                <path
                                                    d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                                <path
                                                    d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                                            </svg>
                                            <small style={{marginLeft: '5px',}}>
                                                {currTour.commentsCount}
                                            </small>
                                        </div>

                                        <div className={'d-flex'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor"
                                                 className="bi bi-eye" viewBox="0 0 16 16"
                                                 style={{marginTop: '3px', marginLeft: '15px'}}
                                            >
                                                <path
                                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                                <path
                                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                            </svg>
                                            <small style={{marginLeft: '5px', marginRight: '15px'}}>
                                                0
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                <div className={'d-flex justify-content-center align-items-center'}>
                                    <a className={`badge badge-secondary ${classes.badge_outlined}`}
                                       type="button"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             className="bi bi-heart" viewBox="0 0 16 16">
                                            <path
                                                d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                        </svg>
                                        <span className={classes.badge_outlined_span}>
                                        Like
                                    </span>
                                    </a>

                                    <a className={`badge badge-secondary ${classes.badge_outlined}`}
                                       type="button"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             className="bi bi-share" viewBox="0 0 16 16">
                                            <path
                                                d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                                        </svg>
                                        <span className={classes.badge_outlined_span}>
                                        Share
                                    </span>
                                    </a>
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
                            <Row className={classes.topic_row_top}>
                                <div className={'d-flex justify-content-between'}>
                                    <small>
                                        {/*{currTour.userName}*/}
                                    </small>
                                    <small>
                                        {/*{epochToDateWithTime(currTour.created_date)}*/}
                                    </small>
                                </div>
                            </Row>
                            <Row className={classes.topic_row}>
                                <div>
                                    {
                                        tourCategories.map(function (item, index) {
                                            console.log(item)
                                            return <a
                                                key={index}
                                                className="badge badge-secondary"
                                                type="button"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title={getToutCatDescriptionById(item)}>
                                                <small>
                                                    {getToutCatNameById(item)}
                                                </small>
                                            < /a>

                                        })
                                    }
                                </div>
                            </Row>
                            <div
                                style={{
                                    background: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url(${itemImage})`,
                                    backgroundSize: 'cover',
                                    minHeight: '250px',
                                }}
                            >
                                <Row className={`${classes.topic_row} text-muted`} style={{paddingTop: '20px'}}>
                                    <h1 className={'display-4 font-italic'} style={{color: `white`,}}>
                                        {currTour.name}
                                    </h1>
                                </Row>
                                <Row className={`${classes.topic_row} text-muted`} style={{paddingBottom: '20px'}}>
                                    <p className={'lead my-3'} style={{color: `white`,}}>
                                        {currTour.description}
                                    </p>
                                </Row>
                            </div>
                            <Row className={`${classes.topic_row} ${classes.topic_data}`}>
                                {
                                    // tourData.map(function (item, index) {
                                    //     return getTopicDetailsElement(item, index)
                                    // })
                                }
                            </Row>
                            <Row className={classes.topic_row}>
                                <hr/>
                                <h5>
                                    <small>
                                        Comments
                                    </small>
                                </h5>
                            </Row>
                            <Row className={classes.topic_row}>
                                <CommentsFeed
                                    topicId={id}
                                />
                            </Row>
                        </Col>
                    </div>
                </div>
            </div>
        );
    }
};

export default TourDetails;