import express from "express"
import { upload } from "../config/multer.config.js";
import { CreateCourse, EditCourse } from "../controller/departmentcontroller/course.controller.js";
let router = express.Router()



router.post("/create/:departmentid",upload("all").none(),CreateCourse)
router.post("/edit/:courseid",upload("all").none(),EditCourse)






export default router;