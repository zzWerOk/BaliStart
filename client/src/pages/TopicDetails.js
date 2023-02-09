import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {delay, epochToDateWithTime} from "../utils/consts";
import {getTopicData} from "../http/topicsAPI";
import {Context} from "../index";
import {Col, Row} from "react-bootstrap";
import classes from './TopicDetails.module.css'
import AddNewCommentComponent from "../components/comments/AddNewCommentComponent";
import CommentsFeed from "../components/comments/CommentsFeed";

const TopicDetails = () => {
    let {id} = useParams();

    const {user, topicsCategoryStore} = useContext(Context)

    const commentsSortType = React.useRef(null)

    const [loading, setLoading] = useState(true)
    const [topic, setTopic] = useState({})
    const [topicData, setTopicData] = useState([])
    const [topicCategories, setTopicCategories] = useState([])
    const [commentsSort, setCommentsSort] = useState(true)

    useEffect(() => {
        setLoading(true)

        setCommentsSort(localStorage.getItem("sort_code_Topic" + id + "Comments") !== 'true');

        delay(0).then(() => {

            getTopicData(id, user.id).then(data => {

                // console.log(data)
                let dataJson = JSON.parse(data)
                if (dataJson.hasOwnProperty('name')) {
                    setTopicData(dataJson.data)
                    delete dataJson.data
                    setTopic(dataJson)


                    try {
                        const currCategories = topicsCategoryStore.getSavedCategoriesList()
                        const currTopicCategories = JSON.parse(dataJson.categories)
                        let fullCategories = []

                        currTopicCategories.map(category => {
                            for (let i = 0; i < currCategories.length; i++) {
                                if (category === currCategories[i].id) {
                                    fullCategories.push(currCategories[i])
                                    break
                                }
                            }
                        })
                        setTopicCategories(fullCategories)
                    } catch (e) {
                    }
                }

            }).finally(() => {
                setLoading(false)
            })

        })

    }, [])

    const commentsSortHandler = (value) => {
        setCommentsSort(!value)
        commentsSortType.sort(value)
    }

    if (loading) {

    } else {
        return (
            <div className={'d-flex'}>
                <Col
                    md={10}
                >
                    <Row className={classes.topic_row}>
                        <div className={'d-flex justify-content-between'}>
                            <small>
                                {topic.userName}
                            </small>
                            <small>
                                {epochToDateWithTime(topic.created_date)}
                            </small>
                        </div>
                    </Row>
                    <Row className={classes.topic_row_top}>
                        <h4>
                            {topic.name}
                        </h4>
                    </Row>
                    <Row className={classes.topic_row_bottom}>
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
                    <Row className={classes.topic_row}>
                        <h6>
                            {topic.description}
                        </h6>
                    </Row>
                    <Row className={classes.topic_row}>
                        <div>
                            <a className={`badge badge-secondary ${classes.badge_outlined}`}
                               type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-share" viewBox="0 0 16 16">
                                    <path
                                        d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                                </svg>
                                <span className={classes.badge_outlined_span}>
                                    Share
                                </span>
                            </a>
                        </div>
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
                        <AddNewCommentComponent topicId={id}/>
                    </Row>
                    <Row className={classes.topic_row}>
                        <div>
                            <a className={`badge badge-secondary ${classes.badge_outlined} ${classes.comment_btn}`}
                               onClick={() => {
                                   commentsSortHandler(commentsSort)
                               }}
                               type="button"
                            >

                                {
                                    commentsSort
                                        ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             className="bi bi-sort-up-alt" viewBox="0 0 16 16">
                                            <path
                                                d="M3.5 13.5a.5.5 0 0 1-1 0V4.707L1.354 5.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 4.707V13.5zm4-9.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             className="bi bi-sort-down-alt" viewBox="0 0 16 16">
                                            <path
                                                d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
                                        </svg>
                                }

                            </a>
                        </div>
                    </Row>
                    <Row className={classes.topic_row}>
                        <CommentsFeed
                            topicId={id}
                            commentsSortType={commentsSortType}
                        />
                    </Row>
                </Col>
                <Col>
                    Side panel
                </Col>
            </div>
        );
    }
};

export default TopicDetails;