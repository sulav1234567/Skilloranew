


// import mongoose from "mongoose";

import mongoose from "mongoose";
import Hotel from "../../models/hotel";

// const RoomCategorySchema = new mongoose.Schema(
//   {
//     hotel: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Hotel",
//       required: true,
//       index: true,
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       trim: true,
//     },

//     baseRate: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     maxPax: {
//       type: Number,
//       default: 2,
//       min: 1,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     createdBy:{
//       type:mongoose.Schema.Types.ObjectId,
//       ref:"User"
//     }
//   },
//   { timestamps: true }
// );

// RoomCategorySchema.index({ hotel: 1, name: 1 }, { unique: true });

// export default mongoose.model("RoomCategory", RoomCategorySchema);

let CreateCategory = async(req,res)=>{

    let user = req.user;

    if(!user || !mongoose.Types.ObjectId.isValid(user._id)){
        return res.status(401).json({
            message:"user not valid"
        })
    }

    let {hotelid}=req.params;


    if(!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)){
        return res.status(401).json({
            message:"hotel id not valid"
        })
    }

    let hotel = await Hotel.findById(hotelid);

    if(!hotel){
        return res.status(401).json({
            message:"hotel not found"
        })
    }

    

}