import api from "../axios/axios"

export let logout = async(freezebtn,getUserInfo,showMessages)=>{
    freezebtn(true)
    try{
        let res = await api.post("/auth/logout/me");
        await getUserInfo();

        showMessages(res?.data.message,"success")




    }catch(err){
        console.log(err.response.data)
        if(err?.response){
            showMessages(err?.response?.data.message || err?.response?.data,"reject")
        }
    }
    finally{
        freezebtn(false)
    }
}