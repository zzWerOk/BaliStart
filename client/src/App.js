import './App.css';
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import AppRouter from "./components/AppRouter";
import {Col, Row} from "react-bootstrap";
import NavBar from "./components/NavBar";


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
      <div>
        <NavBar/>
        <Row className={'Main-Field'}>
          <Col
              md={9}
          >

            <AppRouter/>
          </Col>
        </Row>
      </div>
  );
})

export default App;
