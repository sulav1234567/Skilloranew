import "./config/dotenv.config.js";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import Cors from "cors";
import AuthRouter from "./routes/Auth.routes.js";
import connect from "./database/db.js";
import InfoRouter from "./routes/userinfo.routes.js";
import "./config/passport.config.js";
import DepartmentRouter from "./routes/department.routes.js";
import CourseRouter from "./routes/course.routes.js"
import SemesterRouter from "./routes/Semester.routes.js"
import ClassRouter from "./routes/class.routes.js"


var app = express();
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
app.use("/user", InfoRouter);
app.use("/department", DepartmentRouter);
app.use("/course", CourseRouter);
app.use("/semester", SemesterRouter);
app.use("/class",ClassRouter)

export default app;
