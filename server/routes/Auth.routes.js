import express from "express"
import { upload } from "../config/multer.config.js";
const Router = express.Router()



import {LoginUser, RefreshToken, SignupUser}from "../controller/authcontroller/auth.controller.js"


Router.post("/register/me",upload("all").none(),SignupUser);
Router.post("/login/me",upload("all").none(),LoginUser)
Router.post("/refresh/accesstoken",RefreshToken)

export default Router;
