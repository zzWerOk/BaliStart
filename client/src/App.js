import './App.css';
import {observer} from "mobx-react-lite";
import {useContext, useEffect, useState} from "react";
import AppRouter from "./components/AppRouter";
import {Col, Row} from "react-bootstrap";
import NavBar from "./components/NavBar";
import SideBarR from "./components/SideBarR";
import {delay} from "./utils/consts";
import {check, getMyName} from "./http/userAPI";
import {Context} from "./index";
import SideBarL from "./components/SideBarL";
import FabButton from "./components/FabButton";


const App = observer(() => {

    const [loading, setLoading] = useState(true)
    const {user, rightSideBarStore} = useContext(Context)

    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState();

    const sendMessage = (ws, sender, recipient, text) => {
        const message = {
            type: 'SEND_MESSAGE',
            payload: {sender, recipient, text},
        };

        if (ws) {
            ws.send(JSON.stringify(message));
        }

    };

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

                // setWs(new WebSocket('ws://localhost:3050?token=' + localStorage.getItem('token')))
                connect()

            })
        })
    }, [])

    const connect = () => {

        // useEffect(() => {

        const ws = new WebSocket('ws://localhost:3050?token=' + localStorage.getItem('token'))
        setWs(ws)

        if (ws) {

            ws.onopen = () => {
                console.log('WebSocket connection established');
                sendMessage(ws, '111', '22', 'text')


            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('MESSAGE! ', event.data)

                if (data.type === 'MESSAGE_SENT') {
                    setMessages((messages) => [...messages, data.payload]);
                }
            };

            // return () => {
            //     ws.onclose = () => {
            //         console.log('WebSocket Disconnected');
            //         setWs(new WebSocket('ws://localhost:3050?token=' + localStorage.getItem('token')));
            //     }
            // }
            return () => {
                ws.close();
            };
        }





        // }, [ws, messages]);

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
