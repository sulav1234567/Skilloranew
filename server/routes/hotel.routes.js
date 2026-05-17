import express from "express";
import { allowRoles, AuthUser } from "../middlewares/authuser.middleware.js";
import { upload } from "../config/multer.config.js";
import { CreateHotel, EditHotel } from "../controller/hotelcontroller/hotel.controller.js";
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

router.get("/getinfo", AuthUser, async (req, res) => {
  let user = req.user;

  if (!user) {
     return res.status(404).json({
      message: "User Not found",
    });
  }

  try {
    let hotels = await Hotel.find({}).sort({createdAt:-1});

    res.status(200).json({
      message: "Request successful",
      hotels: hotels,
    });
  } catch (err) {
    if (err) {
      return res.status(500).json({
        message: err.message
      })
    }
  }
});
export default router;
