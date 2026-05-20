import express from "express";
import { allowRoles, AuthUser } from "../middlewares/authuser.middleware.js";
import { upload } from "../config/multer.config.js";
import { CreateHotel, DeleteHotel, EditHotel, SendAllHotels, SendRequestedHotel } from "../controller/hotelcontroller/hotel.controller.js";
import Hotel from "../models/hotel.js";
let router = express.Router();

router.post(
  "/create",
  AuthUser,
  allowRoles("admin"),
  upload("all").single("organizationimage"),
  CreateHotel,
);

router.put(
  "/edit/:hotelid",
  AuthUser,
  allowRoles("admin"),
  upload("all").single("organizationimage"),
  EditHotel,
);

router.delete("/delete/:hotelid",AuthUser,allowRoles("admin"),DeleteHotel)

router.get("/getinfo", AuthUser, allowRoles("admin"),SendAllHotels );
router.get("/gethotel/:hotelid",AuthUser,allowRoles("admin"), SendRequestedHotel)
export default router;
