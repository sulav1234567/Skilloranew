import "./config/dotenv.config.js";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import Cors from "cors";
import AuthRouter from "./routes/Auth.routes.js";
import connect from "./database/db.js";
import UserInfoRouter from "./routes/userinfo.routes.js";
import "./config/passport.config.js";
import hotelRouter from "./routes/hotel.routes.js";
import guestRouter from "./routes/guest.routes.js"
import RoomCategoryRouter from "./routes/Roomcategory.routes.js"
import { AuthUser } from "./middlewares/authuser.middleware.js";




var app = express();

app.use("/uploads", express.static("uploads"));
app.use(
  Cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

connect();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", AuthRouter);
app.use("/user",AuthUser, UserInfoRouter);
app.use("/hotel",hotelRouter)
app.use("/guest",guestRouter)
app.use("/roomcategory",RoomCategoryRouter)


export default app;
