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
            })
        })
    }, [])


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
                    <Col>
                        <SideBarL/>
                    </Col>
                    <Col

                        md={7}
                        style={{padding: 0, backgroundColor: 'white'}}
                    >
                        <AppRouter/>
                        <FabButton/>
                    </Col>
                    <Col>
                        <SideBarR title={rightSideBarStore.barTitle}/>
                    </Col>
                </Row>
            </main>
        </div>
    );
})

export default App;
