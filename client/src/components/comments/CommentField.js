import React, {useEffect} from 'react';
import classes from "../../pages/TopicDetails.module.css";
import AddNewCommentComponent from "./AddNewCommentComponent";
import {dateToEpoch, epochToDateWithTime} from "../../utils/consts";

const CommentField = (props) => {
    const {
        comment,
        topicId,
        wrightComment,
        wrightCommentId,
        setWrightCommentHandler,
        editComment,
        editCommentId,
        setEditCommentHandler,
        deleteCommentHandler,
        isDeleting,
        sortCode,
    } = props


    useEffect(() => {

    }, [])

    const wrightCommentHandler = (replyComment) => {

        if (replyComment) {
            if (!comment.hasOwnProperty('replies')) {
                comment.replies = []
            }

            if (!sortCode) {
                comment.replies.push(replyComment)
            } else {
                comment.replies.unshift(replyComment)
            }
        }
        setWrightCommentHandler(comment.topic_comment_id, replyComment)
    }

    const editCommentHandler = (text) => {
        if (text) {
            comment.text = text
            setEditCommentHandler(comment.topic_comment_id, text)
        }else{
            setEditCommentHandler(comment.topic_comment_id)
        }
    }

    return (
        <div className="media-block"
             style={{marginLeft: '10px'}}
        >
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
                        <AddNewCommentComponent //editComment
                            topicId={topicId}
                            is_reply={true}
                            topic_comment_id={comment.topic_comment_id}
                            setWrightCommentHandler={editCommentHandler}
                            // value={editComment ? commentText : ''}
                            value={editComment ? comment.text : ''}
                            isEditComment={editComment}
                            deleteCommentHandler={deleteCommentHandler}
                            isDeleting={isDeleting}
                        />
                        :
                        <p>
                            {comment.text}
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
                                <AddNewCommentComponent //wrightComment
                                    topicId={topicId}
                                    is_reply={true}
                                    topic_comment_id={comment.topic_comment_id}
                                    setWrightCommentHandler={wrightCommentHandler}
                                    isDeleting={isDeleting}

                                />
                                :
                                <div className={'d-flex justify-content-between'}
                                style={{marginBottom: '30px'}}
                                >
                                    {
                                        comment.editable
                                            ?
                                            <a className={`badge badge-secondary 
                                                ${isDeleting ? null : classes.comment_btn} 
                                            `}
                                               onClick={() => {
                                                   if (!isDeleting) {
                                                       editCommentHandler()
                                                   }
                                               }}
                                               type={isDeleting ? `` : "button"}
                                            >
                                            <span>
                                                Edit
                                            </span>
                                            </a>
                                            :
                                            <div></div>
                                    }

                                    <a className={`badge badge-secondary 
                                                ${isDeleting ? null : classes.comment_btn} 
                                            `}
                                       onClick={() => {
                                           if (!isDeleting) {
                                               wrightCommentHandler()
                                           }

                                       }}
                                       type={isDeleting ? `` : "button"}
                                    >
                                    <span>
                                        Comment
                                    </span>
                                    </a>

                                </div>
                    }

                    {/*{*/}
                    {/*    wrightComment || editComment*/}
                    {/*        ?*/}
                    {/*        null*/}
                    {/*        :*/}
                    {/*        <hr/>*/}
                    {/*}*/}

                    {
                        comment.replies
                            ?
                            comment.replies.map(function (item, index) {
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
                                    sortCode={sortCode}
                                />

                            })
                            :
                            null
                    }
                </div>


            </div>
        </div>
    );

};

export default CommentField;