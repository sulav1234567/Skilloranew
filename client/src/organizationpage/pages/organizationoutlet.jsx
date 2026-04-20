
import Leftnavbar, { NavbarLink } from "../../leftnavbar/leftnavbar";
import Maincontainer from "../../maincontainer/maincontainer";
import styles from "../css/organizationoutlet.module.css"
import { MdSpaceDashboard } from "react-icons/md";
import { GoMortarBoard } from "react-icons/go";
import { Outlet } from "react-router";
import { PiTreeViewBold } from "react-icons/pi";
const Organizationoutlet = () => {
  return (
    <Maincontainer>
      <Leftnavbar orgname="SkillOra">
        <NavbarLink text="Dashboard" icon={<MdSpaceDashboard/>} end path="/organization"/>
        <NavbarLink text="Faculty" icon={<GoMortarBoard/>}  path="/organization/faculty"/>
         <NavbarLink text="Department" icon={<PiTreeViewBold/>}  path="/organization/department"/>
       

      </Leftnavbar>
      <div className={styles.rightside}>
        <div className={styles.topnavbar}>
          
        </div>
        <div className={styles.maincontentholder}>
          <Outlet/>
        </div>
        
      </div>
    </Maincontainer>
  );
};

export default Organizationoutlet;