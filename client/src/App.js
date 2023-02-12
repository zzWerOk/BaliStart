import './App.css';
import {observer} from "mobx-react-lite";
import {useContext, useEffect, useState} from "react";
import AppRouter from "./components/AppRouter";
import {Col, Row} from "react-bootstrap";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import {delay} from "./utils/consts";
import {check, getMyName} from "./http/userAPI";
import {Context} from "./index";


const App = observer(() => {

    const [loading, setLoading] = useState(true)
    const {user} = useContext(Context)

    useEffect(() => {
        delay(0).then(() => {
            check().then(data => {
                user.setUser(data)

                // getById(data.id).then((item) => {
                getMyName().then((item) => {
                    user.setUser(data)
                    if (item.hasOwnProperty('status')) {
                        if (item.status === 'ok') {
                            user.name = item.message
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
                        <SideBar/>
                    </Col>
                    <Col

                        md={7}
                        style={{padding: 0, backgroundColor: 'white'}}
                    >
                        <AppRouter/>
                    </Col>
                    <Col>
                        <SideBar/>
                    </Col>
                </Row>
            </main>
        </div>
    );
})

export default App;
