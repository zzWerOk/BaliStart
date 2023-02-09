import React, {useContext, useEffect, useState} from 'react';

import './AddNewCommentComponent.css'
import {Button} from "react-bootstrap";
import {delay} from "../../utils/consts";
import {editComment, getAllByTopicId, shareComment} from "../../http/topicCommentsAPI";
import {Context} from "../../index";

const AddNewCommentComponent = (props) => {
    const {user, topicCommentsStore} = useContext(Context)

    const {topicId, is_reply = false, topic_comment_id, setWrightCommentHandler, isEditComment, value} = props

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

        if (topic_comment_id) {
            if (topic_comment_id > -1) {
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

                console.log(data)

            }).catch((e) => {
                setCommentSendingErrorText(e.message)

                setCommentSendingError(true)
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
                cancelWrightCommentHandler(commentText)
                console.log(data)

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
    }

    const cancelWrightCommentHandler = (text) => {
        if (!isEditComment) {
            setWrightCommentHandler(topic_comment_id)
        } else if (isEditComment && text) {
            setWrightCommentHandler(text)
        } else {
            setWrightCommentHandler()
        }
    }


    return (<div>
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"/>
        <div className="container bootdey">
            <div className="col-md-12 bootstrap snippets">
                <div className="panel">
                    <div className="panel-body">

                        <textarea
                            className={`form-control ${commentSendingError ? "send-error" : ""}`}
                            rows="2"
                            onChange={e => commentHandler(e.target.value)}
                            placeholder="What are you thinking?"
                            value={commentText}
                            disabled={!!commentSending}
                        >

                        </textarea>

                        <div className={'d-flex justify-content-between'}>
                            <div className={'d-flex justify-content-around'}>

                                {

                                    showCancelBtn
                                        ?
                                        <Button className={'btn-sm'}
                                                variant={"outline-warning"}
                                                onClick={() => {
                                                    cancelWrightCommentHandler()
                                                }}
                                                disabled={!!commentSending}
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
                                                disabled={!!commentSending}
                                                onClick={onShowDeleteBtnHandler}
                                            >
                                                Delete
                                            </Button>

                                            {
                                                showDeleteBtn
                                                ?
                                                    <Button
                                                        className="btn-sm"
                                                        variant={"outline-danger"}
                                                        disabled={!!commentSending}
                                                        // onClick={deleteHandler}
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
                                    disabled={!!commentSending}
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

    </div>);
};

export default AddNewCommentComponent;