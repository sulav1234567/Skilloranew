import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { upload } from "../config/multer.config.js";
import {
  ForgotPassword,
  LoginUser,
  Logout,
  RefreshToken,
  ResetPassword,
  SignupUser,
} from "../controller/authcontroller/auth.controller.js";
import {
  GenerateAccessToken,
  GenerateRefreshToken,
} from "../utlits/jwt.utlits.js";
import { sendWelcomeMail } from "../controller/mail.controller.js";

const Router = express.Router();

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = isProduction
  ? `HttpOnly; Secure; SameSite=${process.env.SAME_SITE}; Domain=.skillsoora.com`
  : `HttpOnly; SameSite=${process.env.SAME_SITE}`;

Router.post("/register/me", upload("all").none(), SignupUser);
Router.post("/login/me", upload("all").none(), LoginUser);
Router.post("/refresh/accesstoken", RefreshToken);
Router.post("/logout/me", Logout);

Router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

Router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const user = req.user;

    const accessToken = GenerateAccessToken(user);
    const refreshToken = GenerateRefreshToken(user);

    const hashed = await bcrypt.hash(refreshToken, 10);
    user.refreshtoken = hashed;
    await user.save();
    res.setHeader("Set-Cookie", [
      `refreshtoken=${refreshToken}; ${cookieOptions}; Path=/`,
      `accesstoken=${accessToken}; ${cookieOptions}; Path=/`,
    ]);
    res.redirect(process.env.FRONTEND_URL);


     if(!isProduction ){
      try {
      await sendWelcomeMail({
        email: user.email,
        name: user.Fullname,
      });
    } catch (mailError) {
      console.log("Password email sending failed:", mailError.message);
    }
  }

   
  },
);

Router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

Router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  async (req, res) => {
    const user = req.user;

    const accessToken = GenerateAccessToken(user);
    const refreshToken = GenerateRefreshToken(user);

    const hashed = await bcrypt.hash(refreshToken, 10);
    user.refreshtoken = hashed;
    await user.save();

    res.setHeader("Set-Cookie", [
      `refreshtoken=${refreshToken}; ${cookieOptions}; Path=/`,
      `accesstoken=${accessToken}; ${cookieOptions}; Path=/`,
    ]);
    res.redirect(process.env.FRONTEND_URL);



    if(!isProduction){


     try {
      await sendWelcomeMail({
        email: user.email,
        name: user.Fullname,
      });
    } catch (mailError) {
      console.log("Password email sending failed:", mailError.message);
    }

     }

   
  }
);

Router.post("/forgotpassword",upload("all").none(),ForgotPassword)
Router.get("/resetpassword/:token",ResetPassword)

export default Router;
