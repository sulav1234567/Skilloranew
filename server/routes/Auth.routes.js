import express from "express"
import { upload } from "../config/multer.config.js";
const Router = express.Router()



import {SignupUser}from "../controller/authcontroller/auth.controller.js"


Router.post("/register/me",upload("all").none(),SignupUser);

export default Router;
