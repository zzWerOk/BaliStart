import React, {useContext, useEffect, useState} from 'react';

import './AddNewCommentComponent.css'
import CommentField from "./CommentField";
import {delay} from "../../utils/consts";
import {deleteCommentTopicAPI, getAllByTopicId} from "../../http/topicCommentsAPI";
import {Context} from "../../index";
import classes from "../../pages/TopicDetails.module.css";
import AddNewCommentComponent from "./AddNewCommentComponent";

const CommentsFeed = (props) => {
    const {topicCommentsStore} = useContext(Context)

    const {topicId} = props

    const [loading, setLoading] = useState(true)
    const [comments, setComments] = useState([])
    const [wrightCommentId, setWrightCommentId] = useState(-1)
    const [editCommentId, setEditCommentId] = useState(-1)

    const [isDeleting, setIsDeleting] = useState(false)

    const [commentsSort, setCommentsSort] = useState(true)
    const [redraw, setRedraw] = useState(true)

    useEffect(() => {

        setLoading(true)
        setCommentsSort(localStorage.getItem("sort_code_Topic" + topicId + "Comments") !== 'true');

        delay(0).then(() => {

            getCommentsByTopicId()

        })

    }, [])

    const getCommentsByTopicId = () => {

        getAllByTopicId(topicId).then(data => {

            if (data.hasOwnProperty('count')) {
                topicCommentsStore.setCommentsByTopic(topicId, data.rows)
                setComments(data.rows)
            }

        }).finally(() => {
            setLoading(false)
        })
    }

    const sortComments = (value) => {
        setCommentsSort(!value)
        localStorage.setItem("sort_code_Topic" + topicId + "Comments", value)
        getCommentsByTopicId()

    }

    const setWrightCommentHandler = (id, replyComment) => {
        if (wrightCommentId === id) {
            if (replyComment) {
                topicCommentsStore.addReplyCommentToTopic(topicId, replyComment, id, !commentsSort)
            }

            setWrightCommentId(-1)
        } else {
            setWrightCommentId(id)
        }
    }

    const setEditCommentHandler = (id, commentText) => {
        if (editCommentId === id) {

            if (id !== null && id !== undefined && commentText !== null && commentText !== undefined) {
                topicCommentsStore.editCommentOfTopic(topicId, id, commentText)
            }

            setEditCommentId(-1)
        } else {
            setEditCommentId(id)
        }
    }

    const addNewCommentHandler = (comment) => {
        topicCommentsStore.addCommentToTopic(topicId, comment, !commentsSort)
        setComments(topicCommentsStore.getCommentsByTopic(topicId))
        setRedraw(!redraw)
    }

    const deleteCommentHandler = (topicId, id) => {
        if (id !== null && id !== undefined && topicId !== null && topicId !== undefined) {
            setIsDeleting(true)
            deleteCommentTopicAPI(topicId, id).then(data => {

                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            if (topicCommentsStore.deleteCommentByTopic(topicId, id)) {
                                setComments(topicCommentsStore.getCommentsByTopic(topicId))
                                setEditCommentId(-1)
                                return
                            }
                        }
                    }

                    console.log('comment NotRemoved')
                }
            ).finally(() => {
                setIsDeleting(false)
            })
        }
    }

    const getCommentComponent = (item, index) => {
        // let repliesArr = []
        // let item = currItem

        // console.log(item)

        // if (item.hasOwnProperty('replies')) {
        //     item.replies.map(function (replItem, replIndex) {
        //         if (replItem !== undefined) {
        //             repliesArr.push(getCommentComponent(replItem, replIndex))
        //         }
        //     })
        // }

        return <CommentField
            key={index}
            topicId={topicId}
            comment={item}
            // replies={repliesArr}
            wrightComment={item.topic_comment_id === wrightCommentId}
            wrightCommentId={wrightCommentId}
            setWrightCommentHandler={setWrightCommentHandler}
            editComment={item.topic_comment_id === editCommentId}
            editCommentId={editCommentId}
            setEditCommentHandler={setEditCommentHandler}
            deleteCommentHandler={deleteCommentHandler}
            isDeleting={isDeleting}
            sortCode={commentsSort}
        />
    }

    if (loading) {

    } else {

        return (
            <div className="panel">
                <div className="panel-body">
                    <div className={classes.topic_row_bottom}>
                        <AddNewCommentComponent //addNewCommentHandler
                            topicId={topicId}
                            addNewCommentHandler={addNewCommentHandler}
                            // isCommentSending={isCommentSending}
                        />
                    </div>
                    {
                        comments.length > 0
                            ?
                            <div className={classes.topic_row}>
                                <div>
                                    <a className={`badge badge-secondary ${classes.badge_outlined} ${classes.comment_btn}`}
                                       onClick={() => {
                                           // commentsSortHandler(commentsSort)
                                           sortComments(commentsSort)
                                       }}
                                       type="button"
                                    >

                                        {
                                            commentsSort
                                                ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    // fill="currentColor"
                                                     className="bi bi-sort-up-alt" viewBox="0 0 16 16">
                                                    <path
                                                        d="M3.5 13.5a.5.5 0 0 1-1 0V4.707L1.354 5.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 4.707V13.5zm4-9.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
                                                </svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    // fill="currentColor"
                                                     className="bi bi-sort-down-alt" viewBox="0 0 16 16">
                                                    <path
                                                        d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
                                                </svg>
                                        }
                                    </a>
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        comments.length > 0
                            ?
                            comments.map(function (item, index) {
                                return getCommentComponent(item, index)
                            })
                            :
                            null
                    }

                </div>
            </div>
        );
    }
};

export default CommentsFeed;