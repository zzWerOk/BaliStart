import React, {useEffect, useState} from 'react';
import './TourGuidesDetailsCard.css'
import {dateToEpoch, epochToDateWithTime} from "../../../utils/consts";

const TourGuidesDetailsCard = (props) => {
    const {currGuide, index, tourGuideClicked, clickTourGuide, selectedGuideEdited, selectedGuideDates} = props

    const [isHover, setIsHover] = useState(false);
    const [guideImage, setGuideImage] = useState('');
    const [loading, setLoading] = useState(true);

    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };

    useEffect(() => {
        setLoading(true)

        if (currGuide.hasOwnProperty('avatar_img') && currGuide.avatar_img !== '') {
            setGuideImage(process.env.REACT_APP_API_URL + '/static/' + currGuide.avatar_img + '?' + Date.now())
        } else {
            setGuideImage(process.env.REACT_APP_API_URL + '/static/' + 'guide_avatar.png' + '?' + Date.now())
        }

        setLoading(false)
    }, [])

    if (loading) {

    } else {
        return (
            <div key={currGuide.id + ' ' + index}
                 className={`${tourGuideClicked === currGuide.id ? 'col-xl-12' : 'col-xl-4'} mb-4 `}
            >
                <div className={` rounded py-3 px-4 ${isHover ? 'shadow' : 'shadow-sm'} 
             
            ${selectedGuideEdited ? 'clicked' : null} 
            ${tourGuideClicked === currGuide.id ? 'd-flex justify-content-start' : null}`}
                     onMouseEnter={handleMouseEnter}
                     onMouseLeave={handleMouseLeave}
                     onClick={() => {
                         clickTourGuide(currGuide.id)
                     }}
                >

                    {
                        <>
                            <div className={`${tourGuideClicked === currGuide.id ? 'col-3' : null}`}>
                                <img
                                    src={guideImage} alt="Guide avatar"
                                    className={`rounded-circle mb-3 img-thumbnail shadow-sm`}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',

                                        backgroundColor: `${currGuide.is_active ? null : 'gray'}`,
                                    }}/>
                                <h5 className="mb-0">{currGuide.name}</h5><span
                                className="small text-muted">{currGuide.email}</span>

                            </div>

                            {
                                tourGuideClicked === currGuide.id
                                    ?
                                    <div className={'col'}>
                                        <div className="card-body">

                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">User registered date</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    {/*<span> {epochToDateWithTime(dateToEpoch(currGuide.createdAt))} </span>*/}
                                                    {
                                                        selectedGuideDates.createdAt
                                                            ?
                                                            <span> {epochToDateWithTime(dateToEpoch(selectedGuideDates.createdAt))} </span>
                                                            :
                                                            null
                                                    }
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">User edited date</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    {/*<span> {epochToDateWithTime(dateToEpoch(currGuide.updatedAt))} </span>*/}
                                                    {
                                                        selectedGuideDates.updatedAt
                                                            ?
                                                            <span> {epochToDateWithTime(dateToEpoch(selectedGuideDates.updatedAt))} </span>
                                                            :
                                                            null
                                                    }
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">User last login date</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <span> {epochToDateWithTime(currGuide.date_last_login)} </span>
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

export default TourGuidesDetailsCard;