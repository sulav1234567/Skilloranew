
import { createContext, useContext, useState } from "react";
import styles from "../css/Formcontainer.module.css";
import { BtnLoader } from "./FormContainer";

const ConfirmationMessageContext=createContext(null)
const Confirmationmessage = ({message,okFunction=()=>{},cancelFunction=()=>{},loading=false}) => {
  return (
    <div className={styles.confirmmessagemainholder}>
        <div className={styles.confirmmessage}>
            <div className={styles.confirmmessagetext}>
              {message}

            </div>
            <div className={styles.confirmmessagebtnholder}>
              <div className={`${styles.confirmmessagebtn} ${styles.confirmmessagecancelbtn}`}
              onClick={()=>{
                cancelFunction();
              }}
              >cancel</div>
              <div className={`${styles.confirmmessagebtn} ${loading?styles.confirmmessageconfirmbtnloading:styles.confirmmessageconfirmbtn}`}
              onClick={()=>{
                if(!loading){

                  okFunction()
                }
              }}
              >
                {!loading? "confirm":<BtnLoader/>}
               
                
                </div>
                
            </div>
        </div>

    </div>
  );
};

const ConfirmationMessageContextProvider=({children})=>{
  let[confirmationMessageData,setConfirmationMessageData]=useState({
    show:false,
    message:null,
    okFunction:()=>{},
    loading:false
  })
  let clearMessage = ()=>{
    setConfirmationMessageData({
      show:false,
      message:null,
      okFunction:()=>{},
      loading:false
    })
  }

  return(
    <ConfirmationMessageContext.Provider value={{confirmationMessageData,setConfirmationMessageData,clearMessage}}>
      {children}
      {confirmationMessageData.show && 
      <Confirmationmessage
      message={confirmationMessageData.message}
      okFunction={confirmationMessageData.okFunction}
      cancelFunction={clearMessage}
      loading={confirmationMessageData.loading}
      />}
    </ConfirmationMessageContext.Provider>
  )

}

export default ConfirmationMessageContextProvider;
export const useConfirmationMessageContext=()=>{return useContext(ConfirmationMessageContext)}