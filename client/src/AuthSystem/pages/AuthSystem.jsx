import styles from "../css/authsystem.module.css"
import logo from "../../assets/image.svg"
import { useEffect, useRef, useState } from "react"
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import AuthInputs from "../../inputs/components/AuthInputs";
import { LuMail } from "react-icons/lu";
import { GoLock } from "react-icons/go";
import { RxPerson } from "react-icons/rx";
const Loginform=({setformtype=()=>{}})=>{
    return (
        <>

         <AuthInputs type="email" placeholder="youremail@gmail.com" label="Email Address:">
                       <LuMail/>
                    </AuthInputs>

                    <AuthInputs type="password" placeholder="••••••••••" label="Password:">
                       <GoLock/>
                    </AuthInputs>

                    <div className={styles.remembermeandforgotpasssettings}>
                        <div className={styles.remembermeholder}>
                            <div className={styles.togglebtn}>

                            </div>

                            <div className={styles.remembermetext}>Remember me</div>
                        </div>

                        <div className={styles.forgotpassbtn}>
                            Forgot password?
                        </div>
                    </div>

                    <div className={styles.loginbtn}>
                        Sign in
                    </div>

                    <div className={styles.navigationlink}>
                        Don't have an account? <div onClick={()=>{setformtype("signup")}}>Sign Up</div>
                    </div>
        </>
    )
}

let SignupForm=({setformtype=()=>{}})=>{
    return(
        <>
        <AuthInputs type="text" placeholder="Write Your Full Name" label="Full Name :">
                       <RxPerson/>
                    </AuthInputs>

                     <AuthInputs type="email" placeholder="youremail@gmail.com" label="Email Address :">
                       <LuMail/>
                    </AuthInputs>

                    <AuthInputs type="password" placeholder="••••••••••" label="Password:">
                       <GoLock/>
                    </AuthInputs>

                    <AuthInputs type="password" placeholder="••••••••••" label="Confirm Password:">
                       <GoLock/>
                    </AuthInputs>

                    <div className={styles.loginbtn}>
                        Create Account
                    </div>

                     <div className={styles.navigationlink}>
                        Already have an account? <div onClick={()=>{setformtype("signin")}}>Sign In</div>
                    </div>
        </>
    )
}


const AuthSystem=({onclose=()=>{},formtype="signin",setformtype=()=>{}})=>{
   
    const scrolldiv = useRef()
    useEffect(()=>{
        document.body.style.overflowY="hidden";
        return()=>{
            document.body.style.overflowY="scroll"
        }
    },[])

    useEffect(()=>{
        scrolldiv.current.scrollTo({
            top:0,
            behaviour:"smooth"
        })

    },[formtype])
    return (

        <div className={styles.maincontainerBg} >
            <div className={styles.authformcontainer}>
                <div className={styles.exitbtn} onClick={()=>{onclose()}}>
                    <RxCross2/>

                </div>
                <div className={styles.authfromcontentholder} ref={scrolldiv}>
                    <div className={styles.logoholder}>
                        <div className={styles.logo}>
                            <img src={logo} alt="logo" />
                        </div>
                    </div>

                    <div className={styles.welcomeMessage}>

                        {formtype=="signin"?"Welcome Back":"Create Account"}
                    </div>

                    <div className={styles.welcomeSubMessage}>
                       {formtype=="signin"?"Sign in to continue your learning journey":"Join thousands of learners on Skillora"} 
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

                   {formtype=="signin" && <Loginform setformtype={setformtype}/>}
                   {formtype=="signup" && <SignupForm setformtype={setformtype}/>}

                </div>

            </div>

        </div>
    )
}

export default AuthSystem;