import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {
    delay,
    EDIT_TOPIC_ROUTE,
    epochToDateWithTime,
    linkShareButtonsModalChildComponent,
    NOPAGE_ROUTE
} from "../utils/consts";
import {getTopicData, getTopicEditable, setTopicSeen} from "../http/topicsAPI";
import {Context} from "../index";
import {Col, Row} from "react-bootstrap";
import classes from './TopicDetails.module.css'
import './TopicDetails.css'
import CommentsFeed from "../components/comments/CommentsFeed";
import FeedTopBar from "../components/mainpage/FeedTopBar";

import TopicDetailTextComponent from "../components/topics/components/TopicDetailTextComponent";
import TopicDetailCommentComponent from "../components/topics/components/TopicDetailCommentComponent";
import TopicDetailListComponent from "../components/topics/components/TopicDetailListComponent";
import TopicDetailLinkComponent from "../components/topics/components/TopicDetailLinkComponent";
import TopicDetailEmailComponent from "../components/topics/components/TopicDetailEmailComponent";
import TopicDetailPhoneComponent from "../components/topics/components/TopicDetailPhoneComponent";
import TopicDetailImagesComponent from "../components/topics/components/TopicDetailImagesComponent";
import TopicDetailGoogleMapUrlComponent from "../components/topics/components/TopicDetailGoogleMapUrlComponent";
import TopicDetailLineComponent from "../components/topics/components/TopicDetailLineComponent";

import ModalPopUp from "../components/ModalPopUp";
import BaliUserNameBtn from "../components/BaliUserName_btn";

const TopicDetails = (props) => {
    const {savedTopic, closePreview} = props

    let {id: topicIDUrl} = useParams();
    const history = useHistory()

    const {user, topicsCategoryStore, rightSideBarStore} = useContext(Context)

    const [showModal, setShowModal] = useState(false)

    const [loading, setLoading] = useState(true)
    const [topic, setTopic] = useState({})
    const [topicData, setTopicData] = useState([])
    const [topicCategories, setTopicCategories] = useState([])
    const [topicImage, setTopicImage] = useState('')

    const [isEditable, setIsEditable] = useState(false)

    const [pageTitle, setPageTitle] = useState('')

    useEffect(() => {

        rightSideBarStore.clear()
        rightSideBarStore.addBR()
        rightSideBarStore.addBtn('Edit topic', `${!isEditable ? 'disabled' : ''} ${!isEditable ? 'd-none' : ''} btn btn-bali `, openEditTopic)

    }, [isEditable])

    useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    useEffect(() => {
        setLoading(true)

        if (!savedTopic) {
            delay(0).then(() => {

                user.onLogoutHandler = () => {
                    isUserLogout()
                }
                user.onLoginHandler = () => {
                    isUserLogin()
                }

                getTopicData(topicIDUrl, user.id).then(data => {
                    let dataJson

                    try {
                        dataJson = JSON.parse(data)
                    } catch (e) {
                        dataJson = data
                    }

                    if (dataJson.hasOwnProperty('status')) {
                        if (dataJson.status === 'error') {
                            if (dataJson.message.toLowerCase() === 'topic not found') {
                                history.push(NOPAGE_ROUTE)
                            }
                        }
                    } else if (dataJson.hasOwnProperty('name')) {
                        setIsEditable(dataJson.editable || false)

                        setTopicData(dataJson.data)
                        delete dataJson.data
                        setTopic(dataJson)

                        setPageTitle(dataJson.name)

                        setTopicImage(process.env.REACT_APP_API_URL + '/static/' + dataJson.image + '?' + Date.now())

                        try {
                            getTopicsCategoriesList(dataJson.categories)
                        } catch (e) {
                        }

                        if(user?.isAuth) {
                            setTopicSeen(topicIDUrl).then(
                            ).catch((e) => {
                                console.log(e)
                            }).finally(() => {
                            })
                        }

                    } else if (dataJson.hasOwnProperty('message')) {
                        if (dataJson.message === 'topic not found') {
                            history.push(NOPAGE_ROUTE)
                        }
                    }

                }).catch((e) => {
                    console.log(e)
                }).finally(() => {
                    setLoading(false)
                })

            })
        } else {
            const savedTopicJson = JSON.parse(savedTopic)

            setTopic(savedTopicJson)
            setTopicData(savedTopicJson.data)

            getTopicsCategoriesList(savedTopicJson.categories)

            if (savedTopicJson.imageFile) {
                setTopicImage(savedTopicJson.image)
            } else if (savedTopicJson.image) {
                setTopicImage(process.env.REACT_APP_API_URL + '/static/' + savedTopicJson.image + '?' + Date.now())
            }

            setLoading(false)

        }

    }, [])

    const isUserLogout = () => {
        // console.log('logout')
        setIsEditable(false)
    }

    const isUserLogin = () => {
        getTopicEditable(topicIDUrl).then(data => {
            setIsEditable(false)
            if (data.hasOwnProperty('status')) {
                if (data.status === 'ok') {
                    setIsEditable(true)
                }
            }
        }).finally(() => {
        })
    }

    const openEditTopic = () => {
        if (isEditable) {
            history.push({
                pathname: EDIT_TOPIC_ROUTE,
                state: {topicID: topicIDUrl}
            });
        }
    }

    const getTopicsCategoriesList = (categories) => {
        try {
            const currCategories = topicsCategoryStore.getSavedCategoriesList()
            const currTopicCategories = JSON.parse(categories)
            let fullCategories = []

            currTopicCategories.map(category => {
                for (let i = 0; i < currCategories.length; i++) {
                    if (category + '' === currCategories[i].id + '') {
                        fullCategories.push(currCategories[i])
                        break
                    }
                }
            })
            setTopicCategories(fullCategories)
        } catch (e) {
            console.log(e.message)
        }
    }

    const getTopicDescriptionElement = (shortDescriptionText) => {
        let descriptionText = shortDescriptionText
        topicData.map(function (item) {
            {
                if (item.hasOwnProperty('description')) {
                    descriptionText = item.description
                }
            }
        })

        return (
            <p className={'lead my-0'}>
                {descriptionText}
            </p>
        )
    }

    const getTopicDetailsElement = (element, index) => {
        try {
            if (element.hasOwnProperty('type')) {
                switch (element.type) {
                    case 'text':
                        return <TopicDetailTextComponent key={index} element={element}/>
                    case 'comment':
                        return <TopicDetailCommentComponent key={index} element={element}/>
                    case 'list':
                        return <TopicDetailListComponent key={index} element={element}/>
                    case 'link':
                        return <TopicDetailLinkComponent key={index} element={element}/>
                    case 'email':
                        return <TopicDetailEmailComponent key={index} element={element}/>
                    case 'phone':
                        return <TopicDetailPhoneComponent key={index} element={element}/>
                    case 'images':
                        return <TopicDetailImagesComponent key={index} element={element}/>
                    case 'googleMapUrl':
                        return <TopicDetailGoogleMapUrlComponent key={index} element={element}/>
                    case 'line':
                        return <TopicDetailLineComponent key={index} element={element}/>
                }
            }
        } catch (e) {

        }
    }

    const modalChildComponent = () => (
        linkShareButtonsModalChildComponent('topic', topicIDUrl, pageTitle)
    )

    if (loading) {
    } else {
        return (
            <div
            >
                <div
                    style={{marginTop: '20px', flex: '1'}}
                >
                    <FeedTopBar
                        isBackBtn={true}
                        backBtnTitle={closePreview ? 'Close' : 'Back'}
                        backBtnHandler={closePreview}
                        rightSideBarElements={

                            !savedTopic
                                ?
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
                                                    {topic.commentsCount}
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
                                                    {parseInt(topic.seen) + 1}
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
                                           onClick={() => {
                                               setShowModal(true)
                                           }}>
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
                                :
                                null
                        }
                    />

                    <div className={'d-flex'}
                         style={{height: 'calc(100vh - 129px'}}
                    >
                        <Col
                            style={{overflowX: 'hidden', overflowY: 'auto'}}
                        >
                            <Row className={classes.topic_row_top}>
                                <div className={'d-flex justify-content-between'}>
                                    <small>
                                        {/*{topic.userName}*/}
                                        {<BaliUserNameBtn userName={topic.userName} userId={topic.userId}/>}
                                    </small>
                                    <small>
                                        {epochToDateWithTime(topic.created_date)}
                                    </small>
                                </div>
                            </Row>
                            <Row className={`${classes.topic_row} mx-3`}>
                                <div>
                                    {
                                        topicCategories.map(function (item, index) {
                                            return <a
                                                key={index}
                                                className="badge badge-secondary"
                                                type="button"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title={item.description}>
                                                <small>
                                                    {item.category_name}
                                                </small>
                                            < /a>

                                        })
                                    }
                                </div>
                            </Row>
                            <div

                                // style={{
                                //     backgroundSize: 'cover',
                                //     backgroundRepeat: 'no-repeat',
                                //     backgroundPosition: 'center',
                                //     backgroundImage: `url(${topicImage})`,
                                //     minHeight: '250px'
                                // }}
                                style={{
                                    background: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url(${topicImage})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    minHeight: '250px',
                                }}
                            >

                                <Row className={`${classes.topic_row} text-muted mx-3`} style={{paddingTop: '20px'}}>
                                    <h1 className={'display-4 font-italic'} style={{color: `white`,}}>
                                        {topic.name}
                                    </h1>
                                </Row>
                                {/*<Row className={`${classes.topic_row} text-muted mx-3`} style={{paddingBottom: '20px'}}>*/}
                                {/*    <p className={'lead my-3'} style={{color: `white`,}}>*/}
                                {/*        {topic.description}*/}
                                {/*    </p>*/}
                                {/*</Row>*/}
                            </div>
                            <Row className={`${classes.topic_row} text-muted mx-3`} style={{paddingBottom: '0px'}}>
                                {getTopicDescriptionElement(topic.description)}
                                {/*<p className={'lead my-0'}>*/}
                                {/*    {topic.description}*/}
                                {/*</p>*/}
                            </Row>
                            <div className={`${classes.topic_row} mx-2 mx-md-4`}>
                                {
                                    topicData.map(function (item, index) {
                                        return getTopicDetailsElement(item, index)
                                    })
                                }
                            </div>
                            {
                                !closePreview
                                    ?
                                    <>
                                        <Row className={`${classes.topic_row} mx-1`}>
                                            <hr/>
                                            <h5>
                                                <small>
                                                    Comments
                                                </small>
                                            </h5>
                                        </Row>
                                        <Row className={classes.topic_row}>
                                            <CommentsFeed
                                                topicId={topicIDUrl}
                                            />
                                        </Row>
                                    </>
                                    :
                                    null
                            }
                        </Col>
                    </div>
                </div>
                <ModalPopUp
                    show={showModal}
                    title={'Topic link share'}
                    onHide={() => {
                        setShowModal(false)
                    }}
                    child={modalChildComponent}
                />

            </div>
        );
    }
};

export default TopicDetails;