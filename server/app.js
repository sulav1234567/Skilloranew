
import express from "express"
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan"
import Dotenv from "dotenv"
import Cors from "cors"
import AuthRouter from "./routes/Auth.routes.js"

Dotenv.config()
import connect from "./database/db.js"


var app = express();
connect()

app.use(Cors({
   origin:[
    `${process.env.FRONTEND_URL}`
   ],
   methods:["POST","Get"],
   credentials:true ,
   allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.use("/auth",AuthRouter)


export default app
