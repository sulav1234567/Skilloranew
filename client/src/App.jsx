
import { Route, Routes } from "react-router"
import Landingpage from "./landingpage/pages/landingpage"
import Globalmessageholder from "./Globalmessage/components/globalmessagecontainer"

function App() {
  

  return (
    <>
  
      <Routes>
        <Route path="/" element={<Landingpage/>}/>

      </Routes>
     <Globalmessageholder/>
     
    </>
  )
}

export default App
