import { useNavigate, useParams } from "react-router";
import styles from "./resetPassword.module.css"
import { useGlobalMessageContext } from "../Globalmessage/components/globalmessage";
import api from "../axios/axios";
import { useEffect } from "react";

const ResetPassword = () => {
  let {token}=useParams()
  let{showMessages}=useGlobalMessageContext();
  let navigate = useNavigate()
  let fetchFunction = async ()=>{
    if(!token){
      showMessages("Token Not Found","reject");
      navigate(`/`,{replace:true})
      return;
    }

    try{
     let res = await api.get(`/auth/resetpassword/${token}`);

     if(res.status === 201){
        showMessages(res?.data.message,"success");
        navigate(`/`,{replace:true})
      return;

     }

    }catch(err){

        if(err){
             showMessages(err?.response.data.message,"reject");
        navigate(`/`,{replace:true})
      return;

        }
    }
  }

  useEffect(()=>{
    fetchFunction()

  },[])
  return (
   <div className={styles.container}>

    <div className={styles.loader}></div>
   </div>
  );
};

export default ResetPassword;