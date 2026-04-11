import { useGlobalMessageContext } from "./globalmessage";
import styles from "../css/globalmessage.module.css"

const GlobalMessage=({messages})=>{

   return(<div className={`${styles.globalmessage} ${messages.type=="success"?styles.globalmessagesuccess:styles.globalmessagefailed}` }
            
            
            >
                {messages.text}
            </div>
   )

}


const Globalmessageholder = () => {
    let {globalmessages}=useGlobalMessageContext()
  return (
  
   <div className={styles.globalmessageholder}>
    {globalmessages.map((message)=>(
      
           <GlobalMessage messages={message} key={message.id}/>
        

    ))}

   </div>
   
  
  );
};

export default Globalmessageholder;