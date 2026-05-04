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
    githubid:{type:String},
    password:{
        type:String,
        required:function () {
            return !this.googleId&& !this.githubid
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
      },
      github:{
        type:Boolean,
        default:false
      }
    },
    role:{
      type:String,
      enum:["admin","user"],
      default:"user"
    }
},{timestamps:true})
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User