import styles from "./leftnavbar.module.css";
import logo from "../assets/image.svg";
import { NavLink } from "react-router";
import { useUserInfo } from "../userinfo/userinfo";
import SkeletonLoader from "../loader/loaders";

export let NameInitials = (name) => {
let namearray = name.split(" ");

  let initials = "";
  namearray.forEach((name) => {
    initials += name.split("")[0].toUpperCase();
  });

  return initials;
};

export const NavbarLink = ({ text = "", icon = {}, path = "",end=false ,onclick=()=>{}}) => {
  return (
    <NavLink
      to={path}
      end={end}
      className={({ isActive }) =>
        isActive ? `${styles.navactive} ${styles.navlink}` : `${styles.navlink}`
      }
      onClick={onclick}
    >
      <div className={styles.navlinksvg}>{icon}</div>
      <div className={styles.navlinktext}>{text}</div>
    </NavLink>
  );
};

const Leftnavbar = ({ orgname = "", ispowered = true,children }) => {
  let { user,loading } = useUserInfo();

  
  return (
    <div className={styles.leftnavbar}>
      <div className={styles.LNtopsection}>
        <div className={styles.LNlogo}>
          <img src={logo} alt="logo" />
        </div>
        <div className={styles.LNorgname}>{orgname}</div>
      </div>
      <div className={styles.LNmiddlesection}>
        {children}
      </div>
      <div className={styles.LNbottomsection}>


        {!user && (
          <>
          <div className={styles.userprofilepicture}>
            <SkeletonLoader style={{width:"100%",height:"100%"}}/>
          </div>

          <div className={styles.userinfoholder}>
             <SkeletonLoader style={{width:"150px", height:"10px", borderRadius:"5px", marginBottom:"5px"}}/>
              <SkeletonLoader style={{width:"100px", height:"10px", borderRadius:"4px"}}/>
             
            </div>
          </>
        )}
       
        {user && (
          <>
            <div className={styles.userprofilepicture}>


              {user.avatar?<img src={user.avatar} alt="" />:NameInitials(user.Fullname)}
             
            </div>
            <div className={styles.userinfoholder}>
              <div className={styles.username}>{user.Fullname}</div>
              <div className={styles.emailuser}>{user.email}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leftnavbar;
