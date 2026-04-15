import express from "express"
import { upload } from "../config/multer.config.js";
const Router = express.Router()
import passport from "passport";



import {LoginUser, Logout, RefreshToken, SignupUser}from "../controller/authcontroller/auth.controller.js"
import { GenerateAccessToken, GenerateRefreshToken } from "../utlits/jwt.utlits.js";
import bcrypt from "bcryptjs";


const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = isProduction
  ? `HttpOnly; Secure; SameSite=${process.env.SAME_SITE}`   
  : `HttpOnly; SameSite=${process.env.SAME_SITE}`;   

Router.post("/register/me",upload("all").none(),SignupUser);
Router.post("/login/me",upload("all").none(),LoginUser)
Router.post("/refresh/accesstoken",RefreshToken)
Router.post("/logout/me",Logout)

Router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
Router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const user = req.user;

    const accessToken = GenerateAccessToken(user);
    const refreshToken = GenerateRefreshToken(user);

    // hash refresh token
    const hashed = await bcrypt.hash(refreshToken, 10);
    user.refreshtoken = hashed;
    await user.save();

    // set cookies
    res.setHeader("Set-Cookie", [
      `refreshtoken=${refreshToken}; ${cookieOptions}; Path=/`,
      `accesstoken=${accessToken}; ${cookieOptions}; Path=/`,
    ]);
    res.redirect(process.env.FRONTEND_URL);
  }
);
export default Router;
