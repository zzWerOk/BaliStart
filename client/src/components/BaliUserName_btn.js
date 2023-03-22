import React, {useContext, useEffect, useRef, useState} from 'react';
import {Nav, Overlay, Popover} from "react-bootstrap";
import {MESSAGES_ROUTE} from "../utils/consts";
import {useHistory} from "react-router-dom";
import {Context} from "../index";

const BaliUserNameBtn = (props) => {
    const {userName, userId} = props

    const {user} = useContext(Context)

    const history = useHistory()

    const [isCanSend, setIsCanSend] = useState(true)

    const [overlayShow, setOverlayShow] = useState(false);
    const [overlayTarget, setOverlayTarget] = useState(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        setIsCanSend(user.user.id !== userId)
    }, []);

    useEffect(() => {
        // add event listener to document when popover is open
        if (overlayShow) {
            const handleClickOutside = (event) => {
                if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                    setOverlayShow(false);
                    setOverlayTarget(null);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                // remove event listener when popover is closed or component unmounts
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [overlayShow, overlayRef.current]);

    const overlayHandleClick = (event) => {
        if(!overlayShow) {
            setOverlayShow(true);
            setOverlayTarget(event.target);
        }else{
            setOverlayShow(false);
            setOverlayTarget(null);
        }
    }

    const sendMessageHandler = () => {

        if(isCanSend) {
            history.push({
                pathname: MESSAGES_ROUTE,
                state: {userId}
            })
        }
    }

    return (
        <div>
            <div onClick={overlayHandleClick}
                 style={{
                     cursor: "pointer"
                 }}
                 ref={overlayRef}
            >
                {userName}
            </div>
            <Overlay
                show={overlayShow}
                target={overlayTarget}
                placement="bottom"
                container={overlayRef}
                containerPadding={20}
            >
                <Popover>
                    <Popover.Body
                        notclickable='true'
                    >

                        <div
                            className={'d-flex flex-column justify-content-center'}
                        >

                            <div
                                className={' px-1 d-flex justify-content-center'}>
                                <Nav.Item notclickable='true'
                                          className={`${!isCanSend ? 'text-secondary' : ''}`}
                                          onClick={() => {
                                              sendMessageHandler()
                                          }}
                                >
                                    Send message
                                </Nav.Item>
                            </div>


                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>

        </div>
    );
};

export default BaliUserNameBtn;