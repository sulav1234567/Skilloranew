import { Outlet, useParams } from "react-router-dom";
import Maincontainer from "../../../maincontainer/maincontainer";
import Leftnavbar, { NavbarLink } from "../../../leftnavbar/leftnavbar";
import { BiSolidCategory } from "react-icons/bi";
import { MdMeetingRoom } from "react-icons/md";
import "../../css/contentholder.css";


const RoomManagementOutlet = () => {
  let {hotelid} = useParams()
  return (
   <Maincontainer>
    <Leftnavbar orgname="Room Module">
     <NavbarLink text="Room Category" icon={<BiSolidCategory/>} path={`/services/${hotelid}/roommanagement`} end/>
     <NavbarLink text="Rooms" icon={<MdMeetingRoom/>} path={`/services/${hotelid}/roommanagement/rooms`} end/>

    </Leftnavbar>
     <div className={"maincontainer"}>
      <div className={"topnavbar"}></div>
      <div className={"contentholder"}>
    <Outlet/>
    </div>
    </div>
   </Maincontainer>
  )
}

export default RoomManagementOutlet;