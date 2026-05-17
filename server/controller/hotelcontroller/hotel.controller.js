import { deletefile} from "../../config/multer.config.js";
import {
  emailRegex,
  phoneRegex,
  websiteRegex,
} from "../../utlits/rejex.utlits.js";
import Hotel from "../../models/hotel.js";




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

    const deleteUploadedFile = () => {
      if (orgimage && orgimage.filename) {
        deletefile(orgimage.filename);
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

  const deleteUploadedFile = () => {
    if (orgimage && orgimage.filename) {
      deletefile(orgimage.filename);
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
        deletefile(hotel.image.filename);
      }

      hotel.image = {
        originalname: orgimage.originalname,
        mimetype: orgimage.mimetype,
        filename: orgimage.filename,
        size: orgimage.size,
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