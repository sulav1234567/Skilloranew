import express from "express";
import { allowRoles, AuthUser } from "../middlewares/authuser.middleware.js";
import {upload } from "../config/multer.config.js";
import { CreateHotel } from "../controller/hotelcontroller/hotel.controller.js";
let router = express.Router();

router.post(
  "/create",
  AuthUser,
  allowRoles("admin"),
  upload("all").single("organizationimage"),
  CreateHotel,
);

export default router;
