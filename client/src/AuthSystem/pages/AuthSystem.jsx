import styles from "../css/authsystem.module.css"
import logo from "../../assets/image.svg"
import { useEffect } from "react"
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";


const AuthSystem=({onclose=()=>{}})=>{
    useEffect(()=>{
        document.body.style.overflowY="hidden";
        return()=>{
            document.body.style.overflowY="scroll"
        }
    },[])
    return (

        <div className={styles.maincontainerBg} >
            <div className={styles.authformcontainer}>
                <div className={styles.exitbtn} onClick={()=>{onclose()}}>
                    <RxCross2/>

                </div>
                <div className={styles.authfromcontentholder}>
                    <div className={styles.logoholder}>
                        <div className={styles.logo}>
                            <img src={logo} alt="logo" />
                        </div>
                    </div>

                    <div className={styles.welcomeMessage}>

                        Welcome Back
                    </div>

                    <div className={styles.welcomeSubMessage}>
                        Sign in to continue your learning journey
                    </div>

                    <div className={styles.authpagebtn}>
                        <div className={styles.authpagebtnlogo}><FcGoogle/></div>
                        <div className={styles.authpagebtntext}>Continue With Google</div>
                    </div>


                    <div className={styles.authpagebtn}>
                        <div className={styles.authpagebtnlogo}><BsGithub/></div>
                        <div className={styles.authpagebtntext}>Continue With Github</div>
                    </div>

                    <div className={styles.continuewithdivider}>Or continue with email</div>

                </div>

            </div>

        </div>
    )
}

export default AuthSystem;