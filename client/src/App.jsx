
import { Route, Routes } from "react-router"
import Landingpage from "./landingpage/pages/landingpage"
import Globalmessageholder from "./Globalmessage/components/globalmessagecontainer"
import { useEffect, useState } from "react"
import NepaliNewYear2083 from "./newyearanimation/newyearanimation"


function App() {
  const [newYearAnimation,setNewYearAnimation]=useState(true)

  useEffect(()=>{
   setTimeout(()=>{
    setNewYearAnimation(false)
   },10000)

  },[])
  

  return (
    <>
   {newYearAnimation && <NepaliNewYear2083/>}
      <Routes>
        <Route path="/" element={<Landingpage/>}/>

      </Routes>
     <Globalmessageholder/>
     
    </>
  )
}

export default App
