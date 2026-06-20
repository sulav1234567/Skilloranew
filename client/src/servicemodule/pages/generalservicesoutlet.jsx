import { FaConciergeBell } from "react-icons/fa";
import Leftnavbar, { NavbarLink } from "../../leftnavbar/leftnavbar";
import Maincontainer from "../../maincontainer/maincontainer";
import { useParams } from "react-router";
import { MdMeetingRoom } from "react-icons/md"


const Generalservicesoutlet = () => {
    let{hotelid}=useParams()
  return (
   <Maincontainer>
    <Leftnavbar orgname="Services">
         <NavbarLink 
        text="Overview"
        icon={<FaConciergeBell/>}
        path={`/services/${hotelid}`}
        end

        />
        <NavbarLink 
        text="Front Office"
        icon={<FaConciergeBell/>}
        path={`/services/${hotelid}/frontoffice`}

        />
         <NavbarLink 
        text="Rooms"
        icon={<MdMeetingRoom/>}
        path={`/services/${hotelid}/roommanagement`}

        />
    </Leftnavbar>
   </Maincontainer>
  );
};

export default Generalservicesoutlet;