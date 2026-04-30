import { Route, Routes } from "react-router";
import Landingpage from "./landingpage/pages/landingpage";
import Globalmessageholder from "./Globalmessage/components/globalmessagecontainer";
import { useEffect, useState } from "react";
import NepaliNewYear2083 from "./newyearanimation/newyearanimation";

import Privacy from "./privacy/privacy.jsx";
import Terms from "./privacy/terms.jsx";
import Adminpanneloutlet from "./Adminpannel/pages/adminpanneloutlet.jsx";
import Hotel from "./Adminpannel/pages/Hotel.jsx";


function App() {
  useEffect(() => {
    let useragent = navigator.userAgent;
    console.log(useragent);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/admin/*" element={<Adminpanneloutlet/>}>
        <Route path="hotels/*" element={<Hotel/>}/>
       

        </Route>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Globalmessageholder />
    </>
  );
}

export default App;
