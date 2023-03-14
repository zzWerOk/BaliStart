import React, {useContext, useEffect, useState} from 'react';
import './Chat.css'
import {createMessage, getMessages, getMessagesNew, setMessagesSeen} from "../../../http/messagesAPI";
import {Context} from "../../../index";
import {dateToEpoch, epochToDate_userChatTimeOnly} from "../../../utils/consts";

const Chat = (props) => {
    const {userChatSelected, onCloseChat, onSeenHandler} = props

    const {user, messagesStore} = useContext(Context)

    const messagesEndRef = React.createRef()

    const [loading, setLoading] = useState(true)

    const [messages, setMessages] = useState([])
    const [messageText, setMessageText] = useState('')
    const [sendingMessage, setSendingMessage] = useState(false)
    const [sendMessageError, setSendMessageError] = useState(false)

    const [userChatAvatarImg, setUserChatAvatarImg] = useState()
    const [userAvatarImg, setUserAvatarImg] = useState()

    useEffect(() => {

        if (userChatSelected.userImg) {
            setUserChatAvatarImg(process.env.REACT_APP_API_URL + '/static/' + userChatSelected.userImg + '?' + Date.now())
        } else {
            setUserChatAvatarImg(process.env.REACT_APP_API_URL + '/static/guide_avatar.png')
        }

        if (user.avatar_img) {
            setUserAvatarImg(process.env.REACT_APP_API_URL + '/static/' + user.avatar_img + '?' + Date.now())
        } else {
            setUserAvatarImg(process.env.REACT_APP_API_URL + '/static/guide_avatar.png')
        }

    }, [])

    useEffect(() => {
        messagesStore.onNewMessageTrigger = () => {
            getNewMessage(messages)
        }
    }, [messages])

    useEffect(() => {
        setLoading(true)
        let isCanceled = false
        getMessages(userChatSelected.userId).then(async data => {

            if (data?.status === 'ok' && data?.data && data?.data?.count > 0 && data?.data?.rows && !isCanceled) {
                setMessages(data.data.rows)
                setMessagesSeenHandler(data.data.rows)
            } else {
                setMessages([])
            }

        }).catch((e) => {
            console.log(e)
        }).finally(() => {
            setLoading(false)
        })

        return () => {
            isCanceled = true
        };

    }, [])

    useEffect(() => {
        // if (isNewMessages) {
        //     messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
        // } else {
        messagesEndRef.current?.scrollIntoView();
        // }
    }, [messages]);

    const setMessagesSeenHandler = (messages) => {
        let messagesIdsArr = []


        for (let i = 0; i < messages.length; i++) {
            const currMessage = messages[i]

            if (userChatSelected.userId === currMessage.userIdTo && !currMessage.seenFrom) {
                messagesIdsArr.push(currMessage.id)
            }
            if (userChatSelected.userId === currMessage.userIdFrom && !currMessage.seenTo) {
                messagesIdsArr.push(currMessage.id)
            }

        }

        if (messagesIdsArr.length > 0) {
            setMessagesSeen(JSON.stringify(messagesIdsArr)).then(async data => {
                if (data?.status === 'ok') {
                    console.log('set seen - done')

                    const currMessages = JSON.parse(JSON.stringify(messages))
                    currMessages.map(message => {
                        if(userChatSelected.userId === message.userIdTo){
                            message.seenFrom = true

                        }
                        if(userChatSelected.userId === message.userIdFrom){
                            message.seenTo = true

                        }

                    })
                    setMessages(currMessages)
                }
            }).catch((e) => {
                console.log(e)
            }).finally(() => {
                onSeenHandler(userChatSelected)
            })
        }

    }

    const getNewMessage = (messages) => {
        // const dateBefore = userChatSelected.lastMessageDate
        let dateBefore = 0
        if (messages.length > 0) {
            dateBefore = dateToEpoch(messages[messages.length - 1].createdAt)
        }

        getMessagesNew(dateBefore, userChatSelected.userId).then(async data => {
            if (data?.status === 'ok' && data?.data && data?.data?.count > 0 && data?.data?.rows) {

                const currMessages = JSON.parse(JSON.stringify(messages))
                currMessages.push(...data.data.rows)
                setMessages(currMessages)

                setMessagesSeenHandler(currMessages)

            }

        }).catch((e) => {
            console.log(e)
        }).finally(() => {
        })
    }

    const sendNewMessage = () => {
        setSendingMessage(true)
        setSendMessageError(false)

        if (user?.isAuth && userChatSelected.userId > -1 && messageText) {

            createMessage(userChatSelected.userId, messageText).then(async data => {
                if (data?.status === 'ok' && data?.data) {
                    console.log('Message sent')
                    setMessageText('')
                    messagesStore.sendMessage(userChatSelected.userId, messageText)
                } else {
                    setSendMessageError(true)
                }
            }).catch((e) => {
                console.log(e)
                setSendMessageError(true)
            }).finally(() => {
                setSendingMessage(false)
            })
        } else {
            if (!user?.isAuth) {
                console.log('user?.isAuth')
                setSendMessageError(true)
            }
            if (userChatSelected.userId <= -1) {
                console.log('userChatSelected.userId <= -1')
                setSendMessageError(true)
            }
            if (!messageText) {
                console.log('message')
                setSendMessageError(true)
            }
        }
    }

    const handleMessageTextChange = (event) => {
        setMessageText(event.target.value)
    };

    if (loading) {

    } else {
        return (
            <div className={'d-flex flex-column border h-100'}

            >

                <div className={'d-flex justify-content-center align-items-center col-12 py-1 border-bottom'}>
                    <div className={'d-flex justify-content-center align-items-center col-10 '}>

                        <div
                            className={`col d-flex justify-content-end align-items-center px-1`}
                            style={{minHeight: '46px'}}
                        >
                            <img
                                src={userChatAvatarImg} alt="User avatar"
                                className="rounded-circle img-thumbnail shadow-sm"
                                style={{
                                    display: 'block',
                                    maxWidth: '46px',
                                    maxHeight: '46px',
                                    minWidth: '46px',
                                    minHeight: '46px',
                                    objectFit: 'cover',
                                    zIndex: '1'
                                }}/>
                        </div>
                        <div className={`col d-flex flex-column px-1`}>
                            <div className={'col text-truncate'}>
                                <strong>
                                    {userChatSelected.userName}
                                </strong>
                            </div>
                        </div>

                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn-close col"
                            onClick={() => {
                                if (onCloseChat) {
                                    onCloseChat()
                                }
                            }}
                        >
                        </button>
                    </div>
                </div>


                <div className=""
                     style={{
                         maxHeight: 'calc(100% - 120px',
                     }}
                >

                    <div className="chat-messages p-4 h-100"

                    >

                        {
                            messages.map(function (message, index) {
                                return (
                                    <div key={message.id + '' + index + "" + message.seen}
                                         ref={messagesEndRef}
                                         className={`${userChatSelected.userId === message.userIdFrom ? 'chat-message-left' : 'chat-message-right'}  pb-4`}>
                                        <div>
                                            <img
                                                src={userChatSelected.userId === message.userIdFrom ? userChatAvatarImg : userAvatarImg}
                                                alt={userChatSelected.userName}
                                                className="rounded-circle img-thumbnail shadow-sm"
                                                style={{
                                                    display: 'block',
                                                    maxWidth: '40px',
                                                    maxHeight: '40px',
                                                    minWidth: '40px',
                                                    minHeight: '40px',
                                                    objectFit: 'cover',
                                                    zIndex: '1'
                                                }}
                                            />

                                            <div
                                                className="text-muted small text-nowrap mt-2 text-center">{epochToDate_userChatTimeOnly(dateToEpoch(message.createdAt))}</div>
                                        </div>
                                        <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                            <div className="font-weight-bold mb-1">
                                                {
                                                    userChatSelected.userId === message.userIdFrom
                                                        ?
                                                        userChatSelected.userName
                                                        :
                                                        user.name
                                                }
                                            </div>
                                            {/*<div>*/}
                                            <div className={`${

                                                (userChatSelected.userId === message.userIdTo)
                                                    ?
                                                    (!message.seenFrom ? 'fw-bolder' : "")
                                                    :
                                                    (
                                                        (userChatSelected.userId === message.userIdFrom)
                                                            ?
                                                            (!message.seenTo ? 'fw-bolder' : "")
                                                            :
                                                            ''
                                                    )

                                            }
                                                `}>
                                                {message.message}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })

                        }

                    </div>
                </div>

                <div className={'d-flex py-3 px-3 border-top input-group'}
                     style={{
                         width: '100%',
                         textAlign: 'center',
                         padding: '20px'
                     }}
                >

                <textarea
                    className={`form-control`}
                    id="textarea-field"
                    rows={1}
                    onChange={handleMessageTextChange}
                    value={messageText}
                    disabled={sendingMessage}
                />

                    <button className={`btn ${sendMessageError ? 'btn-danger' : 'btn-secondary'}  `}
                            onClick={() => {
                                sendNewMessage()
                            }}
                            disabled={sendingMessage}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-send" viewBox="0 0 16 16">
                            <path
                                d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                        </svg>
                    </button>

                </div>


            </div>
        );
    }
};

export default Chat;