import User from "../models/user.js";
import { VerifyAccessToken } from "../utlits/jwt.utlits.js";




export const AuthUser = async(req,res,next)=>{

    let accesstoken = req.cookies.accesstoken;
  if (!accesstoken) {
    res.setHeader("Set-Cookie", [
      `refreshtoken=; HttpOnly; ${process.env.HTTP_ONLY}  SameSite=${process.env.SAME_SITE}; Path=/; Max-Age=0`,
      `accesstoken=; HttpOnly; ${process.env.HTTP_ONLY}  SameSite=${process.env.SAME_SITE}; Path=/; Max-Age=0`,
    ]);

    return res.status(401).json({
      message: "Unauthorized",
    });
  }


   try{
     const decoded = VerifyAccessToken(accesstoken);
  
     const user = await User.findById(decoded.id).select("-password");
  
     if(!user){
      return res.status(400).json({
          message:"user not found"
      })
     }

     req.user=user;
     next();
    }
    catch(err){
      console.log(err.name)
      if(err.name === "TokenExpiredError"){
        return res.status(401).json({
            message:"ACCESS_TOKEN_EXPIRED"
        })

      }
      res.status(401).json({
            message:"unauthorized"
        })

    }


}