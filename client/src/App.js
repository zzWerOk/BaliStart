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

    // const [messages, setMessages] = useState([]);
    // const [ws, setWs] = useState(new WebSocket('ws://localhost:3050?token=' + localStorage.getItem('token')));
    // const [ws, setWs] = useState(null)

    let ws = null

    useMemo(() => {
        if (ws === null) {
            ws = new WebSocket('ws://localhost:3050?token=' + localStorage.getItem('token'))
        }

        return () => {
            ws.close();
        };

    }, [])

    const sendMessage = (recipient, text) => {
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

    // useEffect(() => {
    //
    //     setWs((prev) => ({...prev,ws}))
    //
    //     // if (ws) {
    //     //
    //     //     if(messagesStore){
    //     //         messagesStore.onMessageSend = sendMessage
    //     //     }
    //     //
    //     //     // setWs((prev) => ({...prev,ws}))
    //     //
    //     //     ws.onopen = () => {
    //     //         console.log('WebSocket connection established');
    //     //         // sendMessage(ws, '111', '22', 'text')
    //     //         // sendMessage('22', 'text')
    //     //         setWs(ws)
    //     //     };
    //     //
    //     //
    //     //     ws.onmessage = (event) => {
    //     //         const data = JSON.parse(event.data);
    //     //         console.log('MESSAGE! ', event.data)
    //     //
    //     //         if (data.type === 'MESSAGE_SENT') {
    //     //             setMessages((messages) => [...messages, data.payload]);
    //     //         }
    //     //     };
    //     //
    //     //     return () => {
    //     //         ws.close();
    //     //     };
    //     // }
    //
    // }, [])

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

        // if(!newWs) {
        //     newWs = new WebSocket('ws://localhost:3050?token=' + localStorage.getItem('token'))
        //     setWs(newWs)
        // }

        if (newWs) {

            if (messagesStore) {
                messagesStore.onMessageSend = sendMessage
            }

            newWs.onopen = () => {
                console.log('WebSocket connection established');
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

            return () => {
                newWs.close();
            };
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
