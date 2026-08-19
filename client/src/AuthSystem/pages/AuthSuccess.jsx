import { useEffect } from "react"
import { useUserInfo } from "../../userinfo/userinfo"

export const AuthSuccessPage = ()=>{
    useEffect(()=>{
       

           window.opener?.postMessage({
            type:"GOOGLE_AUTH_COMPLETE"
           },
           window.location.origin
        )

        window.close()
        

    },[])

    return(
        <h3>Signin You In ......</h3>
    )


}