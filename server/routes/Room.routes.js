import express from "express"
import { allowRoles, AuthUser } from "../middlewares/authuser.middleware.js"
import { CreateRoom, EditRoom, GetAllRooms } from "../controller/hotelcontroller/room.controller.js"
import { upload } from "../config/multer.config.js"
let router = express.Router()

router.post("/create/:hotelid",AuthUser,allowRoles("admin"),upload("all").none(),CreateRoom)
router.put("/edit/:roomid",AuthUser,allowRoles("admin"),upload("all").none(),EditRoom)
router.get("/getall/:hotelid",AuthUser,allowRoles("admin"),GetAllRooms)


export default router