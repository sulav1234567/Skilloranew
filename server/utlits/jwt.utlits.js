import jwt from "jsonwebtoken"


export const GenerateRefreshToken = (user)=>{

    return jwt.sign({id:user._id,email:user.email,role:user.role},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});

}
export const GenerateAccessToken = (user)=>{

    return jwt.sign({id:user._id,email:user.email,role:user.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});

}

export const VerifyRefreshToken=(token)=>{
    return jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
}
export const VerifyAccessToken=(token)=>{
    return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
}