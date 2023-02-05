import React from 'react';
import {observer} from "mobx-react-lite";
import classes from "./SideBar.module.css"
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {Link} from "react-router-dom";

const SideBar = observer(() => {


    return (
        <nav id="sidebar">
            <div>
                <h3>Bootstrap Sidebar</h3>
            </div>

            <ListGroup>

                <ListGroupItem
                    style={{cursor: 'pointer'}}
                >
                    <Link
                        to={'/'}
                        className={classes.linkitem}
                        style={{display: 'block'}}
                    >
                        Main page
                    </Link>
                </ListGroupItem>

                <ListGroupItem
                    style={{cursor: 'pointer'}}
                >
                    <Link
                        to={'topics'}
                        className={classes.linkitem}
                        style={{display: 'block'}}
                    >
                        Topics page
                    </Link>
                </ListGroupItem>

                <ListGroupItem
                    style={{cursor: 'pointer'}}
                >
                    <Link
                        to={'mappoints'}
                        className={classes.linkitem}
                        style={{display: 'block'}}
                    >
                        Map points page
                    </Link>
                </ListGroupItem>

                <ListGroupItem
                    style={{cursor: 'pointer'}}
                >
                    <Link
                        to={'/guides'}
                        className={classes.linkitem}
                        style={{display: 'block'}}
                    >
                        Guides page
                    </Link>
                </ListGroupItem>


            </ListGroup>

        </nav>
    );
});

export default SideBar;