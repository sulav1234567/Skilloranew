import { useUserInfo } from "../../userinfo/userinfo";
import {Navigate, useNavigate} from "react-router-dom"

let ProtectedRoute = ({children,allowedroles=[]})=>{
let{user,loading}=useUserInfo();
let navigate = useNavigate()

if(loading) return <div>loading .....</div>

if(!user){
    return <Navigate to={"/"} replace/>
}

if(!allowedroles.includes(user.role)){
    return <Navigate to={"/unauthorized"} replace/>
 
}

return children
}

export {
    ProtectedRoute
}