import { CreateGuest, SearchGuest } from "../controller/hotelcontroller/guest.controller.js";
import express from "express"
import { allowRoles, AuthUser } from "../middlewares/authuser.middleware.js";
import { upload } from "../config/multer.config.js";
let router = express.Router()

router.post("/create/:hotelid",AuthUser,allowRoles("admin"),upload("all").none(),CreateGuest);
router.post("/search/:hotelid",AuthUser,allowRoles("admin"),upload("all").none(),SearchGuest)




export default router
