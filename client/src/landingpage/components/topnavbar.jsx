import styles from "../css/landingpage.module.css"
import logo from "../../assets/image.svg";
import { useState } from "react";
import AuthSystem from "../../AuthSystem/pages/AuthSystem";
import { useUserInfo } from "../../userinfo/userinfo";
import Usernavigation from "./usernavigation";
import SkeletonLoader from "../../loader/loaders";
import { useSearchParams } from "react-router";

const Topnavbar = () => {

  const[searchParams]=useSearchParams()
  let signin = searchParams.get("login");
  let signup = searchParams.get("signup");
  const [AuthForm,setAuthForm]=useState(signin || signup || false)
   const[type,setType]=useState(signin===true && "signin" || signup === false && "signup" || "signin")
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
              
            {loading && <div className={styles.loginandsignupbtnholder}>
              <SkeletonLoader style={{height:"45px", width:"100px", minHeight:"45px", overflow:"hidden",borderRadius:"8px"}}/>
               <SkeletonLoader style={{height:"45px", width:"100px", minHeight:"45px", overflow:"hidden",borderRadius:"8px"}}/>
            </div>}
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