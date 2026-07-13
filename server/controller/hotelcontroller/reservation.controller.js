import mongoose from "mongoose";
import Reservation from "../../models/reservation.js";
import Guest from "../../models/guest.js";
import Room from "../../models/room.js";
import Hotel from "../../models/hotel.js";

let CreateReservation = async (req, res) => {
  let {
    guest,
    rooms,
    checkindate,
    checkoutdate,
    adults,
    children,
    status,
    method,
    onlineid,
    amountPaid,
    reservationfee,
    source,
    specialrequest,
    notes,
  } = req.body;

  console.log(req.body);
  let hotelid = req.params.hotelid;

  if (!Array.isArray(rooms)) {
    rooms = [rooms];
  }

  if (!mongoose.Types.ObjectId.isValid(hotelid)) {
    return res.status(400).json({
      message: "Invalid hotel id",
    });
  }

  let hotel = await Hotel.findById(hotelid);

  if (!hotel) {
    return res.status(400).json({
      message: "Hotel not found",
    });
  }
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

  let paymentStatEnum = Reservation.schema.path("payment.status").enumValues;
  let paymentMethodEnum = Reservation.schema.path("payment.method").enumValues;
  let sourceEnum = Reservation.schema.path("source").enumValues;
  let isValidNumber = (value) => {
    return Number.isInteger(Number(value)) && Number(value) >= 0;
  };
  if (
    !guest ||
    !mongoose.Types.ObjectId.isValid(guest) ||
    !rooms ||
    Array.isArray(rooms).length == 0 ||
    !checkindate ||
    !isValidDate(checkindate) ||
    !checkoutdate ||
    !isValidDate(checkoutdate) ||
    !status ||
    !paymentStatEnum.includes(status.trim()) ||
    !method ||
    !paymentMethodEnum.includes(method.trim()) ||
    !source ||
    !sourceEnum.includes(source.trim()) ||
    !isValidNumber(amountPaid) ||
    !isValidNumber(reservationfee)
  ) {
    return res.status(400).json({
      message: "Some Data fields are empty or invalid",
    });
  }

  if (method.trim() != "cash" && !onlineid?.trim()) {
    return res.status(400).json({
      message: "Online Id Is Required",
    });
  }
  //check if the guest is available or not

  let isGuest = await Guest.findById(guest);

  if (!isGuest) {
    return res.status(400).json({
      message: "Guest not found",
    });
  }
  let nooofNights =
    (new Date(checkoutdate) - new Date(checkindate)) / (1000 * 60 * 60 * 24);
  let totalPax = Number(adults) + Number(children);
  let isBeforeDate =
    new Date() - new Date(checkoutdate) <= 0 &&
    new Date() - new Date(checkindate) < 0;
  if (!isBeforeDate) {
    return res.status(400).json({
      message: "Invalid checkin or checkout date",
    });
  }

  if (nooofNights <= 0 || totalPax <= 0) {
    return res.status(400).json({
      message: "Invalid CID OR COD or Adults or Children",
    });
  }

  let conflictingRooms = await Reservation.find({
    hotel: hotelid,
    status: { $nin: ["cancelled", "checkedOut", "no_show"] },
    checkIn: { $lt: new Date(checkoutdate) },
    checkOut: { $gt: new Date(checkindate) },
  }).select("rooms");

  let OverlappingRoomsIds = conflictingRooms.flatMap((r) => r.rooms);

  if (
    rooms.some((roomId) =>
      OverlappingRoomsIds.some(
        (overlappingId) => overlappingId.toString() === roomId.toString(),
      ),
    )
  ) {
    return res.status(400).json({
      message: "Some Selected Rooms Are Unavailable",
    });
  }

  let Rooms = await Room.find({
    _id: { $in: rooms },
    isActive: true,
  }).populate("category");

  if (Rooms.length != rooms.length) {
    return res.status(400).json({
      message: "Not Every Rooms Are Found",
    });
  }

  //Payment Calculation;

  let totalPayment =
    Rooms.reduce((total, room) => {
      return total + Number(room.effectivePrice) || 0;
    }, 0) *
      nooofNights +
    Number(reservationfee);

  if (totalPayment <= 0) {
    return res.status(400).json({
      message: "Invalid Payments",
    });
  }

  let remainingAmount = totalPayment - Number(amountPaid);

  if (remainingAmount < 0) {
    return res.status(400).json({
      message: "Amount Paid is greater than the total amount",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const reservation = new Reservation({
      guest: isGuest._id,

      rooms: rooms,

      checkIn: new Date(checkindate),
      checkOut: new Date(checkoutdate),
      hotel: hotel._id,

      adults: adults,
      children: children,

      payment: {
        status: status,
        method: method,
        onlineid: onlineid,
        amountPaid: amountPaid,
        remainingAmount: remainingAmount,
        totalAmount: totalPayment,
      },

      source: source,

      specialRequests: specialrequest,

      notes: notes,
    });

    await reservation.save({ session });

    await session.commitTransaction();
    return res.status(201).json({
      message: "Reservation created successfully",
      reservation,
    });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);

    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  } finally {
    await session.endSession();
  }
};

let GetallReservations = async (req, res) => {
  let { hotelid } = req.params;

  if (!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)) {
    return res.status(400).json({
      message: "Invalid Hotel Id",
    });
  }
  try {
    let findExistingHotel = await Hotel.findById(hotelid);

    if (!findExistingHotel) {
      return res.status(400).json({
        message: "Hotel not found",
      });
    }

    let AllReservations = await Reservation.find({
      hotel: findExistingHotel._id,
    })
      .populate([
        {
          path: "guest",
          select: "email firstName lastName phone -_id ",
        },
        {
          path: "rooms",
          select: "roomNumber pax effectivePrice floor -_id",
          populate: {
            path: "category",
            select: "baseRate name -_id",
          },
        },
      ])
      .sort({ createdAt: -1 })
      .lean();

    for (const reservation of AllReservations) {
      delete reservation.id;
    }

    return res.status(200).json({
      reservations: AllReservations,
    });
  } catch (err) {
    console.log(err);
    if (err) {
      return res.status(500).json({
        message: err.message || "Internal server Error",
      });
    }
  }
};

let SetReservationStatus = async (req, res) => {
  try{
  let { hotelid } = req.params;
  let { status, reservationid } = req.body;
  if (!mongoose.Types.ObjectId.isValid(hotelid)) {
    return res.status(400).json({
      message: "Invalid hotel id",
    });
  }

  let findHotel = await Hotel.findById(hotelid);

  if (!findHotel) {
    return res.status(400).json({
      message: "Hotel not found",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(reservationid)) {
    return res.status(400).json({
      message: "Reservation Id Not Found",
    });
  }
  let statEnums = Reservation.schema.path("status").enumValues;
  if(!statEnums ){
    return res.status(400).json({
      message:"Stats not found"
    })

  }

  if(!statEnums.includes(status)){
    return res.status(400).json({
      message:"Invalid Status"
    })

  }

  let findReservation = await Reservation.findOne({
    _id: reservationid,
    hotel: hotelid,
    status: {
      $nin: ["cancelled", "no_show", "checked_in", "checked_out"],
    },
  });

  if (!findReservation) {
    return res.status(400).json({
      message: "Reservation not found",
    });
  }

  
  
  findReservation.status = status.trim().toLowerCase()
  await findReservation.save()

  return res.status(201).json({
    message:"Reservation Updated"
  })


  }catch(err){
    console.log(err)
    if(err){
      return res.status(500).json({
        message:err.message || err.data.message||"Internal server error"
      })
    }

  }
};

let GetIndividualReservation = async (req,res)=>{

  let {hotelid,reservationid}=req.query;

  if(!hotelid || !reservationid){
    return res.status(400).json({
      message:"hotel id or reservation id not found"
    })
  }

  if(!mongoose.Types.ObjectId.isValid(hotelid) || !mongoose.Types.ObjectId.isValid(reservationid)){
    return res.status(400).json({
      message:"Invalid resv id or hotel id"
    })
  }

  try{
    let findHotel = await Hotel.findById(hotelid);

    if(!findHotel){
      return res.status(400).json({
        message:"Hotel not found"
      })
    }

    let reservation = await Reservation.findOne({
      hotel:hotelid,
      _id:reservationid
    })
    .populate([
        {
          path: "guest",
          select: "email firstName lastName phone address -_id ",
        },
        {
          path: "rooms",
          select: "roomNumber pax effectivePrice floor -_id",
          populate: {
            path: "category",
            select: "baseRate name -_id",
          },
        },
      ])
      .lean()

    if(!reservation){
      return res.status(404).json({
        message:"Reservation not found"
      })
    }
    
      delete reservation.id;
    
    return res.status(200).json({
      reservation
    })

  }catch(err){
    if(err){
      return res.status(500).json({
        message:err.message || err.data.message || "Internal Server Error"
      })
    }
  }
}

export { CreateReservation, GetallReservations,SetReservationStatus,GetIndividualReservation };
