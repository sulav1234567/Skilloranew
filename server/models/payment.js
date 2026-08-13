import mongoose from "mongoose";


let PaymentSchema = new mongoose.Schema({
    paymentName:{
        type:String,
        trim:true,
        required:true
    },
    folio:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Folio",
        required:true
    },
    amountToPay:{
        type:Number,
        min:0,
        default:0
    },
    paymentFor:{
        type:String,
        trim:true,
        required:true
    },
    paymentItem:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:"payableModel"
    }],
    payableModel:{
        type:String,
        enum:["Reservation","Room","CheckIn","Folio"],
        required:true,
        
    },
    // isEligibleForRefund:{
    //     type:Boolean,
    //     default:false
    // },
    // totalRefundableAmount:{
    //    type:Number,
    //     min:0,
    //     default:0

    // },
    // refundedAmount:{
    //     type:Number,
    //     min:0,
    //     default:0
    // },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    // updateCount:{
    //     type:Number,
    //     min:0,
    //     max:1,
    //     default:0
    // },
    paymentType:{
        type:String,
        enum:["receive","pay","return"],
        default:"receive"
    }
},{timestamps:true})

PaymentSchema.index({_id:1,folio:1,paymentItem:1,paymentType:1,createdBy:1},{unique:true});

let PaymentModel = mongoose.model("Payment",PaymentSchema)

export default PaymentModel;