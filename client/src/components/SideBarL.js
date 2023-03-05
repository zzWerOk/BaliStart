import React from 'react';
import {observer} from "mobx-react-lite";
import classes from "./SideBar.module.css"
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {Link} from "react-router-dom";

const SideBarL = observer((props) => {
    const {title} = props

    return (
        <nav id="sidebar" className={'py-2'}>

            {
                title
                    ?
                    <div>
                        <h3>{title}</h3>
                    </div>
                    :
                    null
            }

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
                        to={'/topics'}
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
                        to={'/categories'}
                        className={classes.linkitem}
                        style={{display: 'block'}}
                    >
                        Categories page
                    </Link>
                </ListGroupItem>

                <ListGroupItem
                    style={{cursor: 'pointer'}}
                >
                    <Link
                        to={'/tours'}
                        className={classes.linkitem}
                        style={{display: 'block'}}
                    >
                        Tours
                    </Link>
                </ListGroupItem>

                <ListGroupItem
                    style={{cursor: 'pointer'}}
                >
                    <Link
                        to={'/poi'}
                        className={classes.linkitem}
                        style={{display: 'block'}}
                    >
                        Points of interests
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

export default SideBarL;