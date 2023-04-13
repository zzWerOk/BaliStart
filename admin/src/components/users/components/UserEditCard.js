import React, {useContext, useEffect, useState} from 'react';
import GuideTextComponent from "../../guides/components/GuideTextComponent";
import noImageLogo from "../../../img/nophoto.jpg";
import {MDBFile} from "mdb-react-ui-kit";
import {getUserById, saveUserData} from "../../../http/userAPI";
import {Context} from "../../../index";
import {delay} from "../../../utils/consts";

const UserEditCard = (props) => {
    const {userList} = useContext(Context)

    const {userClicked, setUserEdited, setUserSaved, clickUser} = props

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [currUser, setCurrUser] = useState({})
    const [currUserEditable, setCurrUserEditable] = useState({})
    const [currUserIsAdmin, setCurrUserIsAdmin] = useState(false)
    const [currUserIsAgent, setCurrUserIsAgent] = useState(false)
    const [currUserIsGuide, setCurrUserIsGuide] = useState(false)
    const [userImageLogo, setUserImageLogo] = useState(false)
    const [userAvatar, setUserAvatar] = useState('')

    const [curUserSave, setCurUserSave] = useState('')

    const [curUserIsActive, setCurUserIsActive] = useState(false)

    const [curUserIsChanged, setCurUserIsChanged] = useState(false)

    const setUserdata = (data) => {
        setCurrUser(data)

        setCurrUserEditable(data.editable || false)

        setCurrUserIsGuide(data.is_guide)
        setCurrUserIsAdmin(data.is_admin)
        setCurrUserIsAgent(data.is_agent)

        setCurUserIsActive(data.is_active)

        setCurUserSave(JSON.stringify(data))

        if (data.avatar_img) {
            setUserAvatar(data.avatar_img + '?' + Date.now())
        }
    }

    useEffect(() => {
        setLoading(true)

        getUserById(userClicked).then(data => {
            if (data.hasOwnProperty('status')) {
                if (data.status === 'ok') {

                    setUserdata(data.data)

                }
            }

        }).catch(() => {
            setCurrUser({})
        }).finally(() => {
            setLoading(false)
        })


    }, [])


    const isUserChanged = () => {
        const isChanged = curUserSave !== JSON.stringify(currUser)
        setCurUserIsChanged(isChanged)
        return isChanged
    }

    const onRoleSelectHandler = (value) => {

        switch (value) {
            case 'user':
                if (currUser.is_guide) {
                    currUser.is_guide = false
                }
                if (currUser.is_admin) {
                    currUser.is_admin = false
                }
                if (currUser.is_agent) {
                    currUser.is_agent = false
                }
                break
            case 'admin':
                currUser.is_admin = !currUser.is_admin;
                break
            case 'guide':
                currUser.is_guide = !currUser.is_guide;
                break
            case 'agent':
                currUser.is_agent = !currUser.is_agent;
                break
        }
        setCurrUserIsAdmin(currUser.is_admin)
        setCurrUserIsGuide(currUser.is_guide)
        setCurrUserIsAgent(currUser.is_agent)
        setUserEdited(isUserChanged())
    }

    const nameEditHandler = (value) => {
        if (currUserEditable) {
            currUser.name = value
            // setUserEdited(true)
            setUserEdited(isUserChanged())
        }
    }

    const emailEditHandler = (value) => {
        if (currUserEditable) {
            currUser.email = value
            // setUserEdited(true)
            setUserEdited(isUserChanged())
        }
    }

    const onFileChooseHandler = (fileName) => {
        if (currUserEditable) {
            if (fileName) {
                setUserImageLogo(true)
            } else {
                setUserImageLogo(false)
            }
            // currUser.avatar_img = fileName
            currUser.img = fileName

            const objectUrl = URL.createObjectURL(fileName)

            setUserAvatar(objectUrl)
            // setUserEdited(true)
            setUserEdited(isUserChanged())
        }
    }

    const setUserActiveHandler = (value) => {
        setCurUserIsActive(value)
        currUser.is_active = value
        setUserEdited(isUserChanged())
    }

    const saveUserChanges = () => {

        setSaving(true)
        delay(0).then(() => {

            saveUserData(
                currUser.id,
                currUser.name,
                currUser.email,
                currUser.is_active,
                currUser.is_admin,
                currUser.is_guide,
                currUser.is_agent,
                currUser.img,
            ).then(data => {

                if (data.hasOwnProperty('status')) {
                    if (data.status === 'ok') {
                        userList.editUserById(currUser.id, data.data)
                        setUserSaved(JSON.parse(JSON.stringify(data.data)))
                        setCurUserSave(JSON.stringify(data.data))

                        currUser.img = null

                        setUserdata(data.data)

                        setCurUserIsChanged(false)
                        setUserEdited(false)
                    }
                }

            }).finally(() => {
                setSaving(false)
            })

        })
    }

    if (loading) {

    } else {
        return (
            <section style={{backgroundColor: '#eee', marginRight: '20px', marginBottom: '25px'}}>

                <div className={'d-flex justify-content-around py-5'}>
                    <button className={'btn btn-primary  col-4'}
                            onClick={() => {
                                saveUserChanges()
                            }}
                            disabled={!!saving || !curUserIsChanged}
                    >
                        Save
                    </button>
                    <button className={'btn btn-outline-secondary col-2'}
                            disabled={!!saving}
                            onClick={() => {
                                clickUser(userClicked)
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
                                        className={'d-flex align-items-center justify-content-center row'}
                                    >
                                        <div
                                            style={{
                                                height: '250px',
                                                overflow: 'hidden',
                                                margin: 0,
                                            }}>

                                            <img
                                                src={userAvatar
                                                    ?
                                                    userAvatar.indexOf('blob:http://') !== -1
                                                        ?
                                                        userAvatar
                                                        :
                                                        `${process.env.REACT_APP_API_URL}/static/${userAvatar}`
                                                    :
                                                    noImageLogo
                                                }
                                                style={{
                                                    objectFit: 'cover',
                                                    position: 'absolute',
                                                    width: '150px',
                                                    height: '150px',
                                                    left: '50%',
                                                    transform: 'translate(-50%, 10%)',
                                                }}
                                                alt="avatar"
                                                className="rounded-circle img-fluid"
                                            />
                                        </div>

                                        {
                                            currUserEditable
                                                ?
                                                <MDBFile
                                                    className={`btn w-75 ${userImageLogo ? 'btn-primary' : 'btn-secondary'} `}
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
                                                :
                                                null
                                        }
                                    </div>
                                    <div className={'row '}>
                                        <div className="form-check form-switch d-flex justify-content-center">
                                            <input className="form-check-input" type="checkbox"
                                                   id="flexSwitchCheckChecked"
                                                   checked={!!curUserIsActive}
                                                   onChange={e => {
                                                       setUserActiveHandler(e.target.checked)
                                                   }}
                                                   style={{marginRight: '10px'}}
                                                   disabled={!!saving}

                                            />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                                User is active</label>
                                        </div>
                                    </div>

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
                                        <div className="col-sm-9">
                                            <span> {currUser.id} </span>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Name</p>
                                        </div>
                                        <div className="col-sm-9">
                                            {
                                                currUserEditable
                                                    ?
                                                    <GuideTextComponent onTextEditHandler={nameEditHandler}
                                                                        text={currUser.name}
                                                                        placeholder={'Name'}
                                                                        saving={saving}
                                                    />
                                                    :
                                                    <span>
                                                        {currUser.name}
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Email</p>
                                        </div>
                                        <div className="col-sm-9">
                                            {
                                                currUserEditable
                                                    ?
                                                    <GuideTextComponent onTextEditHandler={emailEditHandler}
                                                                        text={currUser.email}
                                                                        placeholder={'E-mail'}
                                                                        saving={saving}
                                                    />
                                                    :
                                                    <span>
                                                        {currUser.email}
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Language</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <div>

                                                <div className="btn-group"
                                                     role="group"
                                                >
                                                    <input type="checkbox"
                                                           className={`btn-check`}
                                                           checked={!currUserIsAdmin && !currUserIsGuide}
                                                           id="btncheck"
                                                           onChange={() => {
                                                               onRoleSelectHandler('user')
                                                           }}
                                                           disabled={!!saving}

                                                           autoComplete="off"/>
                                                    <label className="btn btn-outline-primary"
                                                           htmlFor="btncheck"
                                                    >
                                                        User
                                                    </label>

                                                    <input type="checkbox"
                                                           className={`btn-check `}
                                                           checked={!!currUserIsAgent}
                                                           id="btncheck1"
                                                           onChange={() => {
                                                               onRoleSelectHandler('agent')
                                                           }}
                                                           disabled={!!saving}

                                                           autoComplete="off"/>
                                                    <label className="btn btn-outline-primary"
                                                           htmlFor="btncheck1"
                                                    >
                                                        Agent
                                                    </label>

                                                    <input type="checkbox"
                                                           className={`btn-check`}
                                                           checked={!!currUserIsGuide}
                                                           id="btncheck2"
                                                           onChange={() => {
                                                               onRoleSelectHandler('guide')
                                                           }}
                                                           disabled={!!saving}

                                                           autoComplete="off"/>
                                                    <label className="btn btn-outline-primary"
                                                           htmlFor="btncheck2"
                                                    >
                                                        Guide
                                                    </label>

                                                    <input type="checkbox"
                                                           className={`btn-check `}
                                                           checked={!!currUserIsAdmin}
                                                           id="btncheck3"
                                                           onChange={() => {
                                                               onRoleSelectHandler('admin')
                                                           }}
                                                           disabled={!!saving}

                                                           autoComplete="off"/>
                                                    <label className="btn btn-outline-primary"
                                                           htmlFor="btncheck3"
                                                    >
                                                        Admin
                                                    </label>

                                                </div>

                                            </div>
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

export default UserEditCard;