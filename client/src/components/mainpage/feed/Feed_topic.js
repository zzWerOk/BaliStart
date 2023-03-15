import React, {useState} from 'react';
import classes from "./Feed_topics.module.css";
import {dateToEpoch, epochToDateWithTime, linkShareButtonsModalChildComponent} from "../../../utils/consts";
import {useHistory} from "react-router-dom";
import {Col} from "react-bootstrap";
import ModalPopUp from "../../ModalPopUp";

const FeedTopic = (props) => {
    const history = useHistory()

    const {item} = props

    const [showModal, setShowModal] = useState(false)

    const modalChildComponent = () => (
        linkShareButtonsModalChildComponent('topic', item.id, item.name)
    )


    return (

        <li
            className={`list-group-item `}
        >


            <a
                className={`flex-column align-items-start ${classes.textColor} ${classes.pointer}`}
                onClick={() => {
                    history.push('/topic/' + item.id)
                }}
            >
                <div className="d-flex w-100 justify-content-between">
                    <div></div>
                    <small className="mb-1"
                    >{item.created_by_user_name || ''}</small>
                </div>
                <div
                    className="d-flex w-100 justify-content-between"
                >
                    <Col>
                        <h5 className="mb-1">{item.name}</h5>
                    </Col>
                    <Col className={'d-flex justify-content-end'}
                         md={2}
                    >
                        <small
                            className={''}
                        >{epochToDateWithTime(dateToEpoch(item.updatedAt) * 1000) || ''}</small>
                    </Col>

                </div>

                <small className="mb-1"
                >
                    {item.description}
                </small>

            </a>
            <div className={'d-flex justify-content-between'}>

                <div className={'d-flex'}>

                    <div className={'d-flex'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-chat-left-text" viewBox="0 0 16 16"
                             style={{marginTop: '5px'}}
                        >
                            <path
                                d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path
                                d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                        <small style={{marginLeft: '5px'}}>
                            {item.commentsCount}
                        </small>
                    </div>

                    <div className={'d-flex'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-eye" viewBox="0 0 16 16"
                             style={{marginTop: '3px', marginLeft: '15px'}}
                        >
                            <path
                                d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                            <path
                                d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                        </svg>
                        <small style={{marginLeft: '5px'}}>
                            {item.seen}
                        </small>
                    </div>
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-share align-self-end" viewBox="0 0 16 16"
                     style={{marginTop: '3px', marginLeft: '25px', marginRight: '0px'}}
                     onClick={() => {
                         setShowModal(true)
                     }}
                >
                    <path
                        d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                </svg>
            </div>
            <ModalPopUp
                show={showModal}
                title={'Topic link share'}
                onHide={() => {
                    setShowModal(false)
                }}
                child={modalChildComponent}
            />

        </li>

    );
};

export default FeedTopic;