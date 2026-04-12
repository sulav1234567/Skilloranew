import { createContext, useContext, useEffect, useState } from "react";
import api from "../axios/axios";
import { useGlobalMessageContext } from "../Globalmessage/components/globalmessage";

const UserContext = createContext()


     const UserContextProvider = ({children})=>{
    let [user,setUser]=useState(null)
    let [loading,setLoading]=useState(false)
    let {showMessages}=useGlobalMessageContext()
    let refreshtoken = async ()=>{
        loading(true)
        try{
            let res = await api.post("/auth/refresh/accesstoken");
            await getUserInfo()


        }catch(err){
            if(err?.response?.status===401){
                setUser(null)
                showMessages(err?.response?.data.message,"reject")

            }
            if(err?.response?.status===400){
                setUser(null)
            }
            throw err

        }
        finally{
            setLoading(false)
        }
    }
    

    let getUserInfo = async () => {
    setLoading(true)

    try {
        let res = await api.post("/user/getmyinfo");
        setUser(res?.data.user);

    } catch (err) {

        if (
            err?.response?.status === 401 &&
            err?.response?.data.message === "ACCESS_TOKEN_EXPIRED"
        ) {
            try {
                await refreshtoken();   
                let res = await api.post("/user/getmyinfo");
                setUser(res?.data.user);
            } catch (refreshErr) {
                setUser(null);
            }
        }

        else if (
            err?.response?.status === 401 &&
            err?.response?.data.message === "Unauthorized"
        ) {
            setUser(null)
        }

    } finally {
        setLoading(false)
    }
}
    
useEffect(()=>{
   getUserInfo()
},[])
    

    return (
       <UserContext.Provider value={{user,loading,getUserInfo}}>
        {children}
       </UserContext.Provider>
    )
}

export const useUserInfo = ()=>useContext(UserContext)

export default UserContextProvider