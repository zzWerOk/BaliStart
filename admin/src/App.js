import './App.css';
import {useHistory} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import {Col, Row} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {check, login} from "./http/userAPI";
import SpinnerSM from "./components/SpinnerSM";
import {delay, MAIN_ROUTE} from "./utils/consts";


const App = observer(() => {

    const history = useHistory()
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        delay(0).then(r => {
            check().then(data => {

                user.setUser(data)
                history.push(MAIN_ROUTE)

            }).finally(() =>
                setLoading(false)
            )
        })
    }, [])

    if (loading) {
        return <SpinnerSM/>
    }

    return (
        <div>
            <NavBar/>
            <Row className={'Main-Field'}>
                {(user.isAdmin || user.isGuide || user.isAuthUser) ?
                    <Col md={3}>
                        <SideBar/>
                    </Col>
                    :
                    <></>
                }
                <Col
                    md={(user.isAdmin || user.isGuide || user.isAuthUser)
                        ? 9 : null}
                >
                    <AppRouter/>
                </Col>
            </Row>
        </div>
    );
})

export default App;
