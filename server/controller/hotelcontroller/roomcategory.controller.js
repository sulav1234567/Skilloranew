import mongoose from "mongoose";
import Hotel from "../../models/hotel.js"
import RoomCategory from "../../models/roomCategory.js"

let CreateRoomCategory = async(req,res)=>{
    let{name,description,baseRate,maxPax,isActive}=req.body;
    let {hotelid}=req.params;
    let user = req.user;
    if(!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)){
        return res.status(400).json({
            message:"Invalid hotel id"
        })
    }
    let toBoolean = (val) => {
      return val === "true";
    };
    let isBoolean = (val) => {
     
      return val === "true" || val === "false" || val === true || val === false;
    };
    baseRate = Number.parseInt(baseRate)
    maxPax = Number.parseInt(maxPax)
    try{

    if(!name || !baseRate || !maxPax || !isActive){
        return res.status(400).json({
            message:"Some data are missing"
        })
    }

    if(isNaN(baseRate) || isNaN(maxPax) || baseRate<=0 || maxPax<=0){
        return res.status(400).json({
            message:"pax or baserate is invalid"
        })
    }

    if(!isBoolean(isActive)){
         return res.status(400).json({
            message:"Invalid Boolean Value"
        })

    }

    let HotelModel = await Hotel.findById(hotelid);
    if(!HotelModel){
        return res.status(404).json({
            message:"hotel not found"
        })
    }

    let existingCategory = await RoomCategory.findOne({hotel:hotelid,name:name});

    if(existingCategory){
        return res.status(400).json({
            message:"Roomcategory with thihs name already exists"
        })
    }

    let newCategory = new RoomCategory({
        hotel:HotelModel._id,
        name,
        description,
        maxPax,
        baseRate,
        createdBy:user._id,
        isActive:toBoolean(isActive)

    })

    await newCategory.save()

    return res.status(201).json({
        message:"Room Category Created"
    })



}
catch(err){

    if(err){
        return res.status(500).json({
            message:err.message || "internal server error"
        })
    }

}
}

let EditRoomCategory = async(req,res)=>{
    let{name,description,baseRate,maxPax,hotelid,isActive}=req.body;
    let {roomcategoryid}=req.params;
    console.log(req.body,roomcategoryid)
    if(!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)){
        return res.status(400).json({
            message:"Invalid hotel id"
        })
    }

    let toBoolean = (val) => {
      return val === "true";
    };
    let isBoolean = (val) => {
     
      return val === "true" || val === "false" || val === true || val === false;
    };
    if(!roomcategoryid || !mongoose.Types.ObjectId.isValid(roomcategoryid)){
        return res.status(400).json({
            message:"Invalid roomcategory id"
        })
    }
    baseRate = Number.parseInt(baseRate)
    maxPax = Number.parseInt(maxPax)
    try{

    if(!name || !baseRate || !maxPax || !isActive || isActive === undefined || isActive === null){
        return res.status(400).json({
            message:"Some data are missing"
        })
    }

    if(isNaN(baseRate) || isNaN(maxPax) || baseRate<=0 || maxPax<=0){
        return res.status(400).json({
            message:"pax or baserate is invalid"
        })
    }

    let HotelModel = await Hotel.findById(hotelid);
    if(!HotelModel){
        return res.status(404).json({
            message:"hotel not found"
        })
    }

    let existingCategory = await RoomCategory.findById(roomcategoryid);
    let duplicateCategory = await RoomCategory.findOne({hotel:hotelid,name:name,_id:{$ne:roomcategoryid}})

    if(duplicateCategory){
         return res.status(400).json({
            message:"Roomcategory with thihs name already exists"
        })

    }

    if(!existingCategory){
        return res.status(400).json({
            message:"Roomcategory with thihs name doesnot exists"
        })
    }
     if(!isBoolean(isActive)){
         return res.status(400).json({
            message:"Invalid Boolean Value"
        })

    }

  
    existingCategory.name=name.trim();
    existingCategory.hotel=HotelModel._id;
    existingCategory.description=description || "N/A";
    existingCategory.maxPax=maxPax,
    existingCategory.baseRate=baseRate;
    existingCategory.isActive=toBoolean(isActive)
    await existingCategory.save()

    return res.status(200).json({
        message:"Room Category Edited"
    })



}
catch(err){

    if(err){
        console.log(err)
        return res.status(500).json({
            message:err.message || "internal server error"
        })
    }

}
}

let GetSingleRoomCategory = async(req,res)=>{
    let{roomcategoryid}=req.params;
     if(!roomcategoryid || !mongoose.Types.ObjectId.isValid(roomcategoryid)){
        return res.status(400).json({
            message:"invalid roomcategory id "
        })
    }


    try{
        let findRoomCategory = await RoomCategory.findById(roomcategoryid);
        if(!findRoomCategory){
            return res.status(404).json({
                message:"room category not found"
            })
        }

        return res.status(200).json({
            roomcategory:findRoomCategory
        })
    }catch(err){
         if(err){
        return res.status(500).json({
            message:err.message || "internal server error"
        })
    }
    }
}

let GetAllRoomCategory = async(req,res)=>{
    let{hotelid}=req.params;
     if(!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)){
        return res.status(400).json({
            message:"invalid hotel id "
        })
    }


    try{
        let findRoomCategory = await RoomCategory.find({hotel:hotelid}).sort({_id:-1});
        if(!findRoomCategory){
            return res.status(404).json({
                message:"room category not found"
            })
        }

        return res.status(200).json({
            roomcategory:findRoomCategory
        })
    }catch(err){
         if(err){
        return res.status(500).json({
            message:err.message || "internal server error"
        })
    }
    }
}


export {
    CreateRoomCategory,
    EditRoomCategory,
    GetAllRoomCategory,
    GetSingleRoomCategory
}