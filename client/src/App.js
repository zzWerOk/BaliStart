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
    const [connectAttempts, setConnectAttempts] = useState(5)

    let ws = null
    let myInterval = null// setInterval(checkWsConnection, 5000);

    useMemo(() => {
        if (ws === null) {
            ws = new WebSocket('ws://localhost:3050?token=' + localStorage.getItem('token'))
        }

        // console.log(messagesStore)
        // console.log(messagesStore.onMessageSend)
        //
        // if (messagesStore) {
        //     messagesStore.onMessageSend = sendMessage
        // }

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

        // return ws.readyState === ws.OPEN
    }

    const sendMessage = (recipient, text) => {
        if (!isWsIsOpen(ws)) {
            console.log('ws - unavailable')
            setDelayedMessages(prevState => {
                prevState.push({recipient, text})
            })
            // setDelayedMessages([...delayedMessages, {recipient, text}])
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
            setConnectAttempts(prev => prev - 1)
            console.log('Connect attempt ', 5 - connectAttempts)
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

        // clearInterval(myInterval)

        if (newWs === null) {
            ws = new WebSocket('ws://localhost:3050?token=' + localStorage.getItem('token'))
            newWs = ws
        }

        // if (!isWsIsOpen(ws)) {
        //     myInterval = setInterval(reconnectAttempt, connectAttempts > 0 ? 1000 : 5000);
        // }

        if (newWs) {

            if (messagesStore) {
                messagesStore.onMessageSend = sendMessage
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

                setConnectAttempts(5)

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

                }
            };

            // return () => {
            //     newWs.close();
            // };
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
