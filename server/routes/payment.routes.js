import express from 'express'
import { allowRoles, AuthUser } from '../middlewares/authuser.middleware.js'
import { upload } from '../config/multer.config.js'
import { CreatePayment } from '../controller/hotelcontroller/transaction.controller.js'


let router = express.Router()

router.post("/create/:folioid",AuthUser,allowRoles("admin"),upload("all").none(),CreatePayment)


const PaymentRouter = router
export default PaymentRouter