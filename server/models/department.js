import mongoose from "mongoose"


const DepartmentSchema = new mongoose.Schema({
    departmentname:{
        type:String,
        required:true,
        trim:true
    },
    HOD:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    description:{
        type:String,
        default:"N/A"
    },
    established:{
        type:Date
    },

},{timestamps:true})
let Department = mongoose.model("Department",DepartmentSchema)

export default Department