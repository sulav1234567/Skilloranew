import mongoose from "mongoose"

let folioSchema = new mongoose.Schema({
    hotel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel",
        required:true
    },
    guest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Guest",
        required:true

    },
    linkedModelId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"linkedModel",
        required:true   
    },
    linkedModel:{
        type:String,
        required:true,
        enum:["Reservation"],
        default:"Reservation"
    },
    status:{
        type:String,
        enum:["open","closed"],
        default:"open",
        required:true
    },
    totalAmount:{
        type:Number,
        min:0,
        default:0
    },
    amountPaid:{
        type:Number,
        min:0,
        default:0,
    },
    
    
    

},{
    timestamps:true
})

folioSchema.index({guest:1,hotel:1,status:1},{unique:true})

let Folio= mongoose.model("Folio",folioSchema)

export default Folio;