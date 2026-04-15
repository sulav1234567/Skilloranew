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
    faculties:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Faculty"
    }],
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    
},{timestamps:true})
let Department = mongoose.model("Department",DepartmentSchema)

export default User