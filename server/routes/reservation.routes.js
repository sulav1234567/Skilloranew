import express from 'express'
import { allowRoles, AuthUser } from '../middlewares/authuser.middleware.js'
import { upload } from '../config/multer.config.js'
import { CreateReservation, GetallReservations } from '../controller/hotelcontroller/reservation.controller.js'

let router = express.Router()

router.post("/create/:hotelid",AuthUser,allowRoles("admin"),upload("all").none(),CreateReservation)
router.get("/getallreservations/:hotelid",AuthUser,allowRoles("admin"),GetallReservations)


export default router 