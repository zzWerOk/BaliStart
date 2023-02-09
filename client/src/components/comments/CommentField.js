import React, {useEffect, useState} from 'react';
import classes from "../../pages/TopicDetails.module.css";
import AddNewCommentComponent from "./AddNewCommentComponent";
import {dateToEpoch, epochToDateWithTime} from "../../utils/consts";

const CommentField = (props) => {
    const {
        comment,
        replies,
        topicId,
        wrightComment,
        setWrightCommentHandler,
        editComment,
        setEditCommentHandler
    } = props

    const [commentText, setCommentText] = useState('')

    useEffect(() => {

        setCommentText(comment.text)

    }, [])

    const wrightCommentHandler = () => {
        setWrightCommentHandler(comment.topic_comment_id)
    }

    const editCommentHandler = (text) => {
        setEditCommentHandler(comment.topic_comment_id)
        if (text) {
            setCommentText(text)
        }
    }

    return (
        <div className="media-block">
            <a className="media-left" href="#">
                <img className="img-circle img-sm"
                     alt="Profile Picture"
                     src="https://bootdey.com/img/Content/avatar/avatar1.png"/>
            </a>
            <div className="media-body">
                <div className="mar-btm">
                    <a href="#" className="btn-link text-semibold media-heading box-inline">
                        {comment.created_by_user_name}
                    </a>
                    <p className="text-muted text-sm">
                        {epochToDateWithTime(dateToEpoch(comment.createdAt))}
                    </p>
                </div>
                {
                    editComment
                        ?
                        <AddNewCommentComponent
                            topicId={topicId}
                            is_reply={true}
                            topic_comment_id={comment.topic_comment_id}
                            setWrightCommentHandler={editCommentHandler}
                            value={editComment ? commentText : ''}
                            isEditComment={editComment}
                        />
                        :
                        <p>
                            {commentText}
                        </p>
                }


                <div className="pad-ver">
                    <div className="btn-group">
                        {/*<a className="btn btn-sm btn-default btn-hover-success" href="#">*/}
                        {/*    <i className="fa fa-thumbs-up"></i>*/}
                        {/*</a>*/}
                        {/*<a className="btn btn-sm btn-default btn-hover-danger" href="#">*/}
                        {/*    <i className="fa fa-thumbs-down"></i>*/}
                        {/*</a>*/}
                    </div>


                    {
                        editComment
                            ?
                            null
                            :
                            wrightComment
                                ?
                                <AddNewCommentComponent
                                    topicId={topicId}
                                    is_reply={true}
                                    topic_comment_id={comment.topic_comment_id}
                                    setWrightCommentHandler={wrightCommentHandler}
                                />
                                :
                                <div className={'d-flex justify-content-between'}>
                                    {
                                        comment.editable
                                            ?
                                            <a className={`badge badge-secondary ${classes.badge_outlined} ${classes.comment_btn}`}
                                               onClick={() => {
                                                   editCommentHandler()
                                               }}
                                               type="button"
                                            >
                                            <span>
                                                Edit
                                            </span>
                                            </a>
                                            :
                                            <div></div>
                                    }

                                    <a className={`badge badge-secondary ${classes.badge_outlined} ${classes.comment_btn}`}
                                       onClick={() => {
                                           wrightCommentHandler()
                                       }}
                                       type="button"
                                    >
                                    <span>
                                        Comment
                                    </span>
                                    </a>

                                </div>
                    }
                    {
                        wrightComment || editComment
                            ?
                            null
                            :
                            <hr/>
                    }

                    {
                        replies.map(item => {
                            return item
                        })
                    }
                </div>


            </div>
        </div>
    );
};

export default CommentField;