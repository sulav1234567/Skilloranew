import express from "express"
import { allowRoles, AuthUser } from "../middlewares/authuser.middleware.js"
import { CreateRoomCategory, EditRoomCategory, GetAllRoomCategory, GetSingleRoomCategory } from "../controller/hotelcontroller/roomcategory.controller.js"
import { upload } from "../config/multer.config.js";
let router = express.Router()

router.post("/create/:hotelid",AuthUser,allowRoles("admin"),upload("all").none(),CreateRoomCategory);

router.put("/edit/:roomcategoryid",AuthUser,allowRoles("admin"),upload("all").none(),EditRoomCategory);
router.get("/singlecategory/:roomcategoryid",AuthUser,allowRoles("admin"),GetSingleRoomCategory);
router.get("/getall/:hotelid",AuthUser,allowRoles("admin"),GetAllRoomCategory);


export default router