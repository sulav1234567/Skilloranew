import { Route, Routes } from "react-router-dom";
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
import ServiceModuleOutlet from "./servicemodule/pages/serviceModuleOutlet.jsx";
import Generalservicesoutlet from "./servicemodule/pages/generalservicesoutlet.jsx";
import FrontOfficeOutlet from "./servicemodule/pages/frontOffice/frontOfficeOutlet.jsx";
import Reservation from "./servicemodule/pages/frontOffice/reservation.jsx";
import ResetPassword from "./resetmyPassword/resetPassword.jsx";
import LiquidGlass from "./liquidglass.jsx";
import RoomManagementOutlet from "./servicemodule/pages/rooms/roommanagementOutlet.jsx";
import Roomcategory from "./servicemodule/pages/rooms/Roomcategory.jsx";
import RoomsOutlet from "./servicemodule/pages/rooms/roomsoutlet.jsx";
import Rooms from "./servicemodule/pages/rooms/Rooms.jsx";
import CategoryIndividualView from "./servicemodule/pages/rooms/categoryIndividualView.jsx";
import RoomCategoryOutlet from "./servicemodule/pages/rooms/roomCategoryOutlet.jsx";
import RoomIndividualView from "./servicemodule/pages/rooms/roomIndividualView.jsx";
import ReservationOutlet from "./servicemodule/pages/frontOffice/reservationOutlet.jsx";
import ReservationDetailedView from "./servicemodule/pages/frontOffice/ReservationDetailedView.jsx";
import CheckInOutlet from "./servicemodule/pages/frontOffice/checkinoutlet.jsx";
import CheckIn from "./servicemodule/pages/frontOffice/checkin.jsx";
import CheckinProcess from "./servicemodule/pages/frontOffice/checkinprocess.jsx";
import InHouseInOutlet from "./servicemodule/pages/frontOffice/inhouse pages/inhouseOutlet.jsx";
import InHouse from "./servicemodule/pages/frontOffice/inhouse pages/inhouse.jsx";
import InhouseDetailedView from "./servicemodule/pages/frontOffice/inhouse pages/inhousedetailedview.jsx";
import UserOutlet from "./Adminpannel/pages/Useroutlet.jsx";
import User from "./Adminpannel/pages/user.jsx";
import MessageOutlet from "./Adminpannel/pages/messagegs/messageOutlet.jsx";
import { MessageRightSide } from "./Adminpannel/pages/messagegs/messageholder.jsx";


function App() {
  let { user } = useUserInfo();
  useEffect(()=>{

    console.log(window.history)
  },[])
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Landingpage />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedroles={["admin"]}>
              <Adminpanneloutlet />
            </ProtectedRoute>
          }
        >
          <Route path="hotels/*" element={<HotelOutlet />}>
            <Route index element={<Hotel />} />
            <Route path="i/:hotelid/*" element={<HoteldetailedviewOutlet />}>
              <Route index element={<Hoteloverview />} />
              <Route path="staffmanagement" element={"Staffmanagement"} />
            </Route>
          </Route>
         <Route path="users/*" element={<UserOutlet/>}>
         <Route index element={<User/>}/>
         </Route>
         <Route path="messages/*" element={<MessageOutlet/>}>
         <Route path="i/:receiverid" element={<MessageRightSide/>}/>
         </Route>
        </Route>

        <Route
          path="/services/:hotelid/*"
          element={
            <ProtectedRoute allowedroles={["admin"]}>
              <ServiceModuleOutlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<Generalservicesoutlet />} />
          <Route path="roommanagement/*" element={<RoomManagementOutlet />}>
            <Route path="category/*" element={<RoomCategoryOutlet />} >
            <Route index element={<Roomcategory/>}/>
             <Route path="i" element={<CategoryIndividualView/>}/>
            </Route>
            <Route path="rooms/*" element={<RoomsOutlet />}>
              <Route index element={<Rooms />} />
              <Route path="i" element={<RoomIndividualView/>}/>
            </Route>
           
          </Route>
          <Route path="frontoffice/*" element={<FrontOfficeOutlet />}>
            <Route path="reservation/*" element={<ReservationOutlet />} >
            <Route index element={<Reservation/>}/>
            <Route path="ir/:reservationid" element={<ReservationDetailedView/>}/>
            </Route>
            <Route path="check-in/*" element={<CheckInOutlet/>}>
            <Route index element={<CheckIn/>}/>
            <Route path="checkinprocess/:reservationid" element={<CheckinProcess/>}/>
            </Route>

            <Route path="In-House" element={<InHouseInOutlet/>}>
            <Route index element={<InHouse/>}/>
            <Route path="iihr/:inhousecode" element={<InhouseDetailedView/>}/>
            </Route>
          </Route>
        </Route>

        <Route
          path="/accept-invitation/:invitationtoken"
          element={<Hotelroleverification />}
        />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/liquidglass" element={<LiquidGlass />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/resetmypassword/:token" element={<ResetPassword />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      <Globalmessageholder />
    </>
  );
}

export default App;
