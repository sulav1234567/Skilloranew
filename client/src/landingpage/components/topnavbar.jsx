import styles from "../css/landingpage.module.css"
import logo from "../../assets/image.svg";
import { useState } from "react";
import AuthSystem from "../../AuthSystem/pages/AuthSystem";
import { useUserInfo } from "../../userinfo/userinfo";
import Usernavigation from "./usernavigation";

const Topnavbar = () => {

  const [AuthForm,setAuthForm]=useState(false)
   const[type,setType]=useState("signin")
   const{user,loading}=useUserInfo()
  return (
    <>
     <div className={styles.topnavbar}>
            <div className={styles.topnavbarlogoholder}>
              <div className={styles.topnavbarlogo}>
                <img src={logo} alt="logo" />
              </div>
              <div className={styles.topnavbarlogotext}>SkillOra</div>
            </div>

            <a href="/terms">Terms</a>
            <a href="/privacy">privacy</a>
             {!loading && user && <Usernavigation name={user.Fullname} image={user.avatar}/>}
               {!loading && !user &&  <div className={styles.loginandsignupbtnholder}>
              <div className={styles.primarybtn} onClick={()=>{setAuthForm(true); setType("signin")}}>Login</div>
              <div className={styles.secondarybtn} onClick={()=>{setAuthForm(true); setType("signup")}}>Get Started</div>
            </div>}
           
          </div>

          {AuthForm && <AuthSystem onclose={()=>{setAuthForm(false)}} formtype={type} setformtype={setType}/>}
          </>
  );
};

export default Topnavbar;