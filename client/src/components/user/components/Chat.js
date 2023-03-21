import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import './Chat.css'
import {createMessage, deleteMessage, getMessages, getMessagesNew, setMessagesSeen} from "../../../http/messagesAPI";
import {Context} from "../../../index";
import {
    dateToEpoch,
    epochToDate_guide,
    epochToDate_userChatTimeOnly,
} from "../../../utils/consts";
import InfiniteScroll from "react-infinite-scroll-component";
import {Nav, Overlay, Popover} from "react-bootstrap";

const Chat = (props) => {
    const {userChatSelected, onCloseChat, onSeenHandler} = props

    const {user, messagesStore} = useContext(Context)

    const messagesEndRef = React.createRef()

    const [isCanEdit, setIsCanEdit] = useState(false);
    const [isCanDelete, setIsCanDelete] = useState(false);

    const [editedMessage, setEditedMessage] = useState(null);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [overlayShow, setOverlayShow] = useState(false);
    const [overlayTarget, setOverlayTarget] = useState(null);
    const overlayRef = useRef(null);

    const [loading, setLoading] = useState(true)

    const [hasMoreMessages, setHasMoreMessages] = useState(false)

    const [messages2, setMessages2] = useState([])
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

        messagesStore.onMessageDeletedTrigger = (messageId, userIdFrom) => {

            if((userChatSelected.userId + '') === (userIdFrom + '')) {
                const messagesArr = JSON.parse(JSON.stringify(messages))
                for (let i = 0; i < messagesArr.length; i++) {
                    if (messagesArr[i].id + '' === messageId + '') {

                        const filtered = messages.filter(function (value) {
                            return value.id + '' !== messageId + ''
                        })

                        setMessages(filtered)
                        setUpMessages(filtered)

                        if(messagesArr[messagesArr.length - 1].id === messagesArr[i].id) {
                            messagesStore.getNewMessages()
                        }

                        break
                    }
                }
            }
        }

        messagesStore.onMessageEditedTrigger = (messageId, userIdFrom, messageText) => {

            const messagesArr = messages
            for (let i = 0; i < messagesArr.length; i++) {
                if (messagesArr[i].id + '' === messageId + '') {
                    messagesArr[i].message = messageText
                    setMessages(messagesArr)
                    setUpMessages(messagesArr)

                    break
                }
            }


        }

    }, [messages])

    useEffect(() => {
        setLoading(true)
        let isCanceled = false

        getMessages(userChatSelected.userId, messages.length).then(async data => {

            if (data?.status === 'ok' && data?.data && data?.data?.count > 0 && data?.data?.rows && !isCanceled) {
                setMessages(data.data.rows)

                setHasMoreMessages(data.data.count > data.data.rows.length)

                setMessagesSeenHandler(data.data.rows)
                setUpMessages(data.data.rows)
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

    const loadMoreMessages = useCallback(() => {

        if (messages) {
            getMessages(userChatSelected.userId, messages.length).then(async data => {

                if (data?.status === 'ok' && data?.data && data?.data?.count > 0 && data?.data?.rows) {
                    // const currMessages = JSON.parse(JSON.stringify(messages))
                    const newMessagesArr = [...data.data.rows, ...messages]

                    setMessages(newMessagesArr)
                    setHasMoreMessages(data.data.count > newMessagesArr.length)

                    setMessagesSeenHandler(data.data.rows)
                    setUpMessages(newMessagesArr)
                }

            }).catch((e) => {
                console.log(e)
            }).finally(() => {
                // setLoading(false)
            })
        }
    }, [messages]);

    const setUpMessages = (messages) => {

        const currMessagesArr = JSON.parse(JSON.stringify(messages))
        const newMessagesArr = {}
        const newMessagesIdsArr = []
        let messageDate = ''
        let messageTime = ''
        let isSameTime = false
        let lastUserFromId = -1
        let lastNewMessageId = '-1'
        let newMessage = {messages: []}
        currMessagesArr.map(function (item) {


            if (item !== null) {

                const currMessageDate = epochToDate_guide(dateToEpoch(item.createdAt))
                const currMessageTime = epochToDate_userChatTimeOnly(dateToEpoch(item.createdAt))

                const newMessageId = `${item.userIdFrom}${item.userIdTo}${currMessageTime}${currMessageDate}`

                if (newMessageId !== lastNewMessageId) {
                    lastNewMessageId = newMessageId
                    newMessage = {messages: []}
                }

                if (messageDate !== currMessageDate) {
                    newMessagesArr[newMessageId + 'date'] = {date: currMessageDate}
                    newMessagesIdsArr.push(newMessageId + 'date')
                    messageDate = "" + currMessageDate
                }

                if (newMessagesIdsArr.length > 0) {
                    if (newMessagesIdsArr[newMessagesIdsArr.length - 1] !== newMessageId) {
                        newMessagesIdsArr.push(newMessageId)
                    }
                }

                if (lastUserFromId !== item.userIdFrom) {
                    lastUserFromId = item.userIdFrom
                }


                newMessage.messages.push(item)
                newMessage.userIdFrom = item.userIdFrom
                newMessage.createdAt = item.createdAt

                if (currMessageTime !== messageTime) {
                    messageTime = currMessageTime
                    isSameTime = true
                }

                newMessagesArr[newMessageId] = newMessage
            }
        })

        const lastMessagesArr = []
        newMessagesIdsArr.map(messageId => {
            lastMessagesArr.push({item: newMessagesArr[messageId], id: messageId})
        })

        setMessages2(lastMessagesArr.reverse())


        return newMessagesArr
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
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

                    const currMessages = JSON.parse(JSON.stringify(messages))
                    currMessages.map(message => {
                        if (userChatSelected.userId === message.userIdTo) {
                            message.seenFrom = true
                        }
                        if (userChatSelected.userId === message.userIdFrom) {
                            message.seenTo = true
                        }

                    })
                    setUpMessages(currMessages)

                }
            }).catch((e) => {
                console.log(e)
            }).finally(() => {
                onSeenHandler(userChatSelected)
            })
        }

    }

    const getNewMessage = (messages) => {
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

                setUpMessages(currMessages)
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

            createMessage(userChatSelected.userId, messageText, editedMessage?.id).then(async data => {


                if (data?.status === 'ok' && data?.data) {
                    editMessageCancel()
                    if (editedMessage === null) {
                        messagesStore.sendMessage(userChatSelected.userId, messageText)
                    } else {
                        changeSelectedMessage(messageText)
                        messagesStore.editMessage(userChatSelected.userId, selectedMessage.id, selectedMessage.userIdFrom, messageText)

                        if(messages[messages.length - 1].id === selectedMessage.id) {
                            console.log('Last message')
                            messagesStore.getNewMessages()
                        }

                    }

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
            setSendingMessage(false)
        }
    }

    const handleMessageTextChange = (event) => {
        setMessageText(event.target.value)
    };


    const editMessageCancel = () => {
        setSelectedMessage(prev => prev = null)
        setEditedMessage(prev => prev = null)
        setMessageText('')
        setOverlayShow(false);
    }

    const changeSelectedMessage = (newMessageText) => {
        const messagesArr = messages
        for (let i = 0; i < messagesArr.length; i++) {
            if (messagesArr[i].id + '' === selectedMessage.id + '') {
                messagesArr[i].message = newMessageText
                setMessages(messagesArr)
                setUpMessages(messagesArr)
                break
            }
        }
    }

    const editMessage = (value) => {
        setEditedMessage(value)
        setMessageText(value.message)
        setOverlayShow(false);
    }

    const deleteSelectedMessage = () => {

        const messagesArr = JSON.parse(JSON.stringify(messages))
        for (let i = 0; i < messagesArr.length; i++) {
            if (messagesArr[i].id + '' === selectedMessage.id + '') {
                // delete messagesArr[i]

                const filtered = messages.filter(function (value) {
                    return value.id + '' !== selectedMessage.id + ''
                })

                messagesStore.deleteMessage(userChatSelected.userId, selectedMessage.id, selectedMessage.userIdFrom)

                setMessages(filtered)
                setUpMessages(filtered)

                if(messagesArr[messagesArr.length - 1].id === selectedMessage.id) {
                    messagesStore.getNewMessages()
                }


                break
            }
        }
    }

    const deleteMessageById = (value) => {
        setSendingMessage(true)

        try {
            deleteMessage(value.id).then(async data => {

                if (data?.status === 'ok') {
                    deleteSelectedMessage()
                    editMessageCancel()
                    // setOverlayShow(false);
                }

            }).finally(() => {
                setSendingMessage(false)
            })

        } catch (e) {
            setSendingMessage(false)
            console.log(e.message)
        }
    }

    useEffect(() => {
        // add event listener to document when popover is open
        if (overlayShow) {
            const handleClickOutside = (event) => {
                if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                    // editMessageCancel()
                    setOverlayShow(false);
                    setSelectedMessage(null)
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                // remove event listener when popover is closed or component unmounts
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [overlayShow, overlayRef.current]);

    const overlayHandleClick = (event) => {

        const currTarget = event.target

        currTarget.setAttribute('ref',overlayRef)

        const messageId = currTarget.getAttribute('id')

        const filtered = messages.filter(function (value) {
            return value.id + '' === messageId + ''
        })

        if (filtered.length > 0) {
            if (filtered[0].userIdFrom + '' === userChatSelected.userId + '') {
                setIsCanEdit(false)
                setIsCanDelete(false)
            } else {
                setIsCanEdit(true)
                setIsCanDelete(true)
            }
            setSelectedMessage(filtered[0])
        }

        const isNotClickable = currTarget.getAttribute('notclickable')

        if (!isNotClickable) {
            setOverlayShow(true);
            setOverlayTarget(event.target);
        }
    }

    const getOverlay = () => {

        return (
            <Overlay
                show={overlayShow}
                target={overlayTarget}
                placement="bottom"
                container={overlayRef}
                containerPadding={20}
            >
                <Popover>
                    <Popover.Body
                        notclickable='true'
                    >

                        <div
                            className={'d-flex flex-column justify-content-center'}
                        >

                            <div
                                className={' px-1 d-flex justify-content-center'}>
                                <Nav.Item notclickable='true'
                                          style={{
                                              // color: "red"
                                          }}
                                          className={`${!isCanEdit ? 'text-secondary' : ''}`}
                                          onClick={() => {
                                              if (isCanEdit) {
                                                  editMessage(selectedMessage)
                                              }
                                          }}>
                                    Edit message
                                </Nav.Item>
                            </div>
                            <div
                                className={'pt-2 mt-2 px-0 d-flex justify-content-center'}
                                style={{
                                    borderTop: '1px solid rgba(40, 44, 52, 0.2)',
                                }}
                            >
                                <Nav.Item notclickable='true'
                                          variant="danger"
                                          className={`${!isCanDelete ? 'text-secondary' : ''}`}
                                          onClick={() => {
                                              if (isCanDelete) {
                                                  deleteMessageById(selectedMessage)
                                              }
                                          }}>
                                    Delete
                                </Nav.Item>
                            </div>

                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>
        )
    }

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
                         id="scrollableDiv"
                         style={{
                             display: 'flex',
                             flexDirection: 'column-reverse',
                         }}
                    >
                        <InfiniteScroll
                            dataLength={messages2.length}
                            // next={() => {loadMoreMessages(messages)}}
                            next={loadMoreMessages}
                            style={{
                                display: 'flex',
                                flexDirection: 'column-reverse'
                            }} //To put endMessage and loader to the top.
                            inverse={true} //
                            hasMore={hasMoreMessages}
                            loader={
                                <>
                                    <div
                                        className={'p-1 mx-5 mb-2 mt-0 d-flex align-items-center justify-content-center align-self-center'}
                                    >
                                            <span
                                                className="badge rounded-pill badge-dark py-2 px-3"
                                            >
                                                Loading...
                                            </span>
                                    </div>
                                </>
                            }
                            scrollableTarget="scrollableDiv"
                        >
                            {
                                messages2.map(function (item, indexM) {
                                    return (
                                        item?.item?.hasOwnProperty('date')
                                            ?
                                            <div key={item.id + '' + indexM + item?.item?.messages?.length}
                                                 className={'p-1 mx-5 mb-2 mt-0 d-flex align-items-center justify-content-center align-self-center'}
                                            >
                                            <span
                                                className="badge rounded-pill badge-light py-2 px-3"
                                            >
                                                {item.item.date}
                                            </span>
                                            </div>
                                            :
                                            <div key={item.item.id + '' + indexM}
                                                // ref={messagesEndRef}
                                            >

                                                <div
                                                    // ref={messagesEndRef}
                                                    className={` ${userChatSelected.userId === item.item.userIdFrom ? 'chat-message-left' : 'chat-message-right'} ${!item?.item?.isSame ? 'pt-2 pb-1' : 'pb-1'} `}>
                                                    <div>
                                                        {
                                                            !item?.item?.isSame
                                                                ?
                                                                <img
                                                                    src={userChatSelected.userId === item.item.userIdFrom ? userChatAvatarImg : userAvatarImg}
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
                                                                :
                                                                null
                                                        }
                                                        <div
                                                            className="text-muted small text-nowrap mt-2 text-center"
                                                        >
                                                            {epochToDate_userChatTimeOnly(dateToEpoch(item.item.createdAt))}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                                        {
                                                            !item?.item?.isSame
                                                                ?

                                                                <div className="font-weight-bold mb-1">
                                                                    {
                                                                        userChatSelected.userId === item.item.userIdFrom
                                                                            ?
                                                                            userChatSelected.userName
                                                                            :
                                                                            user.name
                                                                    }
                                                                </div>
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item?.item?.messages.map(function (message, index) {
                                                                const messageId = message.id
                                                                return (
                                                                    // <div key={message.id + '' + index + ""}
                                                                    <div key={messageId + '' + index + "" + message.message}
                                                                         ref={overlayRef}

                                                                         onClick={overlayHandleClick}
                                                                    >
                                                                        <div id={messageId}
                                                                             className={`${

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
                                                                        `}
                                                                        >
                                                                            {
                                                                                (messageId + '') === (selectedMessage?.id + '')
                                                                                    ?
                                                                                    <div className={'text-info'}>
                                                                                        {message.message}
                                                                                    </div>
                                                                                    :
                                                                                    <>
                                                                                        {message.message}
                                                                                    </>
                                                                            }

                                                                        </div>

                                                                    </div>
                                                                )
                                                            })
                                                        }


                                                    </div>
                                                </div>


                                            </div>

                                    )
                                })
                            }

                            {
                                overlayShow
                                    ?
                                    getOverlay()
                                    :
                                    null
                            }

                        </InfiniteScroll>


                    </div>

                    {
                        editedMessage
                            ?
                            <div className={'bg-secondary col-12'}
                                 style={{
                                     position: 'relative',
                                     marginTop: '-34px',
                                     borderTopRightRadius: '7px',
                                     borderTopLeftRadius: '7px',
                                     zIndex: '10',
                                 }}
                            >
                                <small className={'d-flex justify-content-center text-light col-12 p-2'}
                                       style={{}}
                                >
                                    Editing message:
                                    <div className={'font-italic text-truncate col-7 col-md-9'}>
                                        {editedMessage.message}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-close col "
                                        onClick={() => {
                                            editMessageCancel()
                                        }}
                                    >
                                    </button>

                                </small>

                            </div>
                            :
                            null
                    }
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
        )
            ;
    }
};

export default Chat;