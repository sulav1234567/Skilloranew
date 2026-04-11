import express from "express"
import { upload } from "../config/multer.config.js";
import { AuthUser } from "../middlewares/authuser.middleware.js";
const Router = express.Router()


Router.post("/getmyinfo",AuthUser,async(req,res)=>{
    let user = req.user
    res.status(200).json({
        user:user
    })
      

})

export default Router;
