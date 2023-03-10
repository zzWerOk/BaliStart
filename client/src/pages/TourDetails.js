import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {delay} from "../utils/consts";
import FeedTopBar from "../components/mainpage/FeedTopBar";
import classes from "./TopicDetails.module.css";
import {Col, Row} from "react-bootstrap";
import {getTourData} from "../http/toursAPI";
import {Context} from "../index";
import {getAllTours_Type} from "../http/toursTypeAPI";
import {getAll_ToursCat} from "../http/toursCategoryAPI";
import TopicDetailImagesComponent from "../components/topics/components/TopicDetailImagesComponent";
import TopicDetailListComponent from "../components/topics/components/TopicDetailListComponent";
import {getMapPointById} from "../http/mapPointsAPI";
import ElementName from "../components/topics/components/ElementName";
import TourMpCard from "../components/tours/TourMPCard";
import TourGuidesCard from "../components/tours/TourGuidesCard";

const TourDetails = () => {
    let {id} = useParams();

    const {toursCategoryStore, toursTypeStore} = useContext(Context)

    const [loading, setLoading] = useState(true)
    const [loadingType, setLoadingType] = useState(true)
    const [loadingCat, setLoadingCat] = useState(true)
    const [loadingMP, setLoadingMP] = useState(true)

    const [currTour, setCurrTour] = useState({})
    const [tourData, setTourData] = useState([])
    const [tourCategories, setTourCategories] = useState([])
    const [itemImage, setItemImage] = useState('')
    const [tourMP, setTourMP] = useState([])
    const [tourGuides, setTourGuides] = useState([])

    const [tourGuideClicked, setTourGuideClicked] = useState(-1)

    const [pageTitle, setPageTitle] = useState('')

    const clickTourGuide = (guideId) => {

        if (guideId === tourGuideClicked) {
            setTourGuideClicked(-1)
        } else {
            setTourGuideClicked(guideId)
        }
    }

    useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    useEffect(() => {

        setLoading(true)

        delay(0).then(() => {

            getTourData(id).then(async data => {
                let dataJson

                try {
                    dataJson = JSON.parse(data)
                } catch (e) {
                    dataJson = data
                }

                if (dataJson.hasOwnProperty('status')) {
                    if (dataJson.status === 'ok') {
                        if (dataJson.data.hasOwnProperty('data')) {
                            setTourData(dataJson.data.data)
                            delete dataJson.data.data
                        }
                        setCurrTour(dataJson.data)

                        setPageTitle(dataJson.data.name)

                        setTourGuides(dataJson.data.selected_guides)

                        setTourCategories(JSON.parse(dataJson.data.tour_category))

                        if (dataJson.data.image) {
                            setItemImage(process.env.REACT_APP_API_URL + '/static/' + dataJson.data.image + '?' + Date.now())
                        }

                        if (dataJson.data.hasOwnProperty('map_points')) {
                            const mapPointsArr = JSON.parse(dataJson.data.map_points)
                            let newMPArr = []
                            for (let i = 0; i < mapPointsArr.length; i++) {
                                const item = mapPointsArr[i]
                                await getMapPointById(item).then(dataMP => {
                                    if (dataMP.hasOwnProperty('status')) {
                                        if (dataMP.status === 'ok') {
                                            newMPArr.push(dataMP.data)
                                            setTourMP(newMPArr)
                                        }
                                    }
                                })
                            }
                            setLoadingMP(false)
                        }

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
                    }
                } else if (dataJson.hasOwnProperty('name')) {

                }

            }).catch((e) => {
                console.log(e)
            }).finally(() => {
                setLoading(false)
            })

        })

    }, [])

    const getToutCatNameById = (catId) => {
        const selectedCat = toursCategoryStore.itemsArr.find(element => element.id === catId)
        if (selectedCat) {
            return selectedCat.name
        }
        return ""
    }

    const getToutCatDescriptionById = (catId) => {
        const selectedCat = toursCategoryStore.itemsArr.find(element => element.id === catId)
        if (selectedCat) {
            return selectedCat.description
        }
        return ""
    }

    const getTourDataElements = (tourData) => {
        const tourDataJson = JSON.parse(tourData)
        let imagesElement = {name: '', items: '[]'}
        if (tourDataJson.hasOwnProperty('images')) {
            imagesElement.items = tourDataJson.images
        }

        let includesElement = {name: '', items: '[]'}
        if (tourDataJson.hasOwnProperty('includes')) {
            includesElement.name = 'What Includes'
            includesElement.items = tourDataJson.includes
        }

        let notIncludesElement = {name: '', items: '[]'}
        if (tourDataJson.hasOwnProperty('notincludes')) {
            notIncludesElement.name = 'What not includes'
            notIncludesElement.items = tourDataJson.notincludes
        }

        return <div>
            {
                JSON.parse(imagesElement.items).length > 0
                    ?
                    <TopicDetailImagesComponent element={imagesElement}/>
                    :
                    null
            }

            {
                tourMP.length > 0
                    ?
                    <div>

                        <ElementName name={'Itinerary'}/>

                        <div className="accordion accordion-borderless"
                             id="accordionFlushExample"
                             style={{marginTop: '-10px'}}
                        >
                            <ul className="timeline-with-icons">

                                {
                                    tourMP.map(function (item, index) {
                                        return getMapPointsTimeLineItem(item, index)
                                    })
                                }

                            </ul>
                        </div>
                    </div>

                    :
                    null
            }

            {
                JSON.parse(includesElement.items).length > 0
                    ?
                    <TopicDetailListComponent isIncludes={true} element={includesElement}/>
                    :
                    null
            }
            {
                JSON.parse(notIncludesElement.items).length > 0
                    ?
                    <TopicDetailListComponent isNotIncludes={true} element={notIncludesElement}/>
                    :
                    null
            }
        </div>
    }

    const getMapPointsTimeLineItem = (item, index) => {

        return <li key={item.id + ' ' + index} className={'timeline-item mx-3 mx-md-0'}>
            <span className="timeline-icon">
                {index + 1}
            </span>

            <div className="accordion-item">
                <h2 className="accordion-header" id={"flush-heading" + item.id}>
                    <button
                        className="btn-outline-secondary accordion-button collapsed"
                        type="button"
                        data-mdb-toggle="collapse"
                        data-mdb-target={"#flush-collapse" + item.id}
                        aria-expanded="false"
                        aria-controls={"flush-collapse" + item.id}
                    >
                        {item.name}
                    </button>
                </h2>
                <div
                    id={"flush-collapse" + item.id}
                    className="accordion-collapse collapse"
                    aria-labelledby={"flush-heading" + item.id}
                    data-mdb-parent="#accordionFlush"
                >
                    <div className="accordion-body">
                        <TourMpCard item={item}/>
                    </div>
                </div>
            </div>
        </li>
    }

    if (loading || loadingCat || loadingType || loadingMP) {

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
                                        {/*{epochToDateWithTime(currTour.created_date)}*/}
                                    </small>
                                    <div className={'price'}>
                                        {currTour.price_usd}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             className="bi bi-currency-dollar" viewBox="0 0 16 16">
                                            <path
                                                d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                                        </svg>

                                    </div>
                                </div>
                            </Row>
                            <Row className={`{classes.topic_row} mx-2`}>
                                <div>
                                    {
                                        tourCategories.map(function (item, index) {
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
                                <Row className={`${classes.topic_row} text-muted mx-3`} style={{paddingTop: '20px'}}>
                                    <h1 className={'display-4 font-italic'} style={{color: `white`,}}>
                                        {currTour.name}
                                    </h1>
                                </Row>
                                <Row className={`${classes.topic_row} text-muted mx-3`} style={{paddingBottom: '20px'}}>
                                    <p className={'lead my-3'} style={{color: `white`,}}>
                                        {currTour.description}
                                    </p>
                                </Row>
                            </div>
                            <div className={`${classes.topic_row} mx-2 mx-md-4`}>

                                {
                                    getTourDataElements(tourData)
                                }

                            </div>
                            <Row className={`{classes.topic_row} px-2 px-md-4`}>
                                {tourGuides.length > 0
                                    ?
                                    <ElementName name={'Guides'}/>
                                    :
                                    null
                                }
                                <TourGuidesCard
                                    items={tourGuides}
                                    tourGuideClicked={tourGuideClicked}
                                    clickTourGuide={clickTourGuide}
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