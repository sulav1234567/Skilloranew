import express from "express"
import { CreateCheckin, GetAllReservationEligibleForCheckin, GetIndividualReservation } from "../controller/hotelcontroller/checkin.controller.js"
import { allowRoles, AuthUser } from "../middlewares/authuser.middleware.js";
import { upload } from "../config/multer.config.js";
import { GetAllInhouseCheckins, GetIndividualCheckIn } from "../controller/hotelcontroller/inhouse.controller.js";
let router = express.Router()
router.get("/getallinhouse/:hotelid",AuthUser,allowRoles("admin"),GetAllInhouseCheckins);
router.get("/getindividualinhousecheckin/:hotelid/:checkincode",AuthUser,allowRoles("admin"),GetIndividualCheckIn)


const InHouseRouter = router;
export default InHouseRouter