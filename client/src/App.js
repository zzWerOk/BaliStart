import './App.css';
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";

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
      </div>
  );
})

export default App;
