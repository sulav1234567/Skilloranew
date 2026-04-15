import mongoose from "mongoose"


const UserSchema = new mongoose.Schema({
    Fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
      'Please enter a valid email address']
    },
    password:{
        type:String,
        required:false
    },
    refreshtoken:{
        type:String
    },
    googleId: String,
    avatar: String
},{timestamps:true})
let User = mongoose.model("User",UserSchema)

export default User