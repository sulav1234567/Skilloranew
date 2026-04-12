import { GoPersonFill } from "react-icons/go";
import styles from "../css/usernavigation.module.css";
import { FaChevronDown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { logout } from "../../logout/logout.js";
import { useUserInfo } from "../../userinfo/userinfo.jsx";
import { useGlobalMessageContext } from "../../Globalmessage/components/globalmessage.jsx";
import "../../loader.css"


const DropDownMenu = ({name=""})=>{
  let [freezeLogoutBtn,setFreezeLogoutBtn]=useState(false)
  let{getUserInfo}=useUserInfo()
  let{showMessages}=useGlobalMessageContext()


  return (
    <div className={styles.dropdownmenu} onClick={(e)=>{e.stopPropagation()}}>
      <div className={styles.welcomemessage}>
        Welcome! {name}
      </div>

      <div className={`${styles.dropdownbtn} ${styles.normalbtn}`}>Go To Dashboard</div>
       <div className={`${styles.dropdownbtn} ${styles.logoutbtn}`} onClick={()=>{
        if(!freezeLogoutBtn){
          logout(setFreezeLogoutBtn,getUserInfo,showMessages)
        }
       }}>
        {!freezeLogoutBtn?"Log Out":<div className="loader"></div>} 
       </div>
    </div>
  )
}

const Usernavigation = ({ name = "" }) => {
  const[drop,setDrop]=useState(false)
  return (
    <div className={styles.usernavigation} onClick={(e)=>{ e.stopPropagation();setDrop(!drop)}}>
      <div className={styles.usericon}>
        <GoPersonFill />
      </div>
      <div className={styles.dropdownicon}>
        <FaChevronDown />
      </div>

     {drop && <DropDownMenu name={name}/>}
    </div>
  );
};

export default Usernavigation;
