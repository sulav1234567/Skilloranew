import express from "express"
import { CreateClass, EditClass } from "../controller/departmentcontroller/class.controller.js"
let router = express.Router()


router.post("/create",CreateClass)
router.post("/edit/:classid",EditClass)


export default router