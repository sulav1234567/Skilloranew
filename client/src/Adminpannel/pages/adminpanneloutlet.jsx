import Leftnavbar, { NameInitials, NavbarLink } from "../../leftnavbar/leftnavbar";
import Maincontainer from "../../maincontainer/maincontainer";
import styles from "../css/adminpannel.module.css";
import { MdSpaceDashboard } from "react-icons/md";
import { GoMortarBoard, GoPerson } from "react-icons/go";
import { Outlet } from "react-router";
import { PiTreeViewBold } from "react-icons/pi";
import FormContainer from "../../forms/components/FormContainer";
import { useEffect, useState } from "react";
import api from "../../axios/axios";
import SkeletonLoader from "../../loader/loaders";
import Usernavigation from "../../landingpage/components/usernavigation";
import { useUserInfo } from "../../userinfo/userinfo";
import { LuHotel } from "react-icons/lu";
import { LuMessageSquare } from "react-icons/lu";

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
          text="Users"
          icon={<GoPerson/>}
          path="/admin/users"
        />
       
        <NavbarLink
          text="Hotels"
          icon={<LuHotel />}
          path="/admin/hotels"
        />
         <NavbarLink
          text="Messages"
          icon={<LuMessageSquare/>}
          path="/admin/messages"
        />
      </Leftnavbar>
      <div className={styles.rightside}>
        <div className={styles.topnavbar}>
          <div className={styles.topnavbarleftsection}></div>
          <div className={styles.userprofilepic}>
            {!user && <SkeletonLoader style={{height:"100%",width:"100%"}}/>}
            {user && user.avatar && <img src={user.avatar} alt="User image"/>}
            {user && !user.avatar && NameInitials(user.Fullname) }

          </div>
        </div>
        <div className={styles.maincontentholder}>
          <Outlet />
         
        </div>
      </div>
    </Maincontainer>
  );
};

export default Adminpanneloutlet;
