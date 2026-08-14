import Guest from "../../models/guest.js";
import User from "../../models/user.js";
import Hotel from "../../models/hotel.js";
import mongoose from "mongoose";
import { emailRegex, phoneRegex } from "../../utlits/rejex.utlits.js";

let SearchGuest = async (req, res) => {
  let { firstName, lastName, phonenumber, email } = req.body;
  let hotelId = req.params.hotelid;

  console.log(req.body,hotelId)

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return res.status(400).json({
      message: "Hotel id is not valid.",
    });
  }

  firstName = firstName.trim();
  lastName = lastName.trim();
  phonenumber = phonenumber.trim();
  email = email.trim().toLowerCase();

  if (!firstName || !lastName || !phonenumber || !email) {
    return res.status(400).json({
      message: "Some values are missing",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: {
        field: "email",
        text: "email is not valid",
      },
    });
  }

  if (!phoneRegex.test(phonenumber)) {
    return res.status(400).json({
      message: {
        field: "phonenumber",
        text: "phonenumber is not valid",
      },
    });
  }

  try {
    let GuestModel = await Guest.aggregate([
      {
    $match: {
      hotel:new mongoose.Types.ObjectId(hotelId),
      $or: [
        { email: email },
        { phone: phonenumber },
      ],
    },
  },

      {
        $lookup:{
          from:"files",
          let:{
            guestID:"$_id",
            hotelID:"$hotel"
          },
          pipeline:[
            {
              $match:{
                $expr:{
                  $and:[
                    {$eq:["$linkedDocumentid","$$guestID"]},
                    {$eq:["$linkedModel","Guest"]},
                    {$eq:["$hotel","$$hotelID"]}
                  ]
                }
              }
            },{
              $project:{
                key:0,
                Url:0,
                linkedDocumentid:0,
                linkedModel:0
              }
            }

          ],
          as:"documents"
        }
      }
    ]);
    console.log(GuestModel)

   
    if (GuestModel.length==0) {
      return res.status(404).json({
        message: "Guest not found",
      });
    }

    return res.status(200).json({
      guest: GuestModel[0],
    });
  } catch (err) {
    console.log(err)
    if (err) {
      return res.status(500).json({
        message: err.message || "internal server error",
      });
    }
  }
};

let CreateGuest = async (req, res) => {
  let {
    firstName,
    lastName,
    phonenumber,
    email,
    address,
    nationality,
    idType,
    idNumber,
    guestType,
    note,
  } = req.body;

  let hotelId = req.params.hotelid;
  let user = req.user;

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return res.status(400).json({
      message: "Hotel id is not valid.",
    });
  }

  firstName = firstName.trim();
  lastName = lastName.trim();
  phonenumber = phonenumber.trim();
  email = email.trim().toLowerCase();
  address = address?.trim() || "";
  nationality = nationality?.trim() || "";
  idType = idType?.trim();
  idNumber = idNumber?.trim();
  guestType = guestType?.trim();

  let HotelModel = await Hotel.findById(hotelId);

  if (!HotelModel) {
    return res.status(400).json({
      message: "Hotel not found",
    });
  }

  if (
    !firstName ||
    !lastName ||
    !phonenumber ||
    !email ||
    !address ||
    !nationality ||
    !idType ||
    !idNumber ||
    !guestType
  ) {
    return res.status(400).json({
      message: "Some values are missing",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: {
        field: "email",
        text: "email is not valid",
      },
    });
  }

  if (!phoneRegex.test(phonenumber)) {
    return res.status(400).json({
      message: {
        field: "phonenumber",
        text: "phonenumber is not valid",
      },
    });
  }

  /* enum values check */

  let idTypeEnum = Guest.schema.path("idType").enumValues;
  let guestTypeEnum = Guest.schema.path("guestType").enumValues;

  if (idType && !idTypeEnum.includes(idType)) {
    return res.status(400).json({
      message: {
        field: "idType",
        text: "Id type is not valid",
      },
    });
  }

  if (guestType && !guestTypeEnum.includes(guestType)) {
    return res.status(400).json({
      message: {
        field: "guestType",
        text: "Guest type is not valid",
      },
    });
  }

  try {
    let GuestModel = await Guest.findOne({
      hotel: hotelId,
      $or: [
        { email: email },
        { phone: phonenumber },
        { idType: idType, idNumber: idNumber },
      ],
    });
    if (GuestModel) {
      return res.status(409).json({
        message: "Guest with this info already exists",
        guest: GuestModel,
      });
    }

    let newGuestModel = new Guest({
      hotel: hotelId,
      firstName: firstName,
      lastName: lastName,
      phone: phonenumber,
      email: email,
      address,
      nationality,
      idType,
      idNumber,
      guestType,
      notes: note,
      createdBy: user._id,
    });

    await newGuestModel.save();

    return res.status(201).json({
      message: "Guest Created Successfully",
      guest: newGuestModel,
    });
  } catch (err) {
    if (err) {
      return res.status(500).json({
        message: err.message || "internal server error",
      });
    }
  }
};

export { CreateGuest, SearchGuest };
