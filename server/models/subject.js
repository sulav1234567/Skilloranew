import mongoose from "mongoose"



const SubjectSchema = new mongoose.Schema({
    Subjectname:{
        type:String,
        required:true,
        trim:true
    },
    subjectcode:{
        type:String,
        required:true
    },
    credithours:{
        type:Number
    },
    Teacher:{
       type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Semester:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Semester"
    },
    subjectimage:{
        imagename:{type:String},
        originalname:{type:String}
    }

},{timestamps:true})
SubjectSchema.index({Semester:1})
SubjectSchema.index({Teacher:1 })
let Subject= mongoose.model("Subject",SubjectSchema)

export default Subject