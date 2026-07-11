import mongoose from "mongoose";
import Hotel from "../../models/hotel.js";
import HotelRole from "../../models/hotelroles.js";
import RoomCategory from "../../models/roomCategory.js";
import Room from "../../models/room.js";
import Reservation from "../../models/reservation.js";

let CreateRoom = async (req, res) => {
  try {
    let user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "unauthorized",
      });
    }

    let { hotelid } = req.params;

    if (!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)) {
      return res.status(400).json({
        message: "Invalid hotel id",
      });
    }

    let hotelObject = await Hotel.findById(hotelid);
    if (!hotelObject) {
      return res.status(400).json({
        message: "Hotel not found",
      });
    }
    let isOwner = await HotelRole.findOne({
      hotel: hotelObject._id,
      user: user._id,
      role: "owner",
    });

    if (!isOwner || !user.role === "admin") {
      return res.status(400).json({
        message: "unauthorized to perform this action",
      });
    }

    //data validation

    let amenEnum = RoomAmenity;
    let RoomStatEnum = Room.schema.path("status").enumValues;
    const isBoolean = (val) => {
      if (val === null || val === undefined) {
        return false;
      }

      if (typeof val === "boolean") {
        return true;
      }

      if (typeof val === "string") {
        const value = val.trim().toLowerCase();
        return value === "true" || value === "false";
      }

      return false;
    };

    const toBoolean = (val) => {
      if (typeof val === "boolean") {
        return val;
      }

      if (typeof val === "string") {
        return val.trim().toLowerCase() === "true";
      }

      return false;
    };
    let {
      roomCategory,
      roomNumber,
      floor,
      status,
      isActive,
      priceOverride,
      pax,
      description,
      roomSize,
    } = req.body;

    if (
      !roomCategory ||
      !mongoose.Types.ObjectId.isValid(roomCategory) ||
      !roomNumber ||
      !Number.isInteger(Number(roomNumber)) ||
      roomNumber < 0 ||
      !floor ||
      !Number.isInteger(Number(floor)) ||
      !status ||
      !RoomStatEnum.includes(status) ||
      !isBoolean(isActive)
    ) {
      return res.status(400).json({
        message: "Some Invalid Values",
      });
    }

    let roomcategory = await RoomCategory.findOne({
      _id: roomCategory,
      hotel: hotelid,
    });

    if (!roomcategory)
      return res.status(400).json({
        message: "roomCategory not found",
      });

    let redundantRoomNumber = await Room.findOne({
      hotel: hotelid,
      roomNumber: roomNumber,
    });
    if (redundantRoomNumber) {
      return res.status(400).json({
        message: "room with this room number already exists",
      });
    }

    console.log(roomCategory, roomNumber, roomSize, pax);
    const paxValue = pax === "" || pax == null ? undefined : Number(pax);

    let PAX =
      paxValue !== undefined &&
      Number.isInteger(paxValue) &&
      paxValue > 0 &&
      paxValue <= roomcategory.maxPax
        ? paxValue
        : roomcategory.maxPax;

    let priceoverride =
      !priceOverride ||
      !Number.isInteger(Number(priceOverride)) ||
      Number(priceOverride) <= 0
        ? null
        : Number(priceOverride);

    let Description = !description ? "N/A" : description;
    let RoomSize =
      !roomSize || !Number.isFinite(Number(roomSize)) || Number(roomSize) <= 0
        ? null
        : Number(roomSize);

    let createRoom = new Room({
      hotel: hotelid,
      description: Description,
      roomSize: RoomSize,
      category: roomcategory._id,
      roomNumber: Number(roomNumber),
      floor: Number(floor),
      status,
      pax: PAX,
      priceOverride: priceOverride,
      isActive: toBoolean(isActive),
    });

    await createRoom.save();
    return res.status(201).json({
      message: "Room Created Successfully",
    });
  } catch (err) {
    if (err) {
      return res.status(500).json({
        message: err.message || "Internal server Error",
      });
    }
  }
};
let EditRoom = async (req, res) => {
  try {
    let { hotelid } = req.body;
    let user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "unauthorized",
      });
    }

    let { roomid } = req.params;

    if (!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)) {
      return res.status(400).json({
        message: "Invalid hotel id",
      });
    }

    let hotelObject = await Hotel.findById(hotelid);
    if (!hotelObject) {
      return res.status(400).json({
        message: "Hotel not found",
      });
    }
    let isOwner = await HotelRole.findOne({
      hotel: hotelObject._id,
      user: user._id,
      role: "owner",
    });

    if (!isOwner || !user.role === "admin") {
      return res.status(400).json({
        message: "unauthorized to perform this action",
      });
    }

    if (!roomid || !mongoose.Types.ObjectId.isValid(roomid)) {
      return res.status(400).json({
        message: "Invalid room id",
      });
    }
    //data validation

    let RoomStatEnum = Room.schema.path("status").enumValues;
    const isBoolean = (val) => {
      if (val === null || val === undefined) {
        return false;
      }

      if (typeof val === "boolean") {
        return true;
      }

      if (typeof val === "string") {
        const value = val.trim().toLowerCase();
        return value === "true" || value === "false";
      }

      return false;
    };

    const toBoolean = (val) => {
      if (typeof val === "boolean") {
        return val;
      }

      if (typeof val === "string") {
        return val.trim().toLowerCase() === "true";
      }

      return false;
    };
    let {
      roomCategory,
      roomNumber,
      floor,
      status,
      isActive,
      priceOverride,
      pax,
      description,
      roomSize,
    } = req.body;

    if (
      !roomCategory ||
      !mongoose.Types.ObjectId.isValid(roomCategory) ||
      !roomNumber ||
      !Number.isInteger(Number(roomNumber)) ||
      roomNumber < 0 ||
      !floor ||
      !Number.isInteger(Number(floor)) ||
      !status ||
      !RoomStatEnum.includes(status) ||
      !isBoolean(isActive)
    ) {
      return res.status(400).json({
        message: "Some Invalid Values",
      });
    }

    let roomcategory = await RoomCategory.findOne({
      _id: roomCategory,
      hotel: hotelid,
    });

    if (!roomcategory)
      return res.status(400).json({
        message: "roomCategory not found",
      });

    let redundantRoomNumber = await Room.findOne({
      hotel: hotelid,
      roomNumber: roomNumber,
      _id: { $ne: roomid },
    });
    if (redundantRoomNumber) {
      return res.status(400).json({
        message: "room with this room number already exists",
      });
    }

    let currentRoom = await Room.findById(roomid);

    if (!currentRoom) {
      return res.status(400).json({
        message: "room does not exists",
      });
    }
    const paxValue = pax === "" || pax == null ? undefined : Number(pax);

    let PAX =
      paxValue !== undefined &&
      Number.isInteger(paxValue) &&
      paxValue > 0 &&
      paxValue <= roomcategory.maxPax
        ? paxValue
        : roomcategory.maxPax;

    let priceoverride =
      !priceOverride ||
      !Number.isInteger(Number(priceOverride)) ||
      Number(priceOverride) <= 0
        ? null
        : Number(priceOverride);

    let Description = !description ? "N/A" : description;
    let RoomSize =
      !roomSize || !Number.isFinite(Number(roomSize)) || Number(roomSize) <= 0
        ? null
        : Number(roomSize);

    currentRoom.hotel = hotelid;
    currentRoom.description = Description;
    currentRoom.roomSize = RoomSize;
    currentRoom.category = roomcategory._id;
    currentRoom.roomNumber = Number(roomNumber);
    currentRoom.floor = Number(floor);
    currentRoom.status = status;
    currentRoom.pax = PAX;
    currentRoom.priceOverride = priceoverride;
    currentRoom.isActive = toBoolean(isActive);

    await currentRoom.save();
    return res.status(200).json({
      message: "Room updated Successfully",
    });
  } catch (err) {
    if (err) {
      return res.status(500).json({
        message: err.message || "Internal server Error",
      });
    }
  }
};
let GetAllRooms = async (req, res) => {
  try {
    let user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "unauthorized",
      });
    }

    let { hotelid } = req.params;

    if (!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)) {
      return res.status(400).json({
        message: "Invalid hotel id",
      });
    }

    let hotelObject = await Hotel.findById(hotelid);

    if (!hotelObject) {
      return res.status(400).json({
        message: "Hotel not found",
      });
    }

    let isOwner = await HotelRole.findOne({
      hotel: hotelObject._id,
      user: user._id,
      role: "owner",
    });

    if (!isOwner || !user.role === "admin") {
      return res.status(400).json({
        message: "unauthorized to perform this action",
      });
    }

    //main logic

    let Rooms = await Room.find({ hotel: hotelObject._id }).populate({
      path: "category",
      select: "baseRate",
    });

    return res.status(200).json({
      rooms: Rooms,
    });
  } catch (err) {
    if (err) {
      return res.status(500).json({
        message: err.message || "Internal server Error",
      });
    }
  }
};

let SearchRoomsForReservation = async (req, res) => {
  const isValidDate = (value) => {
    if (!value) return false;

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };
  const isValidTime = (value) => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
  };

  let { checkindate, estimatedcheckintime, checkoutdate, adults, children } =
    req.body;
  let { hotelid } = req.params;


  try{

  if (!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)) {
    return res.status(400).json({
      message: "Invalid Hotel Id",
    });
  }

  let existingHotel = await Hotel.findById(hotelid);
  if (!existingHotel) {
    return res.status(400).json({
      message: "Hotel Not Available",
    });
  }
  console.log(req.body)

  if (
    !checkindate ||
    !isValidDate(checkindate) ||
    !estimatedcheckintime ||
    !isValidTime(estimatedcheckintime) ||
    adults == null ||
    adults === undefined ||
    !Number.isInteger(Number(adults)) ||
    Number(adults) < 0 ||
    children == null ||
    children === undefined ||
    !Number.isInteger(Number(children)) ||
    Number(children) < 0
  ) {
    return res.status(400).json({
      message: "Some Invalid Data",
    });
  }

  let nooofNights = new Date(checkoutdate) - new Date(checkindate);
  let totalPax = Number(adults) + Number(children);

  if (nooofNights <= 0 || totalPax <= 0) {
    return res.status(400).json({
      message: "Invalid CID OR COD or Adults or Children",
    });
  }

  let conflictingRooms = await Reservation.find({
    hotel:hotelid,
    status: { $nin: ["cancelled", "checkedOut","no_show"] },
    checkIn: { $lt: new Date(checkoutdate) },
    checkOut: { $gt: new Date(checkindate) },
  }).select("rooms");

  let OverlappingRoomsIds = conflictingRooms.flatMap((r) => r.rooms);

  let AvailableRooms = await Room.find({
    _id: { $nin: OverlappingRoomsIds },
    hotel: existingHotel._id,
    isActive: true,
    status: { $nin: ["dirty", "cleaning", "maintenance", "blocked"] },
  }).populate("category");

  return res.status(200).json({
    availableRooms:AvailableRooms
  })

}
catch(err){

    if(err){
        return res.status(500).json({
            message:err.message || err.data.message || "Internal server error"
        })
    }

}


};

export { CreateRoom, GetAllRooms, EditRoom, SearchRoomsForReservation };
