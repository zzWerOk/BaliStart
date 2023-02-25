import React, {useEffect, useState} from 'react';
import './UserDetailsCard.css'
import {dateToEpoch, epochToDateWithTime} from "../../../utils/consts";

const UserDetailsCard = (props) => {
    const {currUser, index, userClicked, clickUser, selectedUserEdited} = props

    const [isHover, setIsHover] = useState(false);
    const [userImage, setUserImage] = useState('');
    const [loading, setLoading] = useState(true);

    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };

    useEffect(() => {
        setLoading(true)

        if (currUser.hasOwnProperty('avatar_img') && currUser.avatar_img !== '') {
            setUserImage(process.env.REACT_APP_API_URL + '/static/' + currUser.avatar_img + '?' + Date.now())
        } else {
            setUserImage(process.env.REACT_APP_API_URL + '/static/' + 'guide_avatar.png' + '?' + Date.now())
        }

        setLoading(false)
    }, [])

    if (loading) {

    } else {
        return (
            <div key={currUser.id + ' ' + index}
                 className={`${userClicked === currUser.id ? 'col-xl-12' : 'col-xl-4'} mb-4 `}
            >
                <div className={` rounded py-3 px-4 ${isHover ? 'shadow' : 'shadow-sm'} 
             
            ${selectedUserEdited ? 'clicked' : null} 
            ${userClicked === currUser.id ? 'd-flex justify-content-start' : null}`}
                     onMouseEnter={handleMouseEnter}
                     onMouseLeave={handleMouseLeave}
                     onClick={() => {
                         clickUser(currUser.id)
                     }}
                     style={{
                         opacity: `${currUser.is_active ? '100$' : '75%'}`,
                         backgroundColor: `${currUser.is_active ? 'null' : '#ececec'}`,
                     }}
                >

                    {

                        <>
                            <div className={`${userClicked === currUser.id ? 'col-3' : null} `}>
                                <img
                                    src={userImage} alt="Guide avatar"
                                    className={`rounded-circle mb-3 img-thumbnail shadow-sm`}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',

                                        backgroundColor: `${currUser.is_active ? null : 'gray'}`,
                                    }}
                                />
                                <h5 className="mb-0">{currUser.name}</h5><span
                                className="small text-muted">{currUser.email}</span>
                            </div>

                            {
                                userClicked === currUser.id
                                    ?
                                    <div className={'col'}>
                                        <div className="card-body">

                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">User registered date</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <span> {epochToDateWithTime(dateToEpoch(currUser.createdAt))} </span>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">User edited date</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <span> {epochToDateWithTime(dateToEpoch(currUser.updatedAt))} </span>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">User last login date</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <span> {epochToDateWithTime(currUser.date_last_login)} </span>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                    :
                                    null
                            }

                        </>
                    }

                </div>

            </div>
        );
    }
};

export default UserDetailsCard;