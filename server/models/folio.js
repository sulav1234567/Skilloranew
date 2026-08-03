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
        enum:["Reservation","CheckIn"],
        default:"Reservation"
    },
    status:{
        type:String,
        enum:["open","closed","transferred"],
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

    transferredAmount:{
        type:Number,
        min:1,
        requred:[
            function(){

                return this.status && this.status==="transferred"

            },
            "Transferred amount is required"
        ]

    },
     transferredToModel:{
         type:String,
         enum:["Reservation","CheckIn"],
        requred:[
            function(){

                return this.status && this.status==="transferred"

            },
            "Transferred model"
        ]


    },
    transferredTo:{
         type:mongoose.Schema.Types.ObjectId,
         refPath:"transferredToModel",
        requred:[
            function(){

                return this.status && this.status==="transferred"

            },
            "Transferred to id is required"
        ]


    },
    
    

    
    

},{
    timestamps:true
})

folioSchema.index({guest:1,hotel:1,status:1,linkedModelId:1,linkedModel:1},{
    unique: true,
    partialFilterExpression: {
      status: "open",
    },
  })

let Folio= mongoose.model("Folio",folioSchema)

export default Folio;