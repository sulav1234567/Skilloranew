import mongoose from "mongoose";

let PasswordResetSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
    isUsed:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:["active","expired"],
        default:"active"
    }

},{
    timestamps:true
})

PasswordResetSchema.index({user:1, token:1, isUsed:1,status:1})


const PasswordReset = mongoose.model("PasswordReset",PasswordResetSchema)

export default PasswordReset