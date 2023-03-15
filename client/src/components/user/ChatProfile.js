import React, {useContext, useEffect, useState} from 'react';
import UserChatCard from "./components/UserChatCard";
import {epochToDate_userChatWithTime} from "../../utils/consts";
import Chat from "./components/Chat";
import {getChatUsers} from "../../http/messagesAPI";
import {Context} from "../../index";

const ChatProfile = () => {
    const {messagesStore} = useContext(Context)

    const [loading, setLoading] = useState(true)

    const [userChatSelectedId, setUserChatSelectedId] = useState(-1)
    const [userChatSelected, setUserChatSelected] = useState(null)

    const [userChatList, setUserChatList] = useState([])

    useEffect(() => {
        setLoading(true)
        let isCanceled = false

        getNewChatUsers()

        return () => {
            isCanceled = true
        };
    }, [])

    useEffect(() => {
        messagesStore.onNewMessageTriggerChatUsers = () => {
            getNewChatUsers()
        }
    }, [])

    const getNewChatUsers = () => {

        getChatUsers().then(async data => {

            if (data?.status === 'ok' && data?.data) {

                const newArr = JSON.parse(JSON.stringify(data.data))

                newArr.sort((a, b) => (a.lastMessageDate < b.lastMessageDate) ? 1 : ((b.lastMessageDate < a.lastMessageDate) ? -1 : 0))

                setUserChatList(newArr)

                let isHasUnseen = false
                for(let i = 0;i < data.data.length;i++){
                    const currChatUser = data.data[i]
                    if(!currChatUser.read){
                        isHasUnseen = true
                        break
                    }
                }
                messagesStore.checkNewMessagesNav(isHasUnseen)

                // setUserChatList(data.data)
            }

        }).catch((e) => {
            console.log(e)
        }).finally(() => {
            setLoading(false)
        })

    }

    const selectUserChat = (userId) => {
        setUserChatSelectedId(userId)

        const filtered = userChatList.filter(function (value) {
            return value.userId === userId
        })
        setUserChatSelected({
            userId,
            userName: filtered[0].userName,
            userImg: filtered[0].userImg,
            lastMessageDate: filtered[0].lastMessageDate,
            read: filtered[0].read,
        })
    }

    const onSeenHandler = (userChatSelected) => {

        const newUserChatSelected = JSON.parse(JSON.stringify(userChatSelected))
        newUserChatSelected.read = true
        setUserChatSelected(newUserChatSelected)

        const newUserChatList = JSON.parse(JSON.stringify(userChatList))
        for (let i = 0; i < newUserChatList.length; i++) {
            if (newUserChatList[i].userId === userChatSelected.userId) {
                newUserChatList[i].read = true
                break
            }
        }
        setUserChatList(newUserChatList)

        let isHasUnseen = false
        for(let i = 0;i < newUserChatList.length;i++){
            const currChatUser = newUserChatList[i]
            if(!currChatUser.read){
                isHasUnseen = true
                break
            }
        }
        messagesStore.checkNewMessagesNav(isHasUnseen)

    }

    const onCloseChat = () => {
        setUserChatSelectedId(-1)
    }

    if (loading) {
    } else {
        return (
            <div className={'d-flex'}>
                <div className={`d-flex ${userChatSelectedId > -1 ? 'col' : 'col'}`}>
                    <ul className={`list-group list-group-flush ${userChatSelectedId > -1 ? 'col' : 'col'}`}>
                        {
                            userChatList.map(function (user, index) {
                                return (
                                    <UserChatCard
                                        key={user.userId + '' + index + '' + ((user.userId === userChatSelected?.userId) ? userChatSelected?.read : user.read)}
                                        userId={user.userId}
                                        userName={user.userName}
                                        userImg={user.userImg}
                                        userLastMessage={user.lastMessage}
                                        isReaded={((user.userId === userChatSelected?.userId) ? userChatSelected?.read : user.read)}
                                        lastMessageDate={epochToDate_userChatWithTime(user.lastMessageDate)}
                                        userChatSelected={userChatSelectedId}
                                        onUserChatClick={selectUserChat}
                                    />
                                )
                            })
                        }
                    </ul>
                </div>

                {

                    userChatSelectedId > -1
                        ?
                        <div className={'col-10 '}
                             style={{height: 'calc(100vh - 129px'}}
                        >
                            <Chat key={userChatSelected.userId}
                                  userChatSelected={userChatSelected}
                                  onCloseChat={onCloseChat}
                                  onSeenHandler={onSeenHandler}
                            />
                        </div>
                        :
                        null

                }

            </div>
        );
    }
};

export default ChatProfile;