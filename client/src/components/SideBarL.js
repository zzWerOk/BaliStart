import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import classes from "./SideBar.module.css"
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import {leftSideBarElements} from "../utils/consts";
import {Context} from "../index";

const SideBarL = observer((props) => {
    const {title, onItemClickHandler} = props

    const onItemClickHandler2 = () => {
        if(onItemClickHandler) {
            onItemClickHandler()
        }

    }

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

                {
                    leftSideBarElements.map(function (item) {
                        return(
                            <ListGroupItem key={item.id}
                                style={{cursor: 'pointer'}}
                            >
                                <Link
                                    to={item.link}
                                    className={`${classes.linkitem} `}
                                    style={{display: 'block'}}
                                    onClick={() => {
                                        onItemClickHandler2(item.link)
                                    }}
                                >
                                    {item.name}
                                </Link>
                            </ListGroupItem>

                        )
                    })
                }

            </ListGroup>

        </nav>
    );
});

export default SideBarL;