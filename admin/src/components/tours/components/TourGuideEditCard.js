import React, {useEffect, useState} from 'react';
import GuideTextComponent from "../../guides/components/GuideTextComponent";
import {Button, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import GuidePhoneComponent from "../../guides/components/GuidePhoneComponent";
import noImageLogo from "../../../img/nophoto.jpg";
import {MDBFile} from "mdb-react-ui-kit";
import {getById, saveGuideData} from "../../../http/guideAPI";
import {dateToEpoch, delay, epochToDate_guide} from "../../../utils/consts";
import {Form} from 'react-bootstrap';

const TourGuideEditCard = (props) => {

    const {tourGuideClicked, setGuideEdited, setUserSaved, setGuideDates, clickTourGuide} = props

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [currGuide, setCurrGuide] = useState({})
    const [guideImageLogo, setGuideImageLogo] = useState(false)
    const [guideAvatar, setGuideAvatar] = useState('')

    const [guideName, setGuideName] = useState('')
    const [guideAbout, setGuideAbout] = useState('')
    const [guideLanguages, setGuideLanguages] = useState([])
    const [guidePhones, setGuidePhones] = useState([])
    const [guideExperience, setGuideExperience] = useState(0)
    const [guideReligion, setGuideReligion] = useState('')
    const [guideActiveTill, setGuideActiveTill] = useState('')

    const [currGuideSave, setCurrGuideSave] = useState('')

    const [curGuideIsChanged, setCurGuideIsChanged] = useState(false)

    const isGuideChanged = () => {
        const isChanged = currGuideSave !== JSON.stringify(currGuide)
        setCurGuideIsChanged(isChanged)
        return isChanged
    }

    const setGuideData = (data) => {
        setCurrGuide(data)
        setCurrGuideSave(JSON.stringify(data))

        setGuideName(data.name)
        setGuideAbout(data.about)
        setGuideLanguages(JSON.parse(data.languages))

        setGuidePhones(JSON.parse(data.phones))

        setGuideExperience(data.experience)
        setGuideReligion(data.religion)

        setGuideActiveTill(epochToDate_guide(data.active_till))

        setGuideDates({createdAt: data.createdAt, updatedAt: data.updatedAt})

        if (data.avatar_img) {
            setGuideAvatar(process.env.REACT_APP_API_URL + '/static/' + data.avatar_img + '?' + Date.now())
        }

    }

    useEffect(() => {
        setLoading(true)

        getById(tourGuideClicked).then((data) => {
            if (data.hasOwnProperty('status')) {
                if (data.status === 'ok') {
                    setGuideData(data.data)
                }
            }
        }).catch(() => {

        }).finally(() => {
            setLoading(false)
        })


    }, [])

    const onLanguageSelectHandler = (value) => {
        if (!saving) {
            const currLangArr = guideLanguages
            const found = currLangArr.find(element => element === value)
            if (found) {
                const filtered = currLangArr.filter(function (value) {
                    return value !== found;
                })
                currGuide.languages = JSON.stringify(filtered)
                setGuideLanguages(filtered)
            } else {
                currGuide.languages = JSON.stringify([...currLangArr, value])
                setGuideLanguages([...currLangArr, value])
            }

            setGuideEdited(isGuideChanged())
        }
    }

    const phonesEditHandler = (phones) => {
        currGuide.phones = JSON.stringify(phones)
        setGuidePhones(phones)
        setGuideEdited(isGuideChanged())
    }

    const visibleNameEditHandler = (value) => {
        currGuide.name = value
        setGuideName(value)
        setGuideEdited(isGuideChanged())
    }

    // const emailEditHandler = (value) => {
    //     currGuide.email = value
    //
    //     setGuideEdited(isGuideChanged())
    // }

    const aboutEditHandler = (value) => {
        currGuide.about = value
        setGuideAbout(value)
        setGuideEdited(isGuideChanged())
    }

    const religionEditHandler = (value) => {
        currGuide.religion = value
        setGuideReligion(value)
        setGuideEdited(isGuideChanged())
    }

    const experienceEditHandler = (value) => {
        currGuide.experience = value
        setGuideExperience(value)
        setGuideEdited(isGuideChanged())
    }

    const onFileChooseHandler = (fileName) => {
        if (fileName) {
            setGuideImageLogo(true)
        } else {
            setGuideImageLogo(false)
        }
        currGuide.img = fileName

        setGuideEdited(isGuideChanged())
    }


    const saveGuideChanges = () => {

        setSaving(true)
        delay(0).then(() => {

            saveGuideData(
                currGuide.user_id,
                currGuide.img,
                currGuide.name,
                currGuide.about,
                currGuide.religion,
                currGuide.experience,
                currGuide.active_till,
                currGuide.visible_till,
                currGuide.phones,
                currGuide.languages,
            ).then(data => {

                if (data.hasOwnProperty('status')) {
                    if (data.status === 'ok') {
                        setUserSaved(JSON.parse(JSON.stringify(data.data)))
                        setCurrGuideSave(JSON.stringify(data.data))

                        setGuideData(data.data)

                        setCurGuideIsChanged(false)
                        setGuideEdited(false)
                    }
                }

            }).finally(() => {
                setSaving(false)
            })
        })
    }

    const onActiveTillDateChangeHandler = (value) => {
        console.log(value)
        setGuideActiveTill(value)
        currGuide.active_till = dateToEpoch(value)
        setGuideEdited(isGuideChanged())
    }

    const add1MonthToActiveTillDateHandler = () => {
        let date = epochToDate_guide(currGuide.active_till)
        let year = date.split('-')[0]
        let month = date.split('-')[1]
        let day = date.split('-')[2]
        month = parseInt(month) + 1

        if (month > 12) {
            month = 1
            year = parseInt(year) + 1
        }

        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        date = year + '-' + month + '-' + day

        setGuideActiveTill(date)
        currGuide.active_till = dateToEpoch(date)
        setGuideEdited(isGuideChanged())
    }

    const add1DayToActiveTillDateHandler = () => {
        let date = epochToDate_guide(parseInt(currGuide.active_till) + 86400)
        let year = date.split('-')[0]
        let month = date.split('-')[1]
        let day = date.split('-')[2]

        if (day < 10) {
            day = '0' + day
        }
        date = year + '-' + month + '-' + day

        setGuideActiveTill(date)
        currGuide.active_till = dateToEpoch(date)
        setGuideEdited(isGuideChanged())
    }

    if (loading) {

    } else {
        return (
            <section style={{backgroundColor: '#eee', marginRight: '20px', marginBottom: '25px'}}>

                <div className={'d-flex justify-content-around py-5'}>
                    <button className={'btn btn-primary  col-4'}
                            onClick={() => {
                                saveGuideChanges()
                            }}
                            disabled={!!saving || !curGuideIsChanged}
                    >
                        Save
                    </button>
                    <button className={'btn btn-outline-secondary col-2'}
                            disabled={!!saving}
                            onClick={() => {
                                clickTourGuide(tourGuideClicked)
                            }}
                    >
                        Close
                    </button>
                </div>

                <div className="container py-1"
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
                                                    guideAvatar
                                                    :
                                                    noImageLogo
                                                }
                                                style={{
                                                    objectFit: 'cover',
                                                    position: 'absolute',
                                                    width: '150px',
                                                    height: '150px',
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
                                            disabled={!!saving}
                                        />
                                    </div>


                                    <GuideTextComponent className="my-3" onTextEditHandler={visibleNameEditHandler}
                                                        text={guideName}
                                                        placeholder={'Visible Name'}
                                                        disabled={!!saving}
                                    />
                                    <GuideTextComponent className="my-3" onTextEditHandler={aboutEditHandler}
                                                        text={guideAbout}
                                                        placeholder={'About guide (few words)'}
                                                        disabled={!!saving}
                                    />
                                    <GuideTextComponent className="my-3" onTextEditHandler={religionEditHandler}
                                                        text={guideReligion}
                                                        placeholder={'Guide religion'}
                                                        disabled={!!saving}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">

                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">User ID</p>
                                        </div>
                                        <div className="col-sm-9 text-center">
                                            <span> {tourGuideClicked} </span>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Guide ID</p>
                                        </div>
                                        <div className="col-sm-9 text-center">
                                            <span> {currGuide.id} </span>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Date</p>
                                        </div>
                                        <div className="col-sm-9 d-flex justify-content-between">
                                            <Form.Group controlId="duedate" className={'col-5'}>
                                                <Form.Control
                                                    type="date"
                                                    name="duedate"
                                                    placeholder="Due date"
                                                    value={guideActiveTill}
                                                    onChange={(e) => onActiveTillDateChangeHandler(e.target.value)}
                                                />
                                            </Form.Group>
                                            <div className={'d-flex col justify-content-around'}>
                                                <Button className={'btn-outline-secondary text-light'}
                                                        onClick={() => {
                                                            add1MonthToActiveTillDateHandler()
                                                        }}
                                                >
                                                    Add 1 month
                                                </Button>
                                                <Button className={'btn-outline-secondary text-light'}
                                                        onClick={() => {
                                                            add1DayToActiveTillDateHandler()
                                                        }}
                                                >
                                                    Add a day
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Experience as a guide</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <GuideTextComponent className=""
                                                                text={guideExperience}
                                                                onTextEditHandler={experienceEditHandler}
                                                                placeholder={'Experience as a guide (years)'}
                                                                disabled={!!saving}
                                            />
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
                                                                   defaultValue={guideLanguages}
                                                                   disabled={!!saving}
                                                >
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

                                    <div className="row">
                                        <div className="col">
                                            <hr/>

                                            <GuidePhoneComponent
                                                item={guidePhones}
                                                saving={saving}
                                                phonesEditHandler={phonesEditHandler}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>
        );
    }
};

export default TourGuideEditCard;