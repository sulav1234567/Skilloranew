import { Outlet, useParams } from "react-router-dom";
import Maincontainer from "../../../maincontainer/maincontainer";
import Leftnavbar, { NavbarLink } from "../../../leftnavbar/leftnavbar";
import { BiSolidCategory } from "react-icons/bi";
import { MdMeetingRoom } from "react-icons/md";
import "../../css/contentholder.css";
import { createContext, useContext, useState } from "react";

let ScrollContext = createContext();
const RoomManagementOutlet = () => {
  let { hotelid } = useParams();
  let [scrollTop, setScrollTop] = useState(null);
  return (
    <Maincontainer>
      <Leftnavbar orgname="Room Module">
        <NavbarLink
          text="Room Category"
          icon={<BiSolidCategory />}
          path={`/services/${hotelid}/roommanagement/category`}
         
        />
        <NavbarLink
          text="Rooms"
          icon={<MdMeetingRoom />}
          path={`/services/${hotelid}/roommanagement/rooms`}
          
        />
      </Leftnavbar>
      <div className={"maincontainer"}>
        <div className={"topnavbar"}></div>
        <div
          className={"contentholder"}
          onScroll={(e) => {
            let Scrolltop = e.currentTarget.scrollTop;
            setScrollTop(Scrolltop);
          }}
        >
          <ScrollContext.Provider value={{ scrollTop, setScrollTop }}>
            <Outlet />
          </ScrollContext.Provider>
        </div>
      </div>
    </Maincontainer>
  );
};

export let useScrollTopContext = ()=>{
  return useContext(ScrollContext)
}
export default RoomManagementOutlet;
