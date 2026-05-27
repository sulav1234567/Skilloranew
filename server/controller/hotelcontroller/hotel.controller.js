import { deletefile, uploadToS3} from "../../config/multer.config.js";
import {
  emailRegex,
  phoneRegex,
  websiteRegex,
} from "../../utlits/rejex.utlits.js";
import Hotel from "../../models/hotel.js";
import mongoose from "mongoose";
import HotelRole from "../../models/hotelroles.js";
import HotelInvite from "../../models/hotelinvitation.js";
import User from "../../models/user.js";





export const CreateHotel =async (req, res) => {
    let Data = req.body;
    let {
      organizationname,
      organizationcategory,
      starrating,
      organizationdiscription,
      country,
      province,
      area,
      street,
      zip,
      email,
      phonenumber,
      website,
      checkintime,
      checkouttime,
      cancellationpolicy,
      allowpet,
      allowsmoking,
      latitude,
      longitude,
      city,
      amenities,
    } = Data;

    let orgimage = req.file;
    let fileurl=nulll
    let fileKey = null

    if(orgimage){
      const UploadImage = await uploadToS3(orgimage,"hotels")
      fileurl = UploadImage.fileUrl;
      fileKey = UploadImage.fileKey
    }

    const deleteUploadedFile = () => {
      if (fileKey&&fileurl) {
        deletefile(fileKey);
      }
    };

    let boolcheck = (val) => {
      return val === true || val === false || val === "true" || val === "false";
    };
    const toBoolean = (val) => {
      if (val === true || val === "true") return true;
      if (val === false || val === "false") return false;
      return null;
    };

    if (
      Object.entries(Data).some(([Key, value]) => {
        return !value || value === "" || value == undefined || value == null;
      })
    ) {
      deleteUploadedFile();
      return res.status(400).json({
        message: "some required data fields are empty",
      });
    }

    if (!phoneRegex.test(phonenumber)) {
      deleteUploadedFile();
      return res.status(400).json({
        message: "incorrect phone number",
      });
    }

    if (!emailRegex.test(email)) {
      deleteUploadedFile();
      return res.status(400).json({
        message: "incorrect email format",
      });
    }

    if (!websiteRegex.test(website)) {
      deleteUploadedFile();
      return res.status(400).json({
        message: "incorrect web link format",
      });
    }

    if (!boolcheck(allowpet) || !boolcheck(allowsmoking)) {
      deleteUploadedFile();
      return res.status(400).json({
        message: "invalid boolean values",
      });
    }

    const parsedStarRating = Number(starrating);
    const parsedZip = Number(zip);
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (
      Number.isNaN(parsedStarRating) ||
      Number.isNaN(parsedZip) ||
      Number.isNaN(parsedLatitude) ||
      Number.isNaN(parsedLongitude)
    ) {
      deleteUploadedFile();

      return res.status(400).json({
        message: "starrating, zip, latitude or longitude is not a number",
      });
    }

    if (parsedStarRating < 1 || parsedStarRating > 5) {
      deleteUploadedFile();

      return res.status(400).json({
        message: "star rating must be between 1 and 5",
      });
    }

    let hoteldata = {
      name: organizationname,
      description: organizationdiscription,
      category: organizationcategory,
      starRating: parsedStarRating,
      address: {
        country,
        province,
        city,
        area,
        street,
        zipCode:zip,
      },
      location: {
        x: parsedLatitude,
        y: parsedLongitude,
      },
      contact: {
        phone: phonenumber,
        email,
        website,
      },
      image: {
        originalname: orgimage.originalname,
        mimetype: orgimage.mimetype,
        filename: orgimage.filename,
        size: orgimage.size,
        url:fileurl,
        key:fileKey
      },
      amenities,
      policies: {
        checkInTime: checkintime,
        checkOutTime: checkouttime,
        cancellationPolicy: cancellationpolicy,
        petAllowed: toBoolean(allowpet),
        smokingAllowed: toBoolean(allowsmoking),
      },
    };

    try{
       let hotel = new Hotel(hoteldata);
       await hotel.save();


       return res.status(201).json({
        message:"Hotel created successfully"
       })

    }catch(err){

      console.log(err)
        if(req.file && req.file.filename){
            deletefile(req.file.filename)
        }

        return res.status(500).json({
            message:"internal server error"
        })

    }
  }




 export const EditHotel = async (req, res) => {
  const hotelid = req.params.hotelid;

  if (!hotelid) {
    return res.status(400).json({
      message: "hotelid not found",
    });
  }

  let Data = req.body;

  let {
    organizationname,
    organizationcategory,
    starrating,
    organizationdiscription,
    country,
    province,
    area,
    street,
    zip,
    email,
    phonenumber,
    website,
    checkintime,
    checkouttime,
    cancellationpolicy,
    allowpet,
    allowsmoking,
    latitude,
    longitude,
    city,
    amenities,
  } = Data;

  let orgimage = req.file;
  let fileKey = null;
  let fileUrl = null

  if(orgimage){
      const UploadImage = await uploadToS3(orgimage,"hotels")
      fileUrl = UploadImage.fileUrl;
      fileKey = UploadImage.fileKey
    }





  const deleteUploadedFile = () => {
    if (fileKey) {
      deletefile(fileKey);
    }
  };

  let boolcheck = (val) => {
    return val === true || val === false || val === "true" || val === "false";
  };

  const toBoolean = (val) => {
    if (val === true || val === "true") return true;
    if (val === false || val === "false") return false;
    return null;
  };

  try {
    let hotel = await Hotel.findById(hotelid);

    if (!hotel) {
      deleteUploadedFile();

      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    if (
      Object.entries(Data).some(([Key, value]) => {
        return value === "" || value === undefined || value === null;
      })
    ) {
      deleteUploadedFile();

      return res.status(400).json({
        message: "some required data fields are empty",
      });
    }

    if (!phoneRegex.test(phonenumber)) {
      deleteUploadedFile();

      return res.status(400).json({
        message: "incorrect phone number",
      });
    }

    if (!emailRegex.test(email)) {
      deleteUploadedFile();

      return res.status(400).json({
        message: "incorrect email format",
      });
    }

    if (!websiteRegex.test(website)) {
      deleteUploadedFile();

      return res.status(400).json({
        message: "incorrect web link format",
      });
    }

    if (!boolcheck(allowpet) || !boolcheck(allowsmoking)) {
      deleteUploadedFile();

      return res.status(400).json({
        message: "invalid boolean values",
      });
    }

    const parsedStarRating = Number(starrating);
    const parsedZip = Number(zip);
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (
      Number.isNaN(parsedStarRating) ||
      Number.isNaN(parsedZip) ||
      Number.isNaN(parsedLatitude) ||
      Number.isNaN(parsedLongitude)
    ) {
      deleteUploadedFile();

      return res.status(400).json({
        message: "starrating, zip, latitude or longitude is not a number",
      });
    }

    if (parsedStarRating < 1 || parsedStarRating > 5) {
      deleteUploadedFile();

      return res.status(400).json({
        message: "star rating must be between 1 and 5",
      });
    }

    if (typeof amenities === "string") {
      try {
        amenities = JSON.parse(amenities);
      } catch (error) {
        amenities = amenities.split(",").map((item) => item.trim());
      }
    }

    let hoteldata = {
      name: organizationname,
      description: organizationdiscription,
      category: organizationcategory,
      starRating: parsedStarRating,

      address: {
        country,
        province,
        city,
        area,
        street,
        zipCode: parsedZip,
      },

      location: {
        x: parsedLatitude,
        y: parsedLongitude,
      },

      contact: {
        phone: phonenumber,
        email,
        website,
      },

      amenities,

      policies: {
        checkInTime: checkintime,
        checkOutTime: checkouttime,
        cancellationPolicy: cancellationpolicy,
        petAllowed: toBoolean(allowpet),
        smokingAllowed: toBoolean(allowsmoking),
      },
    };

    Object.assign(hotel, hoteldata);

    if (orgimage) {
      if (hotel.image && hotel.image.filename) {
        deletefile(hotel.image.key);
      }

      hotel.image = {
        originalname: orgimage.originalname,
        mimetype: orgimage.mimetype,
        filename: orgimage.filename,
        size: orgimage.size,
        key:fileKey,
        url:fileUrl
      };
    }

    await hotel.save();

    return res.status(200).json({
      message: "Hotel edited successfully",
      hotel,
    });
  } catch (err) {
    console.log(err);

    if (req.file && req.file.filename) {
      deletefile(req.file.filename);
    }

    return res.status(500).json({
      message: "internal server error",
    });
  }
};


export const DeleteHotel = async (req,res)=>{
  let hotelid = req.params.hotelid

  if(!hotelid){
    return res.status(400).json({
      message:"hotel id not found"
    })
  }


  try {

    let findhotel = await Hotel.findByIdAndDelete(hotelid);

    if(!findhotel){
       return res.status(400).json({
      message:"hotel not found"
    })

    }


    deletefile(findhotel.image.key);


    
   res.status(200).json({
    message:`${findhotel.name} deleted successfully`
   })
  }catch(err){
  if(err){
    res.status(200).json({
    message:err?.message || err?.data.message || "Internal Server Error"
   })
  }
  }



}

export const SendAllHotels =async (req, res) => {
  let user = req.user;

  if (!user) {
     return res.status(404).json({
      message: "User Not found",
    });
  }

  try {
    let hotels = await Hotel.aggregate([
  {
    $sort: { createdAt: -1 }
  },
  {
    $lookup: {
      from: "hotelroles",
      let: { hotelId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$hotel", "$$hotelId"] },
                { $eq: ["$role", "owner"] }
              ]
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "owner"
          }
        },
        {
          $unwind: {
            path: "$owner",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            role: 1,
            owner: {
              _id: "$owner._id",
              Fullname: "$owner.Fullname",
              email: "$owner.email",
              avatar: "$owner.avatar"
            }
          }
        }
      ],
      as: "ownerRole"
    }
  },
  {
    $unwind: {
      path: "$ownerRole",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $addFields: {
      owner: "$ownerRole.owner"
    }
  },
  {
    $project: {
      ownerRole: 0
    }
  }
]);

console.log(hotels)
    

    res.status(200).json({
      message: "Request successful",
      hotels: hotels,
    });
  } catch (err) {
    if (err) {
      return res.status(500).json({
        message: err.message
      })
    }
  }
}


export const SendRequestedHotel = async (req,res)=>{
  let hotelid = req.params.hotelid;
 

  if(!mongoose.Types.ObjectId.isValid(hotelid)){
    return res.status(400).json({
      message:"invalid Hotel id "
    })

  }

  try{
    let hotel = await Hotel.findById(hotelid);
    if(!hotel){
      return res.status(400).json({
        message:"hotel not found"
      })
    }

  let ownerRole = await HotelRole.findOne({
  hotel: hotel._id,
  role: "owner",
})
  .populate({
    path: "user",
    select: "Fullname email avatar -_id",
  })
  .lean();

let findOwner = null;

if (ownerRole) {
  findOwner = {
    ...ownerRole.user,
    status: "accepted",
    model:"HotelRole",
    _id:ownerRole._id
  };
}

if (!findOwner) {
  const findInvitation = await HotelInvite.findOne({
    hotel: hotel._id,
    role: "owner",
    status: { $in: ["pending"] },
  })
    .sort({ createdAt: -1 })
    .lean();

  if (findInvitation) {
    const findUser = await User.findOne({
      email: findInvitation.email,
    })
      .select("Fullname email avatar -_id")
      .lean();

    if (findUser) {
      findOwner = {
        ...findUser,
        status: findInvitation.status,
        model:"HotelInvite",
        _id:findInvitation._id
      };
    }
  }
}

    res.status(201).json({
      hotel:hotel,
      owner:findOwner
    })

  }catch(err){
 res.status(400).json({
  message:"Error Finding The Hotel"
 })
  }

}


