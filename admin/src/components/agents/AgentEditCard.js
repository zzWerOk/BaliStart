import React, {useEffect, useState} from 'react';
import {Button, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import noImageLogo from "../../img/nophoto.jpg";
import {MDBFile} from "mdb-react-ui-kit";
import {dateToEpoch, delay, epochToDate_guide} from "../../utils/consts";
import {Form} from 'react-bootstrap';
import {getById, saveAgentData} from "../../http/agentAPI";
import GuidePhoneComponent from "../guides/components/GuidePhoneComponent";
import GuideTextComponent from "../guides/components/GuideTextComponent";
import GuideLinkComponent from "../guides/components/GuideLinkComponent";

const AgentEditCard = (props) => {

    const {tourGuideClicked, setGuideEdited, setUserSaved, setGuideDates, clickTourGuide} = props

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [currAgent, setCurrAgent] = useState({})
    const [agentImageLogo, setAgentImageLogo] = useState(false)
    const [agentAvatar, setAgentAvatar] = useState('')

    const [agentName, setAgentName] = useState('')
    const [agentAbout, setAgentAbout] = useState('')
    const [agentLanguages, setAgentLanguages] = useState([])
    const [agentPhones, setAgentPhones] = useState([])
    const [agentLinks, setAgentLinks] = useState([])
    const [agentActiveTill, setAgentActiveTill] = useState('')

    const [currAgentSave, setCurrAgentSave] = useState('')

    const [currAgentIsChanged, setCurrAgentIsChanged] = useState(false)

    const isGuideChanged = () => {
        const isChanged = currAgentSave !== JSON.stringify(currAgent)
        setCurrAgentIsChanged(isChanged)
        return isChanged
    }

    const setAgentData = (data) => {
        setCurrAgent(data)
        setCurrAgentSave(JSON.stringify(data))

        setAgentName(data.name)
        setAgentAbout(data.about)
        setAgentLanguages(JSON.parse(data.languages))

        setAgentPhones(JSON.parse(data.phones))
        setAgentLinks(JSON.parse(data.links))

        setAgentActiveTill(epochToDate_guide(data.active_till))

        setGuideDates({createdAt: data.createdAt, updatedAt: data.updatedAt})

        if (data.avatar_img) {
            setAgentAvatar(process.env.REACT_APP_API_URL + '/static/' + data.avatar_img + '?' + Date.now())
        }

    }

    useEffect(() => {
        setLoading(true)

        getById(tourGuideClicked).then((data) => {
            if (data.hasOwnProperty('status')) {
                if (data.status === 'ok') {
                    setAgentData(data.data)
                }
            }
        }).catch(() => {

        }).finally(() => {
            setLoading(false)
        })


    }, [])

    const onLanguageSelectHandler = (value) => {
        if (!saving) {
            const currLangArr = agentLanguages
            const found = currLangArr.find(element => element === value)
            if (found) {
                const filtered = currLangArr.filter(function (value) {
                    return value !== found;
                })
                currAgent.languages = JSON.stringify(filtered)
                setAgentLanguages(filtered)
            } else {
                currAgent.languages = JSON.stringify([...currLangArr, value])
                setAgentLanguages([...currLangArr, value])
            }

            setGuideEdited(isGuideChanged())
        }
    }

    const phonesEditHandler = (phones) => {
        currAgent.phones = JSON.stringify(phones)
        setAgentPhones(phones)
        setGuideEdited(isGuideChanged())
    }

    const linksEditHandler = (links) => {
        currAgent.links = JSON.stringify(links)
        setAgentLinks(links)
        setGuideEdited(isGuideChanged())
    }

    const visibleNameEditHandler = (value) => {
        currAgent.name = value
        setAgentName(value)
        setGuideEdited(isGuideChanged())
    }

    const aboutEditHandler = (value) => {
        currAgent.about = value
        setAgentAbout(value)
        setGuideEdited(isGuideChanged())
    }

    const onFileChooseHandler = (fileName) => {
        if (fileName) {
            setAgentImageLogo(true)
        } else {
            setAgentImageLogo(false)
        }
        currAgent.img = fileName

        setGuideEdited(isGuideChanged())
    }


    const saveGuideChanges = () => {

        setSaving(true)
        delay(0).then(() => {

            saveAgentData(
                currAgent.user_id,
                currAgent.img,
                currAgent.name,
                currAgent.about,
                currAgent.active_till,
                currAgent.visible_till,
                currAgent.phones,
                currAgent.links,
                currAgent.languages,

            ).then(data => {

                if (data.hasOwnProperty('status')) {
                    if (data.status === 'ok') {
                        setUserSaved(JSON.parse(JSON.stringify(data.data)))
                        setCurrAgentSave(JSON.stringify(data.data))

                        setAgentData(data.data)

                        setCurrAgentIsChanged(false)
                        setGuideEdited(false)
                    }
                }

            }).finally(() => {
                setSaving(false)
            })
        })
    }

    const onActiveTillDateChangeHandler = (value) => {
        setAgentActiveTill(value)
        currAgent.active_till = dateToEpoch(value)
        setGuideEdited(isGuideChanged())
    }

    const add1MonthToActiveTillDateHandler = () => {
        let date = epochToDate_guide(currAgent.active_till)
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

        setAgentActiveTill(date)
        currAgent.active_till = dateToEpoch(date)
        setGuideEdited(isGuideChanged())
    }

    const add1DayToActiveTillDateHandler = () => {
        let date = epochToDate_guide(parseInt(currAgent.active_till) + 86400)
        let year = date.split('-')[0]
        let month = date.split('-')[1]
        let day = date.split('-')[2]

        if (day < 10) {
            day = '0' + day
        }
        date = year + '-' + month + '-' + day

        setAgentActiveTill(date)
        currAgent.active_till = dateToEpoch(date)
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
                            disabled={!!saving || !currAgentIsChanged}
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
                                                src={agentAvatar
                                                    ?
                                                    agentAvatar
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
                                            className={`btn w-75 ${agentImageLogo ? 'btn-primary' : 'btn-secondary'} `}
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
                                                        text={agentName}
                                                        placeholder={'Visible Name'}
                                                        disabled={!!saving}
                                    />
                                    <GuideTextComponent className="my-3" onTextEditHandler={aboutEditHandler}
                                                        text={agentAbout}
                                                        placeholder={'About guide (few words)'}
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
                                            <p className="mb-0">Agent ID</p>
                                        </div>
                                        <div className="col-sm-9 text-center">
                                            <span> {currAgent.id} </span>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Active till</p>
                                        </div>
                                        <div className="col-sm-9 d-flex justify-content-between">
                                            <Form.Group controlId="duedate" className={'col-5'}>
                                                <Form.Control
                                                    type="date"
                                                    name="duedate"
                                                    placeholder="Due date"
                                                    value={agentActiveTill}
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
                                            <p className="mb-0">Language</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <div>
                                                <ToggleButtonGroup type="checkbox" name="activity"
                                                                   defaultValue={agentLanguages}
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
                                    <hr/>
                                    <div className="row">
                                        <div className="col">
                                            Phones
                                            <GuidePhoneComponent
                                                item={agentPhones}
                                                saving={saving}
                                                phonesEditHandler={phonesEditHandler}
                                            />
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col">
                                            Links
                                            <GuideLinkComponent
                                                item={agentLinks}
                                                saving={saving}
                                                dataItemEditHandler={linksEditHandler}
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

export default AgentEditCard;