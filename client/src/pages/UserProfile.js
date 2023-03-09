import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import LoginPage from "./LoginPage";
import GuideProfile from "../components/user/GuideProfile";
import {getAgentById, getGuideById, saveAgentData, saveGuideData} from "../http/guideAgentAPI";
import {epochToDate_guide} from "../utils/consts";
import AgentProfile from "../components/user/AgentProfile";
import {Button} from "react-bootstrap";

const UserProfile = () => {
    const {user} = useContext(Context)

    const [loading, setLoading] = useState(true)

    const [show, setShow] = useState(false);
    const [avatar_img, setAvatar_img] = useState('');

    const [guideLoaded, setGuideLoaded] = useState(false);

    const [guideActiveTill, setGuideActiveTill] = useState('');
    const [guideAbout, setGuideAbout] = useState('');
    const [guideUserName, setGuideUserName] = useState('');
    const [guideReligion, setGuideReligion] = useState('');
    const [guideExperience, setGuideExperience] = useState('');
    const [guideLanguage, setGuideLanguage] = useState([]);
    const [guidePhones, setGuidePhones] = useState('[]');
    const [guideLinks, setGuideLinks] = useState('[]');

    const [guideSaveForCheck, setGuideSaveForCheck] = useState('');
    const [isGuideChanged, setIsGuideChanged] = useState(false);

    const [agentLoaded, setAgentLoaded] = useState(false);
    const [agentActiveTill, setAgentActiveTill] = useState('');
    const [agentAbout, setAgentAbout] = useState('');
    const [agentUserName, setAgentUserName] = useState('');
    const [agentLanguage, setAgentLanguage] = useState([]);
    const [agentPhones, setAgentPhones] = useState('[]');
    const [agentLinks, setAgentLinks] = useState('[]');

    const [agentSaveForCheck, setAgentSaveForCheck] = useState('');
    const [isAgentChanged, setIsAgentChanged] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [isGuideSavingError, setIsGuideSavingError] = useState('');
    const [isAgentSavingError, setIsAgentSavingError] = useState('');

    const [pageTitle, setPageTitle] = useState('')

    useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    useEffect(() => {

        user.onLoginHandler = () => {
            isUserLogin()
        }
        user.onLogoutHandler = () => {
            isUserLogout()
        }

        if (user.isAuth) {
            setShow(user.isAuth)
            getUserData()
        } else {
            setLoading(false)
            setShow(false)
        }

        setPageTitle('User profile')

    }, [])

    const isUserLogin = () => {
        getUserData()
    }

    const getUserData = () => {

        if (user.isGuide) {
            getGuideById().then((userData) => {
                // console.log(userData)
                if (userData.hasOwnProperty('status')) {
                    if (userData.status === 'ok') {

                        user.guide = userData.data

                        setGuideSaveForCheck(JSON.stringify(user.guide))

                        setGuideUserName(user.guide.name)

                        try {
                            setGuideActiveTill(epochToDate_guide(user.guide.active_till))
                        } catch (e) {
                            setGuideActiveTill(epochToDate_guide(0))
                        }
                        setGuideAbout(user.guide.about)
                        setGuideReligion(user.guide.religion)
                        setGuideExperience(user.guide.experience)
                        try {
                            setGuideLanguage(JSON.parse(user.guide.languages))
                        } catch (e) {
                            console.log(e.message)
                            setGuideLanguage([])
                        }
                        setGuidePhones(user.guide.phones)
                        setGuideLinks(user.guide.links)

                        // user.setUserData(userData.data)
                    }
                }
            }).finally(() => {
                if (user.avatar_img) {
                    setAvatar_img(process.env.REACT_APP_API_URL + '/static/' + user.avatar_img + '?' + Date.now())
                } else {
                    setAvatar_img(process.env.REACT_APP_API_URL + '/static/guide_avatar.png')
                }

                setLoading(false)
                setShow(true)
                setGuideLoaded(true)
            })
        } else {
            setGuideLoaded(true)
        }

        if (user.isAgent) {
            getAgentById().then((userData) => {
                if (userData.hasOwnProperty('status')) {
                    if (userData.status === 'ok') {

                        user.agent = userData.data

                        setAgentSaveForCheck(JSON.stringify(user.agent))

                        setAgentUserName(user.agent.name)

                        setAgentActiveTill(epochToDate_guide(user.agent.active_till))
                        setAgentAbout(user.agent.about)
                        setAgentLanguage(JSON.parse(user.agent.languages))
                        setAgentPhones(user.agent.phones)
                        setAgentLinks(user.agent.links)

                    }
                }
            }).finally(() => {
                if (user.avatar_img) {
                    setAvatar_img(process.env.REACT_APP_API_URL + '/static/' + user.avatar_img + '?' + Date.now())
                } else {
                    setAvatar_img(process.env.REACT_APP_API_URL + '/static/guide_avatar.png')
                }

                setLoading(false)
                setShow(true)
                setAgentLoaded(true)
            })

            // setLoading(false)
            // setShow(true)
        } else {
            setAgentLoaded(true)
        }

        if (!user.isGuide && !user.isAgent) {
            setLoading(false)
            setShow(true)
            // setGuideLoaded(true)
            // setAgentLoaded(true)
        }

    }

    const isUserLogout = () => {
        setShow(false)
    }


    const checkGuideIsChanged = () => {
        const currGuideData = JSON.stringify(user.guide)
        setIsGuideChanged(guideSaveForCheck !== currGuideData)
    }

    const onGuideLanguagesEdited = (value) => {
        setGuideLanguage(value)
        user.guide.languages = JSON.stringify(value)
        checkGuideIsChanged()
    }

    const onGuidePhonesEdited = (value) => {
        user.guide.phones = value.items
        setGuidePhones(value.items)
        checkGuideIsChanged()
    }

    const onGuideLinksEdited = (value) => {
        user.guide.links = value.items
        setGuideLinks(value.items)
        checkGuideIsChanged()
    }

    const onGuideExperienceChangeHandler = (value) => {
        user.guide.experience = value
        setGuideExperience(value)
        checkGuideIsChanged()
    }

    const onGuideReligionChangeHandler = (value) => {
        user.guide.religion = value
        setGuideReligion(value)
        checkGuideIsChanged()
    }

    const onGuideAboutChangeHandler = (value) => {
        user.guide.about = value
        setGuideAbout(value)
        checkGuideIsChanged()
    }

    const onGuideNameChangeHandler = (value) => {
        user.guide.name = value
        setGuideUserName(value)
        checkGuideIsChanged()
    }


    const onAgentLanguagesEdited = (value) => {
        setAgentLanguage(value)
        user.agent.languages = JSON.stringify(value)
        checkAgentIsChanged()
    }

    const onAgentPhonesEdited = (value) => {
        user.agent.phones = value.items
        setAgentPhones(value.items)
        checkAgentIsChanged()
    }

    const onAgentLinksEdited = (value) => {
        user.agent.links = value.items
        setAgentLinks(value.items)
        checkAgentIsChanged()
    }

    const onAgentAboutChangeHandler = (value) => {
        user.agent.about = value
        setAgentAbout(value)
        checkAgentIsChanged()
    }

    const onAgentNameChangeHandler = (value) => {
        user.agent.name = value
        setAgentUserName(value)
        checkAgentIsChanged()
    }


    const checkAgentIsChanged = () => {
        const currAgentData = JSON.stringify(user.agent)
        setIsAgentChanged(agentSaveForCheck !== currAgentData)
    }

    const saveUserGuideData = () => {
        setIsSaving(true)
        setIsGuideSavingError('')

        saveGuideData(
            user.guide.name,
            user.guide.about,
            user.guide.religion,
            user.guide.experience,
            user.guide.languages,
            user.guide.phones,
            user.guide.links,
            avatar_img,
        ).then((data) => {
            if (data.hasOwnProperty('status')) {
                if (data.status === 'ok') {

                    if (data.hasOwnProperty('avatar_img')) {
                        setAvatar_img(process.env.REACT_APP_API_URL + '/static/' + data.avatar_img + '?' + Date.now())
                    }

                    setGuideSaveForCheck(JSON.stringify(user.guide))
                    setIsGuideChanged(false)
                } else {
                    if (data.hasOwnProperty('message')) {
                        setIsGuideSavingError(data.message)
                    } else {
                        setIsGuideSavingError('Save error')
                    }
                }
            } else {
                if (data.hasOwnProperty('message')) {
                    setIsGuideSavingError(data.message)
                } else {
                    setIsGuideSavingError('Save error')
                }
            }

        }).catch(e => {
            setIsGuideSavingError(e)
        }).finally(() => {
            setIsSaving(false)
        })
    }

    const saveUserAgentData = () => {
        setIsSaving(true)
        setIsAgentSavingError('')

        saveAgentData(
            user.agent.name,
            user.agent.about,
            user.agent.languages,
            user.agent.phones,
            user.agent.links,
            avatar_img,
        ).then((data) => {
            if (data.hasOwnProperty('status')) {
                if (data.status === 'ok') {

                    if (data.hasOwnProperty('avatar_img')) {
                        setAvatar_img(process.env.REACT_APP_API_URL + '/static/' + data.avatar_img + '?' + Date.now())
                    }

                    setAgentSaveForCheck(JSON.stringify(user.agent))
                    // checkAgentIsChanged()
                    setIsAgentChanged(false)
                } else {
                    if (data.hasOwnProperty('message')) {
                        setIsAgentSavingError(data.message)
                    } else {
                        setIsAgentSavingError('Save error')
                    }
                }
            } else {
                if (data.hasOwnProperty('message')) {
                    setIsAgentSavingError(data.message)
                } else {
                    setIsAgentSavingError('Save error')
                }
            }

        }).catch(e => {
            setIsAgentSavingError(e)
        }).finally(() => {
            setIsSaving(false)
        })
    }

    if (loading || !guideLoaded || !agentLoaded) {
    } else {
        return (
            show
                ?
                <section className="gradient-custom-2"
                         style={{height: 'calc(100vh - 62px'}}
                >
                    <div className="container py-5 h-100"
                         style={{overflowX: 'hidden', overflowY: 'auto'}}
                    >
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col col-xl-9">
                                <div className="card  mb-5">
                                    <div className="rounded-top text-white d-flex justify-content-between"
                                         style={{backgroundColor: '#332d2d', height: '200px'}}>
                                        <div className="ms-4 d-flex flex-column flex-column-reverse"
                                             style={{width: '140px'}}>
                                            {/*<div className="ms-4 me-4 mt-5 d-flex flex-column" >*/}
                                            <img
                                                src={avatar_img} alt="Guide avatar"
                                                className="rounded-circle img-thumbnail shadow-sm"
                                                style={{
                                                    display: 'block',
                                                    maxWidth: '80%',
                                                    height: 'auto',
                                                    position: 'relative',
                                                    top: '25px',
                                                    // minWidth: '150px',
                                                    // minHeight: '150px',
                                                    // maxWidth: '150px',
                                                    // maxHeight: '150px',
                                                    objectFit: 'cover',
                                                    zIndex: '1'
                                                }}/>
                                        </div>
                                        {/*<div className="ms-3" style={{marginTop: '110px'}}>*/}
                                        <div className="ms-2 mb-2 d-flex flex-column flex-column-reverse">
                                            <h5>{user.name}</h5>
                                        </div>
                                        {/*<div className="ms-5" style={{marginTop: '110px'}}>*/}
                                        <div className="ms-2 d-flex flex-column flex-column-reverse text-end me-4">
                                            <p>01.01.2023</p>
                                            <h5>Registration date</h5>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between py-4 text-black"
                                         style={{backgroundColor: '#f8f9fa'}}>
                                        <div className="d-flex justify-content-start text-center py-1">
                                            <div className="px-4">
                                                <p className="mb-1 h5 mb-0">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end text-center py-1">
                                            <div>
                                                <p className="mb-1 h5">12</p>
                                                <p className="small text-muted mb-0">Posts</p>
                                            </div>
                                            <div className="px-3">
                                                <p className="mb-1 h5">826</p>
                                                <p className="small text-muted mb-0">Messages</p>
                                            </div>
                                        </div>
                                    </div>


                                    <ul className="nav nav-tabs mb-3" id="myTab0" role="tablist">
                                        {
                                            user.isGuide && guideLoaded
                                                ?
                                                <li className="nav-item" role="presentation">
                                                    <button
                                                        // className={`nav-link ${user.isGuide ? 'active' : ''} ${isSaving ? 'disabled' : ''} `}
                                                        className={`nav-link ${user.isGuide ? 'active' : ''}`}
                                                        disabled={!!isSaving}
                                                        id="home-tab0"
                                                        data-mdb-toggle="tab"
                                                        data-mdb-target="#guide0"
                                                        type="button"
                                                        role="tab"
                                                        aria-controls="home"
                                                        aria-selected="true"
                                                        // disabled={guideIsSaving}
                                                    >
                                                        Guide
                                                    </button>
                                                </li>
                                                :
                                                null
                                        }
                                        {
                                            user.isAgent && agentLoaded
                                                ?
                                                <li className="nav-item" role="presentation">
                                                    <button
                                                        // className={`nav-link ${!user.isGuide ? 'active' : ''}  ${isSaving ? 'disabled' : ''} `}
                                                        className={`nav-link ${!user.isGuide ? 'active' : ''}`}
                                                        disabled={!!isSaving}
                                                        id="profile-tab0"
                                                        data-mdb-toggle="tab"
                                                        data-mdb-target="#agent0"
                                                        type="button"
                                                        role="tab"
                                                        aria-controls="profile"
                                                        aria-selected="false"
                                                    >
                                                        Agent
                                                    </button>
                                                </li>
                                                :
                                                null
                                        }
                                    </ul>
                                    <div className="tab-content" id="myTabContent0"
                                    >
                                        {
                                            user.isGuide && guideLoaded
                                                ?

                                                <div
                                                    className={`tab-pane fade-out ${user.isGuide ? 'active show' : ''} `}
                                                    id="guide0"
                                                    role="tabpanel"
                                                    // aria-labelledby="guide-tab0"
                                                    style={{minHeight: '80vh'}}
                                                >
                                                    <GuideProfile key={!!guideLoaded}
                                                                  guideAbout={guideAbout}
                                                                  guideUserName={guideUserName}
                                                                  guideReligion={guideReligion}
                                                                  guideExperience={guideExperience}
                                                                  guideLanguage={guideLanguage}
                                                                  guidePhones={guidePhones}
                                                                  guideLinks={guideLinks}
                                                                  guideActiveTill={guideActiveTill}
                                                                  onGuideLanguagesEdited={onGuideLanguagesEdited}
                                                                  onGuidePhonesEdited={onGuidePhonesEdited}
                                                                  onGuideLinksEdited={onGuideLinksEdited}
                                                                  onGuideExperienceChangeHandler={onGuideExperienceChangeHandler}
                                                                  onGuideReligionChangeHandler={onGuideReligionChangeHandler}
                                                                  onGuideAboutChangeHandler={onGuideAboutChangeHandler}
                                                                  onGuideNameChangeHandler={onGuideNameChangeHandler}
                                                    />

                                                    <div
                                                        className={'d-flex flex-column align-items-center justify-content-center mb-4'}>

                                                        <Button
                                                            className={`btn ${!isGuideChanged ? 'disabled' : ''} col-3`}
                                                            variant={`${!isGuideChanged ? 'outline-primary' : isGuideSavingError ? 'danger' : 'primary'} `}
                                                            onClick={() => {
                                                                saveUserGuideData()
                                                            }}
                                                        >
                                                            Save
                                                        </Button>

                                                        {
                                                            isGuideSavingError
                                                                ?
                                                                <small className="fw-normal py-3 text-danger w-auto">
                                                                    {isGuideSavingError}
                                                                </small>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                </div>
                                                :
                                                null
                                        }
                                        {
                                            user.isAgent && agentLoaded
                                                ?
                                                <div className={`tab-pane fade ${!user.isGuide ? 'active show' : ''}`}
                                                     id="agent0"
                                                     role="tabpanel"
                                                     style={{minHeight: '70vh'}}
                                                     aria-labelledby="agent-tab0">
                                                    <AgentProfile key={!!agentLoaded}
                                                                  agentAbout={agentAbout}
                                                                  agentUserName={agentUserName}
                                                                  agentLanguage={agentLanguage}
                                                                  agentPhones={agentPhones}
                                                                  agentLinks={agentLinks}
                                                                  agentActiveTill={agentActiveTill}
                                                                  onAgentLanguagesEdited={onAgentLanguagesEdited}
                                                                  onAgentPhonesEdited={onAgentPhonesEdited}
                                                                  onAgentLinksEdited={onAgentLinksEdited}
                                                                  onAgentAboutChangeHandler={onAgentAboutChangeHandler}
                                                                  onAgentNameChangeHandler={onAgentNameChangeHandler}
                                                    />

                                                    <div
                                                        className={'d-flex flex-column align-items-center justify-content-center mb-4'}>
                                                        <Button
                                                            className={`btn ${!isAgentChanged ? 'disabled' : ''} col-3`}
                                                            variant={`${!isAgentChanged ? 'outline-primary' : isAgentSavingError ? 'danger' : 'primary'} `}
                                                            onClick={() => {
                                                                saveUserAgentData()
                                                            }}
                                                        >
                                                            Save
                                                        </Button>

                                                        {
                                                            isAgentSavingError
                                                                ?
                                                                <small className="fw-normal py-3 text-danger w-auto">
                                                                    {isAgentSavingError}
                                                                </small>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                </div>
                                                :
                                                null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                :
                <LoginPage
                    // onAuthFinish={onAuthFinish}
                />

        );
    }
};

export default UserProfile;