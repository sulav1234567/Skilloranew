import { createContext, useContext, useState } from "react"

let GlobalMessageContext  = createContext()



export const GlobalMessageProvider=({children})=>{
    let [globalmessages,setGlobalMessages]=useState([])


    const showMessages = (text,type="success",duration=3000)=>{
        const id = `${Math.floor(Math.random()*200)}`;

        setGlobalMessages((prev)=>([
            ...prev,
            {id,text,type,duration}
        ]))

        setTimeout(() => {
            setGlobalMessages((prev)=>(
                prev.filter(p=>p.id!==id)
            ))
            
        }, duration);
    }



    return(
        <GlobalMessageContext.Provider value={{globalmessages,showMessages}}>
            {children}
        </GlobalMessageContext.Provider>
    )
}

export const useGlobalMessageContext = () =>{
    return useContext(GlobalMessageContext)

}