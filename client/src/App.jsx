import { Route, Routes } from "react-router";
import Landingpage from "./landingpage/pages/landingpage";
import Globalmessageholder from "./Globalmessage/components/globalmessagecontainer";
import { useEffect, useState } from "react";
import NepaliNewYear2083 from "./newyearanimation/newyearanimation";

import Privacy from "./privacy/privacy.jsx";
import Terms from "./privacy/terms.jsx";
import Adminpanneloutlet from "./Adminpannel/pages/adminpanneloutlet.jsx";
import Hotel from "./Adminpannel/pages/Hotel.jsx";
import { ProtectedRoute } from "./AuthSystem/components/protectedroute.jsx";
import Unauthorized from "./commoncomponents/unauthorized.jsx";
import NotFound404 from "./commoncomponents/pagenotfound.jsx";
import { useUserInfo } from "./userinfo/userinfo.jsx";
import HotelOutlet from "./Adminpannel/pages/HotelOutlet.jsx";
import HoteldetailedviewOutlet from "./Adminpannel/pages/hoteldetailedviewoutlet.jsx";
import Hoteloverview from "./Adminpannel/pages/hoteloverview.jsx";
import Hotelroleverification from "./verification/hotelroleverification.jsx";



function App() {
  let {user}=useUserInfo()
  useEffect(() => {
    let useragent = navigator.userAgent;
    console.log(useragent);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        
        <Route path="/admin/*" element={
          <ProtectedRoute allowedroles={["admin"]}>
            <Adminpanneloutlet/>

          </ProtectedRoute>
          
          }>
        <Route path="hotels/*" element={<HotelOutlet/>}>
        <Route index element={<Hotel/>}/>
        <Route path="i/:hotelid/*" element={<HoteldetailedviewOutlet/>} >
        <Route index element={<Hoteloverview/>}/>
        <Route path="staffmanagement" element={"Staffmanagement"}/>
        
        </Route>
        </Route>

       

        </Route>
        <Route path="/accept-invitation/:invitationtoken" element={<Hotelroleverification/>}/>
        
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/unauthorized" element={<Unauthorized/>}/>
        <Route path="*" element={<NotFound404/>}/>

      </Routes>
      <Globalmessageholder />
    </>
  );
}

export default App;
