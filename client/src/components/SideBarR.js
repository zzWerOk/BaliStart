import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Button, ListGroup} from "react-bootstrap";
import {Context} from "../index";

const SideBarR = observer((props) => {
    const {title} = props

    const {rightSideBarStore} = useContext(Context)


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
                    rightSideBarStore.items.map(function (item, index) {
                        if (item.type.split(' ')[0] === 'btn') {
                            return <Button key={item.id + '' + index}
                                           className={item.type + ' my-1'}
                                           onClick={item.handler}
                                           style={{
                                               transition: '0.1s ease all',
                                               MozTransition: '0.1s ease all',
                                               WebkitTransition: '0.1s ease all',
                                           }}
                            >
                                {item.name}
                            </Button>
                        } else if (item.type.split(' ')[0] === 'br') {
                            return <br key={item.id + '' + index}/>
                        } else if (item.type.split(' ')[0] === 'snippet') {
                            return (
                                <div key={item.id + '' + index}
                                     className={`alert py-2 ${item.type} d-flex justify-content-center`}
                                     style={{
                                         transition: '0.1s ease all',
                                         MozTransition: '0.1s ease all',
                                         WebkitTransition: '0.1s ease all',
                                     }}
                                >
                                    <strong className="default">
                                        <i className="fa fa-road">
                                        </i>
                                        {item.name}
                                    </strong>
                                    {item.text}
                                </div>
                            )
                        }
                    })
                }

            </ListGroup>

        </nav>
    )
})

export default SideBarR;