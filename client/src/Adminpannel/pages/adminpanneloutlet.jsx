import Leftnavbar, { NavbarLink } from "../../leftnavbar/leftnavbar";
import Maincontainer from "../../maincontainer/maincontainer";
import styles from "../css/adminpannel.module.css";
import { MdSpaceDashboard } from "react-icons/md";
import { GoMortarBoard } from "react-icons/go";
import { Outlet } from "react-router";
import { PiTreeViewBold } from "react-icons/pi";
import FormContainer from "../../forms/components/FormContainer";
import { useEffect, useState } from "react";
import api from "../../axios/axios";
import SkeletonLoader from "../../loader/loaders";
import Usernavigation from "../../landingpage/components/usernavigation";
import { useUserInfo } from "../../userinfo/userinfo";
const Adminpanneloutlet = () => {
  let {user}=useUserInfo()
  return (
    <Maincontainer>
      <Leftnavbar orgname="SkillOra">
        <NavbarLink
          text="Dashboard"
          icon={<MdSpaceDashboard />}
          end
          path="/admin"
        />
        <NavbarLink
          text="Faculty"
          icon={<GoMortarBoard />}
          path="/admin/faculty"
        />
        <NavbarLink
          text="Department"
          icon={<PiTreeViewBold />}
          path="/admin/department"
        />
      </Leftnavbar>
      <div className={styles.rightside}>
        <div className={styles.topnavbar}>
          <div className={styles.topnavbarleftsection}></div>
          <div className={styles.userprofilepic}>
            {!user && <SkeletonLoader style={{height:"100%",width:"100%"}}/>}

          </div>
        </div>
        <div className={styles.maincontentholder}>
          <Outlet />
          <SkeletonLoader style={{ height: "20vh", width: "100%" }} />
        </div>
      </div>
    </Maincontainer>
  );
};

export default Adminpanneloutlet;
