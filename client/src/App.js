import './App.css';
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import AppRouter from "./components/AppRouter";
import {Col, Row} from "react-bootstrap";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";


const App = observer(() => {

    // const history = useHistory()
    // const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    }, [])

    if (loading) {
        return <></>
    }

    return (
        <div
        >
            <NavBar/>
            <Row
                className={'Main-Field'}
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
        </div>
    );
})

export default App;
