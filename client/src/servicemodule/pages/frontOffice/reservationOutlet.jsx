import { Outlet } from "react-router";
import "../../css/contentholder.css";
let ReservationOutlet = () => {
  return (
    <div className={"maincontainer"}>
      <div className={"topnavbar"}></div>
      <div className={"contentholder"}>
        {<Outlet/>}


      </div>
    </div>
  );
};

export default ReservationOutlet;
