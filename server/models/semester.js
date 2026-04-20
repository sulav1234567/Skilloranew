import mongoose from "mongoose"


const SemesterSchema = new mongoose.Schema({
    SemesterNumber:{
        type:Number,
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    }

},{timestamps:true})

SemesterSchema.index({SemesterNumber:1,course:1},{unique:true})
let Semester = mongoose.model("Semester",SemesterSchema)

export default Semester