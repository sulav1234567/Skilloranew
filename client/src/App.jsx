
import { Route, Routes } from "react-router"
import Landingpage from "./landingpage/pages/landingpage"

function App() {
  

  return (
    <>
  
      <Routes>
        <Route path="/" element={<Landingpage/>}/>

      </Routes>
   
     
    </>
  )
}

export default App
