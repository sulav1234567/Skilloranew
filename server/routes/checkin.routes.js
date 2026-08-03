import express from "express"
import { CreateCheckin, GetAllReservationEligibleForCheckin } from "../controller/hotelcontroller/checkin.controller.js"
import { allowRoles, AuthUser } from "../middlewares/authuser.middleware.js";
import { upload } from "../config/multer.config.js";
let router = express.Router()
router.get("/getalleligiblereservations/:hotelid",GetAllReservationEligibleForCheckin);
router.post("/create/:hotelid/:reservationid",AuthUser,allowRoles("admin"),upload("all").any(),CreateCheckin)



let CheckinRouter = router;
export default CheckinRouter