import { FaConciergeBell } from "react-icons/fa";
import Leftnavbar, { NavbarLink } from "../../leftnavbar/leftnavbar";
import Maincontainer from "../../maincontainer/maincontainer";
import { useParams } from "react-router";


const Generalservicesoutlet = () => {
    let{hotelid}=useParams()
  return (
   <Maincontainer>
    <Leftnavbar>
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
    </Leftnavbar>
   </Maincontainer>
  );
};

export default Generalservicesoutlet;