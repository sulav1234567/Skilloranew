import express from "express"
import { GetAllReservationEligibleForCheckin } from "../controller/hotelcontroller/checkin.controller.js"
let router = express.Router()
router.get("/getalleligiblereservations/:hotelid",GetAllReservationEligibleForCheckin);



let CheckinRouter = router;
export default CheckinRouter