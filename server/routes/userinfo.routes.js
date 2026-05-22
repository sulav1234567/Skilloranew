import express from "express"
import { upload } from "../config/multer.config.js";
import { allowRoles, AuthUser } from "../middlewares/authuser.middleware.js";
import { SearchUser } from "../controller/hotelcontroller/hotelrole.controller.js";
const Router = express.Router()


Router.post("/getmyinfo",AuthUser,async(req,res)=>{
    let user = req.user
    res.status(200).json({
        user:user
    })
      

})

Router.post("/getuser",AuthUser,allowRoles("admin"),SearchUser)

export default Router;
