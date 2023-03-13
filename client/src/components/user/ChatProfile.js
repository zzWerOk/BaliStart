import React, {useEffect, useState} from 'react';
import UserChatCard from "./components/UserChatCard";
import {dateToEpoch, epochToDate_userChatWithTime} from "../../utils/consts";
import Chat from "./components/Chat";
import {getChatUsers} from "../../http/messagesAPI";

const ChatProfile = () => {

    const [loading, setLoading] = useState(true)

    const [userChatSelectedId, setUserChatSelectedId] = useState(-1)
    const [userChatSelected, setUserChatSelected] = useState(null)

    const [userChatList, setUserChatList] = useState([])

    useEffect(() => {
        setLoading(true)
        let isCanceled = false

        getChatUsers().then(async data => {

            if(data?.status === 'ok' && data?.data){
                setUserChatList(data.data)
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


    const selectUserChat = (userId) => {
        setUserChatSelectedId(userId)

        const filtered = userChatList.filter(function (value) {
            return value.userId === userId
        })
        setUserChatSelected({userId, userName: filtered[0].userName, userImg: filtered[0].userImg})
    }

    const onCloseChat = () => {
        setUserChatSelectedId(-1)
    }

    if(loading) {
    }else {
        return (
            <div className={'d-flex'}>
                {/*<div className={`${userChatSelectedId > -1 ? 'col-2 col-md' : 'col-12'} d-flex`}>*/}
                <div className={`d-flex ${userChatSelectedId > -1 ? 'col' : 'col'}`}>
                    <ul className={`list-group list-group-flush ${userChatSelectedId > -1 ? 'col' : 'col'}`}>
                        {/*<ul className={'list-group '}>*/}
                        {
                            userChatList.map(function (user, index) {
                                return (
                                    <UserChatCard key={user.userId + '' + index}
                                                  userId={user.userId}
                                                  userName={user.userName}
                                                  userImg={user.userImg}
                                                  userLastMessage={user.lastMessage}
                                                  isReaded={user.read}
                                                  lastMessageDate={epochToDate_userChatWithTime(dateToEpoch(user.lastMessageDate))}
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