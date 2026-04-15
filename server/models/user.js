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
    
    refreshtoken:{
        type:String
    },
    googleId: {type:String},
    password:{
        type:String,
        required:function () {
            return !this.googleId
        }
    },
    avatar: {type:String},
    authprovider:{
      local:{
        type:Boolean,
        default:false
      },
      google:{
        type:Boolean,
        default:false
      }
    }
},{timestamps:true})
let User = mongoose.model("User",UserSchema)

export default User