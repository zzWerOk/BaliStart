import React, {useEffect, useState} from 'react';
import GuideTextComponent from "../../guides/components/GuideTextComponent";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import GuidePhoneComponent from "../../guides/components/GuidePhoneComponent";
import noImageLogo from "../../../img/nophoto.jpg";
import {MDBFile} from "mdb-react-ui-kit";

const TourGuideEditCard = () => {

    const [loading, setLoading] = useState(true)
    const [currGuide, setCurrGuide] = useState({})
    const [guideImageLogo, setGuideImageLogo] = useState(false)
    const [guideAvatar, setGuideAvatar] = useState('')

    useEffect(() => {
        setLoading(true)

        setCurrGuide({languages: [], phones: []})

        if (currGuide.avatar_img) {
            setGuideAvatar(currGuide.avatar_img + '?' + Date.now())
        }


        setLoading(false)
    }, [])

    const onLanguageSelectHandler = (value) => {
        const currLangArr = currGuide.languages
        const found = currLangArr.find(element => element === value)
        if (found) {
            const filtered = currLangArr.filter(function (value) {
                return value !== found;
            })
            currGuide.languages = JSON.stringify(filtered)
        } else {
            currGuide.languages = JSON.stringify([...currLangArr, value])
        }
    }

    const phonesEditHandler = (phones) => {
        currGuide.phones = phones
    }

    const onFileChooseHandler = (fileName) => {
        if (fileName) {
            setGuideImageLogo(true)
        } else {
            setGuideImageLogo(false)
        }
        currGuide.avatar_img = fileName
    }

    if (loading) {

    } else {
        return (
            <section style={{backgroundColor: '#eee', marginRight: '20px', marginBottom: '25px'}}>
                <div className="container py-5"
                >

                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">

                                    <div
                                        className={'d-flex align-items-center justify-content-center'}
                                    >
                                        <div
                                            style={{
                                                height: '250px',
                                                overflow: 'hidden',
                                                margin: 0,
                                            }}>

                                            <img
                                                src={guideAvatar
                                                    ?
                                                    `${process.env.REACT_APP_API_URL}/static/${guideAvatar}`
                                                    :
                                                    noImageLogo
                                                }
                                                style={{
                                                    objectFit: 'cover',
                                                    position: 'absolute',
                                                    width: '150px',
                                                    // top: '50px',
                                                    left: '50%',
                                                    transform: 'translate(-50%, 10%)',
                                                }}
                                                alt="avatar"
                                                className="rounded-circle img-fluid"
                                            />
                                        </div>

                                        <MDBFile
                                            className={`btn w-75 ${guideImageLogo ? 'btn-primary' : 'btn-secondary'} `}
                                            id='topicLogo'
                                            style={{
                                                position: 'absolute',
                                                top: '200px'
                                            }}
                                            onChange={e => {
                                                onFileChooseHandler(e.target.files[0])
                                            }}
                                        />
                                    </div>


                                    <GuideTextComponent className="my-3" placeholder={'Visible Name'}/>
                                    <GuideTextComponent className="my-3" placeholder={'About guide (few words)'}/>
                                    <GuideTextComponent className="my-3" placeholder={'Guide religion'}/>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Email</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <GuideTextComponent className="" placeholder={'E-mail'}/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Experience as a guide</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <GuideTextComponent className=""
                                                                placeholder={'Experience as a guide (years)'}/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Language</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <div>
                                                <ToggleButtonGroup type="checkbox" name="activity"
                                                                   defaultValue={currGuide.languages}>
                                                    <ToggleButton
                                                        variant={'outline-primary'}
                                                        id={`language-check-1`}
                                                        value={'en'}
                                                        onClick={() => {
                                                            onLanguageSelectHandler('en')
                                                        }}
                                                    >
                                                        English
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        variant={'outline-primary'}
                                                        id={`language-check-2`}
                                                        value={'ru'}
                                                        onClick={() => {
                                                            onLanguageSelectHandler('ru')
                                                        }}
                                                    >
                                                        Russian
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        variant={'outline-primary'}
                                                        id={`language-check-3`}
                                                        value={'id'}
                                                        onClick={() => {
                                                            onLanguageSelectHandler('id')
                                                        }}
                                                    >
                                                        Indonesian
                                                    </ToggleButton>

                                                </ToggleButtonGroup>

                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Address</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">Bay Area, San Francisco, CA</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <GuidePhoneComponent
                                item={currGuide.phones}
                                phonesEditHandler={phonesEditHandler}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
};

export default TourGuideEditCard;