import Dotenv from "dotenv"
Dotenv.config()
import express from "express"
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan"

import Cors from "cors"
import AuthRouter from "./routes/Auth.routes.js"

Dotenv.config()
import connect from "./database/db.js"
var app = express();
app.use(Cors({
   origin:[
    `${process.env.FRONTEND_URL}`
   ],
   methods:["POST","GET"],
   credentials:true ,
   allowedHeaders: ["Content-Type", "Authorization"]
}))



connect()


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.use("/auth",AuthRouter)


export default app
