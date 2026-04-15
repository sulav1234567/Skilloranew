import styles from "./leftnavbar.module.css";
import logo from "../assets/image.svg";
import { NavLink } from "react-router";
import { useUserInfo } from "../userinfo/userinfo";

let NameInitials = (name) => {
  let namearray = name.split(" ");

  let initials = "";
  namearray.forEach((name) => {
    initials += name.split("")[0].toUpperCase();
  });

  return initials;
};

export const NavbarLink = ({ text = "", icon = {}, path = "",end=false }) => {
  return (
    <NavLink
      to={path}
      end={end}
      className={({ isActive }) =>
        isActive ? `${styles.navactive} ${styles.navlink}` : `${styles.navlink}`
      }
    >
      <div className={styles.navlinksvg}>{icon}</div>
      <div className={styles.navlinktext}>{text}</div>
    </NavLink>
  );
};

const Leftnavbar = ({ orgname = "", ispowered = true,children }) => {
  let { user } = useUserInfo();
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
