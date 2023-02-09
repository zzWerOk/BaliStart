import React, {useContext, useEffect, useState} from 'react';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {delay, MAIN_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import classes from './NavBar.module.css'
import ModalPopUp from "./ModalPopUp";
import LoginPage from "../pages/LoginPage";
import {Context} from "../index";
import {check} from "../http/userAPI";

const NavBar = observer(() => {
    const {user} = useContext(Context)

    const [showModal, setShowModal] = useState(false)

    // useEffect(() => {
    //     console.log(user.name)
    // }, [])

    const logOut = () => {
        user.logout()
    }


    const onAuthFinish = () => {
        setShowModal(false)
    }

    const mapPointsPageCardComponent = () => (
        <LoginPage
            onAuthFinish={onAuthFinish}
        />
    )

    return (
        <div>

            <Navbar bg="light" expand="lg">
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
                        <div style={{display: 'inline-flex'}}>
                            <Nav.Item
                                className={`d-flex justify-content-center align-items-center`}
                                style={{marginRight: '15px'}}
                            >
                                {user.name}
                            </Nav.Item>
                            <Nav.Item className={'d-flex justify-content-center align-items-center'}>
                                <Button variant="outline-primary" onClick={() => {
                                    logOut()
                                }}>Logout</Button>
                            </Nav.Item>
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
                // title={'Login'}
                child={mapPointsPageCardComponent}
            />

        </div>
    )

})

export default NavBar;