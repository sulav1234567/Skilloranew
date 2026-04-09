

import { useState } from "react";
import styles from "../css/authinputs.module.css"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const AuthInputs=({children,type,required=true,label,placeholder})=>{
    const[seePassword,setSeePassword]=useState(false)

    return (
        <div className={styles.inputholder}>
            <div className={styles.inputlabel}>{label}</div>
            <div className={styles.input}>
                <div className={styles.inputicon}>
                    {children}
                </div>
                {type!="password"&&<input type={type} placeholder={placeholder} required={required} />}
                {type==="password"&&<input type={seePassword?"text":"password"} placeholder={placeholder} required={required} />}
            {type==="password" && <div className={styles.viewbtnforpassword} onClick={()=>{
                setSeePassword(!seePassword)
            }}>
                {!seePassword?<IoEye/>:<IoEyeOff/>}
            </div>}
            </div>
            

        </div>
    )

}


export default AuthInputs