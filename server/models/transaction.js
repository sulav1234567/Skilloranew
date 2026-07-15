import mongoose from "mongoose";


let TransactionSchema = new mongoose.Schema({
    transactionId:{
        type:String,
        required:true
    },
    folioid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Payment",
        required:true
    },
    status:{
        type:String,
        enum:["successful","aborted","pending"],
        default:"successsful",
        required:true
    },
    amount:{
        type:Number,
        default:0,
        required:true,
        min:0

    },
    txnType:{
        type:String,
        enum:["normal","refund"],
        default:"normal",
        required:true

    },
    paidBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Guest",
        
    },
    receivedBy:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    modeOfPayment:{
        type:String,
        enum:["cash","esewa","bank","fonepay","card","khalti","upi"],
        required:true
    },
    paymentModeId:{
        type:"String",
        required: [
          function () {
            return this.modeOfPayment && this.modeOfPayment!== "cash";
          },
          "An online/transaction id is required for non-cash payments.",
        ],

    },
    remarks:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

TransactionSchema.pre("validate", function () {
  if (!this.transactionId) {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    this.transactionId= `TXN-${random}`;
  }

});

TransactionSchema.index({paymentid:1,status:1,transactionId:1,txnType:1,paidBy:1,})

let TransactionModel=mongoose.model("Transaction",TransactionSchema)

export default TransactionModel;