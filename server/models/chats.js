import mongoose from "mongoose";

let chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  contenttype:{
    type:String,
    enum:["text","files"],
    default:"text"
  },

  content:{
    type:String,
    trim:true,
    required:true
  },
  status:{
    type:String,
    enum:["sent","delivered","read"],
    default:"sent"
  }
},{timestamps:true});

let ChatModel = mongoose.model("Chat",chatSchema);

export default ChatModel;
