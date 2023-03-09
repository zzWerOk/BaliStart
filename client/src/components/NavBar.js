import React, {useContext, useRef, useState} from 'react';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import {Button, Container, Nav, Navbar, Overlay, Popover} from "react-bootstrap";
import {MAIN_ROUTE, USER_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import classes from './NavBar.module.css'
import ModalPopUp from "./ModalPopUp";
import LoginPage from "../pages/LoginPage";
import {Context} from "../index";
import UserProfileBtn from "./user/UserProfileBtn";
import {useHistory} from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import SideBarL from "./SideBarL";

const NavBar = observer(() => {
    const {user} = useContext(Context)

    const history = useHistory()

    const [showModal, setShowModal] = useState(false)

    const [showSideBar, setShowSideBar] = useState(false);

    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    const logOut = () => {
        user.logout()
        overlayClose()
    }


    const onAuthFinish = () => {
        setShowModal(false)
    }

    const modalChildComponent = () => (
        <LoginPage
            onAuthFinish={onAuthFinish}
        />
    )

    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    }

    const overlayClose = () => {
        setShow(!show);
    }

    const openProfile = () => {
        history.push(USER_ROUTE)
        overlayClose()
    }

    const closeLeftSideBar = () => {
        setShowSideBar(false)
    }

    const showLeftSideBar = () => {
        setShowSideBar(true)
    }

    return (
        <div>

            <Navbar bg="light" expand="lg" className={'fixed-top z-depth-5'}>
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbarScroll"
                                   onClick={showLeftSideBar}
                                   className={'d-md-none'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                             className="bi bi-list" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </Navbar.Toggle>
                    <Navbar.Brand href={MAIN_ROUTE}>Bali Start</Navbar.Brand>
                    <h1 className={classes.title}>
                    </h1>

                    <Navbar.Offcanvas
                        show={showSideBar}
                        onHide={closeLeftSideBar}
                        id={`navbarScroll`}
                        aria-labelledby={`navbarScrollTitle`}
                        placement="start"
                        role={'navigation'}
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`navbarScrollTitle`}>
                                Bali start
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>

                            <div className={'d-md-none'}>
                                <SideBarL onItemClickHandler={closeLeftSideBar}/>
                            </div>

                        </Offcanvas.Body>
                    </Navbar.Offcanvas>

                    {user.isAuth
                        ?
                        <div style={{
                            display: 'inline-flex',
                            width: '40px',
                            height: '40px',
                            marginRight: '25px',
                        }}
                             ref={ref}
                        >

                            <UserProfileBtn image={user.avatar_img}
                                            onClickHandler={handleClick}

                            />

                            <Overlay
                                show={show}
                                target={target}
                                placement="bottom"
                                container={ref}
                                containerPadding={20}
                            >
                                <Popover id="popover-contained">
                                    <Popover.Header className={'d-flex justify-content-between'}
                                                    style={{backgroundColor: '#e3e3e3'}}
                                    >
                                        <div>
                                            {user.name}
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={() => {
                                                    overlayClose()
                                                }}
                                            >
                                            </button>
                                        </div>
                                    </Popover.Header>
                                    <Popover.Body>

                                        <div className={'d-flex flex-column justify-content-center'}>

                                            <div className={'p-3 d-flex justify-content-center'}>
                                                <Nav.Link variant="info"
                                                        onClick={() => {
                                                            openProfile()
                                                        }}>
                                                    Open profile
                                                </Nav.Link>
                                            </div>

                                            <div className={'p-3 d-flex justify-content-center'}>
                                                <Button variant="outline-secondary"
                                                        onClick={() => {
                                                            logOut()
                                                        }}>
                                                    Logout
                                                </Button>
                                            </div>
                                        </div>
                                    </Popover.Body>
                                </Popover>
                            </Overlay>

                        </div>
                        :
                        <Button variant="outline-primary" onClick={() => {
                            setShowModal(true)
                        }}>Login</Button>
                    }

                </Container>
            </Navbar>
            <ModalPopUp
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                }}
                child={modalChildComponent}
            />

        </div>
    )

})

export default NavBar;