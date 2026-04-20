import express from "express"
import { CreateDepartment, EditDepartment } from "../controller/departmentcontroller/department.controller.js";
import { upload } from "../config/multer.config.js";
import { AuthUser } from "../middlewares/authuser.middleware.js";
let router = express.Router()



router.post("/create",AuthUser,upload("all").none(),CreateDepartment)

router.post("/edit/:departmentid",AuthUser,upload("all").none(),EditDepartment);




export default router;