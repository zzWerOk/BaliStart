import './App.css';
import {observer} from "mobx-react-lite";
import {useContext, useEffect, useMemo, useState} from "react";
import AppRouter from "./components/AppRouter";
import {Col, Row} from "react-bootstrap";
import NavBar from "./components/NavBar";
import SideBarR from "./components/SideBarR";
import {delay} from "./utils/consts";
import {check, getMyName} from "./http/userAPI";
import {Context} from "./index";
import SideBarL from "./components/SideBarL";

const App = observer(() => {

    const [loading, setLoading] = useState(true)
    const {user, rightSideBarStore, messagesStore} = useContext(Context)

    const [delayedMessages, setDelayedMessages] = useState([])

    let ws = null
    let myInterval = null

    useMemo(() => {
        if (ws === null) {
            ws = new WebSocket('ws://localhost:3050?token=' + localStorage.getItem('token'))
        }

        return () => {
            ws.close();
        };

    }, [])

    function isWsIsOpen(ws) {

        if (ws.readyState !== ws.OPEN) {
            ws.close()
            ws = null

            return false
        } else {
            return true
        }
    }

    const deleteMessage = (recipient, messageId, userIdFrom) => {
        if (!isWsIsOpen(ws)) {
            setDelayedMessages(prevState => {
                prevState.push({recipient, messageId, userIdFrom})
            })
            ws.close()
            ws = null
            connect()
            return
        }

        const message = {
            type: 'DELETE_MESSAGE',
            payload: {recipient, messageId, userIdFrom},
        };

        if (ws) {
            ws.send(JSON.stringify(message));
        } else {
            console.log('Not WS')
        }
    }

    const sendMessage = (recipient, text) => {
        if (!isWsIsOpen(ws)) {
            setDelayedMessages(prevState => {
                prevState.push({recipient, text})
            })
            ws.close()
            ws = null
            connect()
            return
        }

        const message = {
            type: 'SEND_MESSAGE',
            payload: {recipient, text},
        };

        if (ws) {
            ws.send(JSON.stringify(message));
        } else {
            console.log('Not WS')
        }
    };

    const checkWsConnection = () => {
        if (!isWsIsOpen(ws)) {
            ws.close()
            ws = null
            connect()

        }
    }

    useEffect(() => {

        delay(0).then(() => {
            check().then(data => {

                getMyName().then((userData) => {
                    user.setUser(data)
                    if (userData.hasOwnProperty('status')) {
                        if (userData.status === 'ok') {
                            user.setUserData(userData.data)
                        }
                    }
                }).catch(() => {
                })

            }).finally(() => {
                setLoading(false)
                connect()
            })
        })
    }, [])

    const connect = () => {
        let newWs = ws

        if (newWs === null) {
            ws = new WebSocket('ws://localhost:3050?token=' + localStorage.getItem('token'))
            newWs = ws
        }

        if (newWs) {

            if (messagesStore) {
                messagesStore.onMessageSend = sendMessage
                messagesStore.onMessageDeleted = deleteMessage
            }

            newWs.onopen = () => {
                console.log('WebSocket connection established');
                console.log(delayedMessages);
                if (delayedMessages.length > 0) {
                    delayedMessages.map(message => {
                        sendMessage(message.recipient, message.text)
                    })
                    setDelayedMessages([])
                }


            };

            newWs.onmessage = (event) => {
                console.log('MESSAGE! ', event.data)
                const data = JSON.parse(event.data);

                if (data?.type === 'SYSTEM_MESSAGE') {

                    if (data?.message === 'new_message') {
                        if (messagesStore) {
                            messagesStore.getNewMessages()
                        }
                    }

                    if (data?.message === 'delete_message') {
                        if (messagesStore) {
                            messagesStore.checkDeletedMessages(data?.messageId, data?.userIdFrom)
                        }
                    }

                }
            };
        }

        if (myInterval === null) {
            myInterval = setInterval(checkWsConnection, 5000);
        }

    }

    if (loading) {
        return <></>
    }

    return (
        <div
        >
            <header>
                <NavBar/>
            </header>
            <main role={'main'}>
                <Row
                    className={'Main-Field'}
                    style={{marginLeft: 0, marginRight: 0,}}
                >
                    <Col className={'d-none d-md-block col-sm-3'}>
                        <SideBarL/>
                    </Col>
                    <Col
                        // md={7}
                        className={'col-md-9 col-lg-7 col-sm-12'}
                        style={{padding: 0, backgroundColor: 'white'}}
                    >
                        <AppRouter/>
                        {/*<FabButton/>*/}
                    </Col>
                    <Col className={'d-none d-lg-block'}>
                        <SideBarR title={rightSideBarStore.barTitle}/>
                    </Col>
                </Row>
            </main>
        </div>
    );
})

export default App;
