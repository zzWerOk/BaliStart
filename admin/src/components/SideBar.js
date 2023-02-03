import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import classes from "./SideBar.module.css"
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {SIDEBAR_ISADMIN, SIDEBAR_ISAUTHUSER, SIDEBAR_NOTLOGGED} from "../utils/consts";
import {Context} from "../index";
import {Link} from "react-router-dom";

const SideBar = observer(() => {

    const {user} = useContext(Context)
    const {navBarTitle} = useContext(Context)
    const {navBarLink} = navBarTitle

    return (
        <nav id="sidebar">
            <div>
                <h3>Bootstrap Sidebar</h3>
            </div>

            <ListGroup>

                {user.isAdmin
                    ?
                    SIDEBAR_ISADMIN.map(item =>
                        <ListGroupItem className={` ${navBarLink === item.link
                            ?
                            'active'
                            :
                            ' '}`} style={{cursor: 'pointer'}} key={item.link}
                        >
                            <Link to={item.link}
                                  className={`${navBarLink === item.link ? classes.linkeditem : classes.linkitem}`}
                                  style={{display: 'block'}}>{item.name}</Link>

                        </ListGroupItem>
                    )
                    :
                    user.isAuthUser
                        ?
                        SIDEBAR_ISAUTHUSER.map(item =>
                            <ListGroupItem className={`${navBarTitle.navBarLink === item.link
                                ?
                                'active'
                                :
                                ' '}`} style={{cursor: 'pointer'}} key={item.link}>
                                <Link to={item.link}
                                      className={`${navBarLink === item.link ? classes.linkeditem : classes.linkitem}`}
                                      style={{display: 'block'}}>{item.name}</Link>

                            </ListGroupItem>
                        )
                        :
                        SIDEBAR_NOTLOGGED.map(item =>
                            <ListGroupItem className={`${navBarTitle.navBarLink === item.link
                                ?
                                'active'
                                :
                                ' '}`} style={{cursor: 'pointer'}} key={item.link}>

                                <Link to={item.link}
                                      className={`${navBarLink === item.link ? classes.linkeditem : classes.linkitem}`}
                                      style={{display: 'block'}}>{item.name}</Link>

                            </ListGroupItem>
                        )
                }


            </ListGroup>

        </nav>
    );
});

export default SideBar;