import mongoose from "mongoose"


let FileSchema = new mongoose.Schema({
    originalname:{
        type:String,
        required:true,
        trim:true
    },
    size:{
        type:Number,
        required:true
    },
    mimetype:{
        type:String,
        required:"true"
    },
    Url:{
        type:String,
        required:true
    },
    key:{
        type:String,
        required:true
    },
    linkedDocumentid:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"linkedmodel"
    },
    linkedModel:{
        type:String,
        required:true,
        enum:["Guest"]
    },
    hotel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    name:{
        type:String,
        enum:["guestID"]
    }

},{timestamps:true})

FileSchema.index({hotel:1,linkedDocumentid:1,linkedModel:1,guest:1,name:1});

let FileModel = mongoose.model("File",FileSchema)

export default FileModel