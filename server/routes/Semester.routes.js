import express from "express"
import { upload } from "../config/multer.config.js";
import { CreateSemester, EditSemester } from "../controller/departmentcontroller/semester.controller.js"
let router = express.Router()



router.post("/create",upload("all").none(),CreateSemester)
router.post("/edit/:semesterid",upload("all").none(),EditSemester)






export default router;