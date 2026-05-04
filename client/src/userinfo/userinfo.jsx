import { createContext, useContext, useEffect, useState } from "react";
import api from "../axios/axios";
import { useGlobalMessageContext } from "../Globalmessage/components/globalmessage";

const UserContext = createContext()


     const UserContextProvider = ({children})=>{
    let [user,setUser]=useState(null)
    let [loading,setLoading]=useState(true)
   
    

    let getUserInfo = async () => {
    setLoading(true)

    try {
        let res = await api.post("/user/getmyinfo");
        setUser(res?.data.user);

    } catch (err) {

        setUser(null)

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