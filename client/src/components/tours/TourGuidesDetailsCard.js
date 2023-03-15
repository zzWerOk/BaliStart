import React, {useEffect, useState} from 'react';
import './TourGuidesDetailsCard.css'
import ElementName from "../topics/components/ElementName";
import ElementText from "../topics/components/ElementText";
import TopicDetailPhoneComponent from "../topics/components/TopicDetailPhoneComponent";
import ElementEmail from "../topics/components/ElementEmail";
import TopicDetailLinkComponent from "../topics/components/TopicDetailLinkComponent";

const TourGuidesDetailsCard = (props) => {
    const {currGuide, index, tourGuideClicked, clickTourGuide} = props

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

    const getGuideLanguagesEl = () => {
        const langArr = JSON.parse(currGuide.languages)
        return langArr.map(lang => {
            switch (lang) {
                case "ru":
                    return 'Russian '
                case "en":
                    return 'English '
                case "id":
                    return 'Indonesian '
            }
        })
    }

    if (loading) {

    } else {
        return (
            <div key={currGuide.id + ' ' + index}
                 className={`${tourGuideClicked === currGuide.id ? 'col-xl-12' : 'col-xl-4'} mb-4 `}
                 onClick={() => {
                     if (tourGuideClicked !== currGuide.id) {
                         clickTourGuide(currGuide.id)
                     }
                 }}

            >
                <div className={` rounded py-3 px-md-4 ${isHover ? 'shadow' : 'shadow-sm'}
                                ${tourGuideClicked === currGuide.id ? 'd-block d-md-flex justify-content-start' : null} `}
                     style={{
                         paddingRight: '15px',
                         paddingLeft: '5px',
                     }}
                     onMouseEnter={handleMouseEnter}
                     onMouseLeave={handleMouseLeave}
                >

                    {

                        <>
                            <div className={`${tourGuideClicked === currGuide.id ? 'col-12 col-md-3' : ''}
                                        ${tourGuideClicked === currGuide.id ? 'clicked' : ''}`}
                                 onClick={() => {
                                     if (tourGuideClicked === currGuide.id) {
                                         clickTourGuide(currGuide.id)
                                     }
                                 }}
                            >
                                <div className={'d-flex d-md-block align-items-center justify-content-center'}>
                                    <img
                                        src={guideImage} alt="Guide avatar"
                                        width="100"
                                        className={`rounded-circle mb-3 img-thumbnail shadow-sm`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                        }}/>
                                    <div>
                                        <h5 className="mb-0">{currGuide.name}</h5>
                                        <span
                                            className="small text-uppercase text-muted">&nbsp;{currGuide.about}&nbsp;
                                    </span>
                                    </div>
                                </div>

                            </div>

                            {
                                tourGuideClicked === currGuide.id
                                    ?
                                    <div className={'col-12 col-md-9'}>
                                        <div className={'row d-flex justify-content-around'}>
                                            <div className={'col-11'}>

                                            </div>
                                            <div className={'col-1'}>
                                                <button className={'btn-close'}
                                                        onClick={() => {
                                                            clickTourGuide(currGuide.id)
                                                        }}
                                                >
                                                </button>
                                            </div>
                                        </div>
                                        <div className={'row'}>
                                            {
                                                currGuide.experience && currGuide.experience > 0
                                                    ?
                                                    <>
                                                        <div className={'row d-flex align-content-center'}>
                                                            <div className={'col-5'}>
                                                                {/*<ElementName name={'Guide experience (years)'}/>*/}
                                                                <span className="">{'Guide experience (years)'}</span>
                                                            </div>
                                                            <div className={'col-7'}>
                                                                <ElementText text={currGuide.experience}/>
                                                            </div>
                                                        </div>
                                                        <hr/>
                                                    </>
                                                    :
                                                    null
                                            }
                                            <div className={'row d-flex align-content-center'}>
                                                <div className={'col-5'}>
                                                    <span className="">{'Guide email'}</span>
                                                </div>
                                                <div className={'col-7'}>
                                                    <ElementEmail item={currGuide.email}/>
                                                    <br/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className={'row d-flex align-content-center'}>
                                                <div className={'col-5'}>
                                                    <span className="">{'Languages'}</span>
                                                </div>
                                                <div className={'col-7'}>
                                                    <ElementText text={getGuideLanguagesEl()}/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className={'row d-flex align-content-center'}>
                                                <div className={'col-5'}>
                                                    <span className="">{'Links'}</span>
                                                </div>
                                                <div className={'col-7'}>
                                                    <TopicDetailLinkComponent fieldWidth={'full'} element={{
                                                        name: '',
                                                        items: currGuide.links
                                                    }}/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className={'row d-flex align-content-center'}>
                                                <div className={'col-5'}>
                                                    <span className="">{'Contacts'}</span>
                                                </div>
                                                <div className={'col-7'}>
                                                    <TopicDetailPhoneComponent fieldWidth={'full'} element={{
                                                        name: '',
                                                        items: currGuide.phones
                                                    }}/>
                                                </div>
                                            </div>

                                            {
                                                currGuide.religion && currGuide.religion !== ''
                                                    ?
                                                    <>
                                                        <hr/>
                                                        <div className={'row d-flex align-content-center'}>
                                                            <div className={'col-5'}>
                                                                <ElementName name={'Religion'}/>
                                                            </div>
                                                            <div className={'col-7'}>
                                                                <ElementText text={currGuide.religion}/>
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    null
                                            }
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