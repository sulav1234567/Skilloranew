import express from "express"
import { upload } from "../config/multer.config.js";
import { allowRoles, AuthUser } from "../middlewares/authuser.middleware.js";
import { SearchUser } from "../controller/hotelcontroller/hotelrole.controller.js";
import HotelRole from "../models/hotelroles.js";
import { GetAllUser } from "../controller/user.controller.js";
const Router = express.Router()


Router.post("/getmyinfo",async(req,res)=>{
    let user = req.user

    let HotelRoles = await HotelRole.find({user:user._id}).select("-_id -user -__v").lean();

    let cleanUser = user.toObject?user.toObject():user
    delete cleanUser.__v;
    delete cleanUser.refreshtoken
    let finalUser = {
        ...cleanUser,
        effectiveRole:cleanUser.role==="admin"?"admin":HotelRoles.length>0?HotelRoles:"user"
    }

    res.status(200).json({
        user:finalUser
    })
      

})

Router.post("/getuser",allowRoles("admin"),SearchUser)
Router.get("/getalluser",allowRoles("admin"),GetAllUser)

export default Router;
