import User from "../models/user.js"

export const GetAllUser=async(req,res)=>{
let allUser = await User.find({}).select("-password -googleId -refreshtoken")

res.status(200).json({
    users:allUser
})
}