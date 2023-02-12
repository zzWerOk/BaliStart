import React, {useContext, useEffect, useState} from 'react';

import './AddNewCommentComponent.css'
import {Button} from "react-bootstrap";
import {delay, epochToDateWithTime} from "../../utils/consts";
import {editComment, shareComment} from "../../http/topicCommentsAPI";
import {Context} from "../../index";

const AddNewCommentComponent = (props) => {
    const {user} = useContext(Context)

    const {
        topicId,
        addNewCommentHandler,
        is_reply = false,
        topic_comment_id,
        setWrightCommentHandler,
        isEditComment,
        value,
        deleteCommentHandler,
        isDeleting,
        // isCommentSending,
    } = props

    const [commentText, setCommentText] = useState('')
    const [commentSending, setCommentSending] = useState(false)
    const [commentSendingError, setCommentSendingError] = useState(false)
    const [commentSendingErrorText, setCommentSendingErrorText] = useState('')

    const [showCancelBtn, setShowCancelBtn] = useState(false)

    const [showDeleteBtn, setShowDeleteBtn] = useState(false)


    useEffect(() => {

        if (value) {
            setCommentText(value)
        }

        if (topic_comment_id !== null && topic_comment_id !== undefined) {
            if (topic_comment_id >= 0) {
                setShowCancelBtn(true)
            }
        }

    }, [])

    const addNewComment = () => {

        if (!checkBeforeEditCurrComment()) {
            return
        }


        delay(0).then(() => {

            shareComment(
                commentText,
                topicId,
                topic_comment_id,
                is_reply,
            ).then(data => {

                if (data.hasOwnProperty('status')) {
                    if (data.status === 'ok') {
                        let newComment = {
                            createdAt: epochToDateWithTime(Date.now()),
                            created_by_user_name: user.name,
                            editable: true,
                            text: commentText,
                            topic_comment_id: data.id,
                        }
                        if (addNewCommentHandler) {
                            addNewCommentHandler(newComment)
                            setCommentText('')
                        } else if (is_reply) {
                            setWrightCommentHandler(newComment)
                        }
                        return
                    }
                    // }else{
                }
                setCommentSendingErrorText('Comment add error')
                setCommentSendingError(true)

                // }).catch((e) => {
                //     setCommentSendingErrorText(e.message)
                //     setCommentSendingError(true)
            }).finally(() => {
                setCommentSending(false)
            })
        })
    }

    const checkBeforeEditCurrComment = () => {
        setCommentSendingErrorText('')

        if (!commentText || commentText.length === 0) {
            setCommentSendingError(true)
            setCommentSendingErrorText('Поле не должно быть пустым')
            return false
        }

        if (!user.isAuth) {
            setCommentSendingError(true)
            setCommentSendingErrorText('Необходимо авторизоваться')
            return false
        }

        setCommentSending(true)
        setCommentSendingError(false)

        return true
    }

    const editCurrComment = () => {

        if (!checkBeforeEditCurrComment()) {
            return
        }

        delay(0).then(() => {

            editComment(
                commentText,
                topicId,
                topic_comment_id,
            ).then(data => {
                if (data.hasOwnProperty('status')) {
                    if (data.status === 'ok') {
                        cancelWrightCommentHandler(commentText)
                    }
                }
            }).catch((e) => {
                setCommentSendingErrorText(e.message)

                setCommentSendingError(true)
            }).finally(() => {
                setCommentSending(false)
            })
        })
    }

    const sendCommentHandler = () => {
        if (isEditComment) {
            editCurrComment()
        } else {
            addNewComment()
        }
    }

    const commentHandler = (value) => {
        setCommentText(value)
    }

    const onShowDeleteBtnHandler = () => {
        setShowDeleteBtn(true)
        setTimeout(() => {
            setShowDeleteBtn(false)
        }, 5000)

    }

    const cancelWrightCommentHandler = (text) => {
        if (!isEditComment) {
            setWrightCommentHandler()
        } else if (isEditComment && text) {
            setWrightCommentHandler(text)
        } else {
            setWrightCommentHandler()
        }
    }


    return (<div>
            <link href={"https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"} rel="stylesheet"/>
            <div className="container bootdey">
                <div className="col-md-12 bootstrap snippets">
                    <div className="panel">
                        <div className="panel-body"
                             style={{padding: '0 25px 0px'}}
                        >

                        <textarea
                            className={`form-control ${commentSendingError ? "send-error" : ""}`}
                            rows="2"
                            style={{marginBottom: '5px'}}
                            onChange={e => commentHandler(e.target.value)}
                            placeholder="What are you thinking?"
                            value={commentText}
                            disabled={!!commentSending || !!isDeleting}
                        >

                        </textarea>

                            <div className={'d-flex justify-content-between'}>
                                <div className={'d-flex justify-content-around'}>
                                    {
                                        showCancelBtn
                                            ?
                                            <Button className={'btn btn-sm'}
                                                    variant={"outline-secondary"}
                                                    onClick={() => {
                                                        cancelWrightCommentHandler()
                                                    }}
                                                    disabled={!!commentSending || !!isDeleting}
                                            >
                                                Cancel
                                            </Button>
                                            :
                                            null
                                    }

                                    {
                                        showCancelBtn && isEditComment
                                            ?

                                            <div
                                                style={{marginLeft: '15px'}}
                                            >

                                                <Button
                                                    type="button"
                                                    className={`btn btn-sm `}
                                                    variant={"outline-danger"}
                                                    style={{marginLeft: '25px'}}
                                                    disabled={!!commentSending || !!isDeleting}
                                                    onClick={onShowDeleteBtnHandler}
                                                >
                                                    Delete
                                                </Button>

                                                {
                                                    showDeleteBtn
                                                        ?
                                                        <Button
                                                            className="btn  btn-sm "
                                                            variant={"outline-danger"}
                                                            style={{marginLeft: '5px'}}
                                                            disabled={!!commentSending || !!isDeleting}
                                                            onClick={() => {
                                                                deleteCommentHandler(topicId, topic_comment_id)
                                                            }}
                                                        >
                                                            Yes
                                                        </Button>
                                                        :
                                                        null
                                                }

                                            </div>

                                            :
                                            null
                                    }
                                </div>

                                <Button className={'pull-right btn-sm'}
                                        variant={commentSendingError ? "danger" : "outline-primary"}
                                        onClick={() => {
                                            sendCommentHandler()
                                        }}
                                        disabled={!!commentSending || !!isDeleting}
                                >
                                    Share
                                </Button>
                            </div>
                            <label
                                className={`form-label ${commentSendingError ? "send-error" : ""}`}
                                style={{color: '#dc3545'}}
                            >
                                {commentSendingErrorText}
                            </label>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AddNewCommentComponent;