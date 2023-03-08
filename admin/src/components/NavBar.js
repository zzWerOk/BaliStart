import React, {useContext} from 'react';
import {Button, Nav} from "react-bootstrap";
import {AUTH_ROUTE, MAIN_ROUTE} from "../utils/consts";
import {useHistory} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import classes from './NavBar.module.css'

const NavBar = observer(() => {

    const {user} = useContext(Context)
    const {navBarTitle} = useContext(Context)
    const history = useHistory()

    const logOut = () => {
        user.logout()
        history.push(AUTH_ROUTE)

    }

    return (
        <div>
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href={MAIN_ROUTE}>Bali Start</a>
                    <div>
                        <h1 className={classes.title}>
                            {navBarTitle.navBarTitle}
                        </h1>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${classes.buttons}`} id="navbarNav">

                        <ul className="navbar-nav">
                            {user
                                ?
                                <Nav>
                                    {
                                        (user.isAdmin || user.is_guide || user.isAuthUser) ?
                                            <Nav>
                                                <li className="nav-item">
                                                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" href="#">Features</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" href="#">Pricing</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link disabled">Disabled</a>
                                                </li>
                                                <li className="nav-item">
                                                    <Button className=" active" onClick={logOut}>Log Out</Button>
                                                </li>
                                            </Nav>
                                            :
                                            <div>

                                            </div>
                                    }
                                </Nav>
                                :
                                <div>

                                </div>
                            }

                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )

})

export default NavBar;