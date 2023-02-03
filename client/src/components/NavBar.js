import React from 'react';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import {Button, Container, Form, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {MAIN_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import classes from './NavBar.module.css'
import {MDBBtn, MDBIcon, MDBInput, MDBInputGroup} from "mdb-react-ui-kit";

const NavBar = observer(() => {

    // const {user} = useContext(Context)
    // const {navBarTitle} = useContext(Context)
    // const history = useHistory()

    // const logOut = () => {
    //     // user.logout()
    //     // history.push(AUTH_ROUTE)
    //
    // }

    return (
        <div>

            <Navbar bg="light" expand="lg">
                <Container fluid>
                    <Navbar.Brand href={MAIN_ROUTE}>Bali Start</Navbar.Brand>
                    <h1 className={classes.title}>
                    </h1>

                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link href="#action1">Home</Nav.Link>
                            <Nav.Link href="#action2">Link</Nav.Link>
                            <NavDropdown title="Link" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action4">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action5">
                                    Something else here
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="#" disabled>
                                Link
                            </Nav.Link>
                        </Nav>
                        <MDBInputGroup>
                            <MDBInput label='Search' />
                            <MDBBtn rippleColor='dark'>
                                <MDBIcon icon='search' />
                            </MDBBtn>
                        </MDBInputGroup>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </div>
    )

})

export default NavBar;