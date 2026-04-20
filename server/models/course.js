import mongoose from "mongoose"



const CourseSchema = new mongoose.Schema({
    coursename:{
        type:String,
        required:true,
        trim:true
    },
    coursecode:{
        type:String,
        required:true
    },
    TotalSemesters:{
        type:Number,
        default:null
    },
    Department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department"
    },
    courseimage:{
        imagename:{type:String},
        originalname:{type:String}
    }

},{timestamps:true})
CourseSchema.index({Department:1})
let Course = mongoose.model("Course",CourseSchema)

export default Course