import React, {useContext, useEffect, useState} from 'react';

import './AddNewCommentComponent.css'
import CommentField from "./CommentField";
import {delay} from "../../utils/consts";
import {getAllByTopicId} from "../../http/topicCommentsAPI";
import {Context} from "../../index";

const CommentsFeed = (props) => {
    const {topicCommentsStore} = useContext(Context)

    const {topicId, commentsSortType} = props

    const [loading, setLoading] = useState(true)
    const [comments, setComments] = useState([])
    const [wrightCommentId, setWrightCommentId] = useState(-1)
    const [editCommentId, setEditCommentId] = useState(-1)

    useEffect(() => {
        if (commentsSortType) {
            commentsSortType.sort = sortComments
        }

    }, [])

    useEffect(() => {
        setLoading(true)

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
        localStorage.setItem("sort_code_Topic" + topicId + "Comments", value)
        getCommentsByTopicId()
    }


    const setWrightCommentHandler = (id) => {
        if(wrightCommentId === id){
            setWrightCommentId(-1)
        }else {
            setWrightCommentId(id)
        }
    }

    const setEditCommentHandler = (id) => {
        if(editCommentId === id){
            setEditCommentId(-1)
        }else {
            setEditCommentId(id)
        }
    }


    const getCommentComponent = (item, index) => {
        let repliesArr = []
        if (item.hasOwnProperty('replies')) {
            item.replies.map(function (replItem, replIndex) {
                repliesArr.push(getCommentComponent(replItem, replIndex))
            })
        }
        return <CommentField
            topicId={topicId}
            replies={repliesArr}
            key={index}
            comment={item}
            wrightComment={item.topic_comment_id === wrightCommentId}
            setWrightCommentHandler={setWrightCommentHandler}
            editComment={item.topic_comment_id === editCommentId}
            setEditCommentHandler={setEditCommentHandler}
        />
    }

    if (loading) {

    } else {

        return (
            <div className="panel">
                <div className="panel-body">

                    {
                        comments.map(function (item, index) {
                            return getCommentComponent(item, index)
                        })
                    }

                </div>
            </div>
        );
    }
};

export default CommentsFeed;