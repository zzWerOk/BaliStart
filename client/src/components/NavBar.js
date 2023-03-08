import React, {useContext, useRef, useState} from 'react';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import {Button, Container, Nav, Navbar, NavDropdown, Overlay, Popover} from "react-bootstrap";
import {MAIN_ROUTE, USER_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import classes from './NavBar.module.css'
import ModalPopUp from "./ModalPopUp";
import LoginPage from "../pages/LoginPage";
import {Context} from "../index";
import UserProfileBtn from "./user/UserProfileBtn";
import {useHistory} from "react-router-dom";

const NavBar = observer(() => {
    const {user} = useContext(Context)

    const history = useHistory()

    const [showModal, setShowModal] = useState(false)

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
    }


    return (
        <div>

            <Navbar bg="light" expand="lg" className={'fixed-top z-depth-5'}>
                <Container fluid>
                    <Navbar.Brand href={MAIN_ROUTE}>Bali Start</Navbar.Brand>
                    <h1 className={classes.title}>
                    </h1>

                    <Navbar.Toggle aria-controls="navbarScroll"/>
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{maxHeight: '100px'}}
                            navbarScroll
                        >
                            <Nav.Link href="#action1">Home</Nav.Link>
                            <Nav.Link href="#action2">Link</Nav.Link>
                            <NavDropdown title="Link" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action4">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item href="#action5">
                                    Something else here
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="#" disabled>
                                Link
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>

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
                                                <Button variant="info"
                                                        onClick={() => {
                                                            openProfile()
                                                        }}>
                                                    Open profile
                                                </Button>
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