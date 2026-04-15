
import Leftnavbar, { NavbarLink } from "../../leftnavbar/leftnavbar";
import Maincontainer from "../../maincontainer/maincontainer";
import styles from "../css/organizationoutlet.module.css"
import { MdSpaceDashboard } from "react-icons/md";
import { GoMortarBoard } from "react-icons/go";
const Organizationoutlet = () => {
  return (
    <Maincontainer>
      <Leftnavbar orgname="SkillOra">
        <NavbarLink text="Dashboard" icon={<MdSpaceDashboard/>} end path="/organization"/>
        <NavbarLink text="Faculty" icon={<GoMortarBoard/>}  path="/organization/faculty"/>

      </Leftnavbar>
      <div className={styles.rightside}></div>
    </Maincontainer>
  );
};

export default Organizationoutlet;