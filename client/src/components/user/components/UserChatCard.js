import React, {useEffect, useState} from 'react';

const UserChatCard = (props) => {
    const {
        userId,
        userName,
        isReaded,
        userImg,
        userLastMessage,
        lastMessageDate,
        userChatSelected,
        onUserChatClick
    } = props

    const [userAvatarImg, setUserAvatarImg] = useState()

    useEffect(() => {

        if (userImg) {
            setUserAvatarImg(process.env.REACT_APP_API_URL + '/static/' + userImg + '_th?' + Date.now())
        } else {
            setUserAvatarImg(process.env.REACT_APP_API_URL + '/static/guide_avatar_th.png')
        }


    }, [])

    return (
        <li className={`d-flex ${userChatSelected > -1 ? 'col-12' : 'col-12'} p-2 list-group-item ${userChatSelected === userId ? 'btn-primary' : 'btn-outline-dark'} `}
            onClick={() => {
                onUserChatClick(userId)
            }}
        >

            <div
                className={`${userChatSelected > -1 ? 'col-12' : 'col-2'} d-flex justify-content-center align-items-center`}
                style={{minHeight: '46px'}}
            >
                <img
                    src={userAvatarImg} alt="Guide avatar chat"
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
                {
                    !isReaded
                        ?
                        <span className="badge badge-pill rounded-9 badge-danger"
                              style={{
                                  // backgroundColor: '#F44336',
                                  backgroundColor: '#2979FF',
                                  position: "relative",
                                  left: '-12px',
                                  top: '17px',
                                  zIndex: '10',
                                  padding: '7px'
                              }}
                        > </span>
                        :
                        null
                }
            </div>
            <div className={`col-10 d-flex flex-column ${userChatSelected > -1 ? 'd-none' : 'd-block'}`}>
                <div className={'row'}>
                    <div className={'col text-truncate'}>
                        <strong>
                            {userName}
                        </strong>
                    </div>
                    <div className={'col-5 text-truncate d-flex justify-content-end'}>
                        {lastMessageDate !== ''
                            ?
                            <small>
                                {lastMessageDate}
                            </small>
                            :
                            null
                        }
                    </div>
                </div>
                <div className={'row text-truncate'}>
                    <small className={'text-truncate'}
                           style={{
                               fontWeight: `${isReaded ? '400' : '700'}`,
                               opacity: '75%'
                           }}
                    >
                        {userLastMessage}
                    </small>
                </div>
            </div>

        </li>
    );
};

export default UserChatCard;