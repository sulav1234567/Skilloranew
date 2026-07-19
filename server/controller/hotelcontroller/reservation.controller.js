import mongoose from "mongoose";
import Reservation from "../../models/reservation.js";
import Guest from "../../models/guest.js";
import Room from "../../models/room.js";
import Hotel from "../../models/hotel.js";
import {
  sendCustomMail,
  sendReservationConfirmationMail,
  sendReservationStatusUpdateMail,
} from "../mail.controller.js";
import Folio from "../../models/folio.js";
import PaymentModel from "../../models/payment.js";

let CreateReservation = async (req, res) => {
  let {
    guest,
    rooms,
    checkindate,
    checkoutdate,
    adults,
    children,
    reservationfee,
    source,
    specialrequest,
    notes,
  } = req.body;

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
    !isValidNumber(reservationfee)
  ) {
    return res.status(400).json({
      message: "Some Data fields are empty or invalid",
    });
  }

  //check if the guest is available or not

  let isGuest = await Guest.findById(guest);

  if (!isGuest) {
    return res.status(400).json({
      message: "Guest not found",
    });
  }

  //date validation
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
    }, 0) * nooofNights;

  if (totalPayment <= 0) {
    return res.status(400).json({
      message: "Invalid Payments",
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
      source: source,
      specialRequests: specialrequest,
      notes: notes,
    });

    await reservation.save({ session });

    //creating the folio of the user
    const folio = new Folio({
      hotel: hotelid,
      guest: isGuest._id,
      status: "open",
      linkedModelId: reservation._id,
      linkedModel: "Reservation",
    });

    await folio.save({ session });

    //payment model for this folio
    const payments = await PaymentModel.insertMany(
      [
        {
          paymentName: "Reservation Fee",
          folio: folio._id,
          amountToPay: Number(reservationfee),
          paymentFor: `Reservation fee for ${reservation.confirmationCode}`,
          paymentItem: [reservation._id],
          payableModel: "Reservation",
          paymentType: "receive",
          createdBy: req.user._id,
        },

        {
          paymentName: "Room Cost",
          folio: folio._id,
          amountToPay: totalPayment,
          paymentFor: `Room charges for ${Rooms.map((room) => room.roomNumber).join(", ")} for ${nooofNights} nights`,
          paymentItem: Rooms.map((room) => room._id),
          payableModel: "Room",
          paymentType: "receive",
          createdBy: req.user._id,
        },
      ],
      { session },
    );

    //adding the total payments amount in the folio

    let totalAmount = payments[0].amountToPay + payments[1].amountToPay;
    folio.totalAmount = totalAmount;
    await folio.save({ session });

    await reservation.populate([
      {
        path: "guest",
      },
      {
        path: "hotel",
      },
      {
        path: "rooms",
        populate: {
          path: "category",
        },
      },
    ]);

    /*reservation mail sending */

    const reservationEmailResult = await sendReservationConfirmationMail({
      email: reservation.guest.email,

      guestName: `${reservation.guest.firstName} ${reservation.guest.lastName}`,

      hotelName: reservation.hotel.name,

      confirmationCode: reservation.confirmationCode,

      status: reservation.status,

      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,

      estimatedCheckInTime: reservation.estimatedCheckInTime,

      adults: reservation.adults,
      children: reservation.children,

      rooms: reservation.rooms.map((room) => ({
        roomNumber: room.roomNumber,

        floor: room.floor,

        pax: room.pax,

        effectivePrice: room.effectivePrice,

        categoryName: room.category?.name,
      })),

      paymentStatus: "Pending",

      paymentMethod: "--",

      transactionId: "--",

      reservationFee: Number(reservationfee),

      amountPaid: folio.amountPaid,

      remainingAmount: folio.totalAmount - folio.amountPaid,

      totalAmount: folio.totalAmount,

      source: reservation.source,

      specialRequests: reservation.specialRequests,

      hotelAddress: reservation.hotel.address.area,

      hotelPhone: reservation.hotel.contact.phone,

      hotelEmail: reservation.hotel.contact.email,

      reservationUrl: `${process.env.FRONTEND_URL}/reservation/${reservation.confirmationCode}`,

      cancellationReason: reservation.cancellation?.reason,

      refundAmount: reservation.cancellation?.refundAmount,

      currency: "Rs.",

      timeZone: "Asia/Kathmandu",
    });

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

    // let AllReservations = await Reservation.find({

    //   hotel: findExistingHotel._id,
    // })
    //   .populate([
    //     {
    //       path: "guest",
    //       select: "email firstName lastName phone -_id ",
    //     },
    //     {
    //       path: "rooms",
    //       select: "roomNumber pax effectivePrice priceOverride floor -_id",
    //       populate: {
    //         path: "category",
    //         select: "baseRate name -_id",
    //       },
    //     },
    //   ])
    //   .sort({ createdAt: -1 });

    let hotelObjectId = new mongoose.Types.ObjectId(hotelid);

    let AllReservations = await Reservation.aggregate([
      {
        $match: { hotel: hotelObjectId },
      },
      {
        $set: {
          guestId: "$guest",
        },
      },

      {
        $lookup: {
          from: "guests",
          let: {
            guestId: "$guest",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$guestId"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                firstName: 1,
                lastName: 1,
                email: 1,
                phone: 1,
              },
            },
          ],
          as: "guest",
        },
      },
      {
        $unwind: {
          path: "$guest",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "rooms",
          let: {
            roomid: {
              $ifNull: ["$rooms", []],
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$roomid"],
                },
              },
            },
            {
              $lookup: {
                from: "roomcategories",
                let: { categoryid: "$category" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$categoryid"],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      baseRate: 1,
                      name: 1,
                    },
                  },
                ],

                as: "category",
              },
            },
            {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $set: {
                effectivePrice: {
                  $ifNull: ["$priceOverride", "$category.baseRate"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                priceOverride: 1,
                effectivePrice: 1,
                roomNumber: 1,
                category: 1,
                pax: 1,
                floor: 1,
              },
            },
          ],
          as: "rooms",
        },
      },
      {
        $lookup: {
          from: "folios",
          let: {
            guestId: "$guestId",
            hotelId: "$hotel",
            reservationId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$guest", "$$guestId"],
                    },
                    {
                      $eq: ["$hotel", "$$hotelId"],
                    },
                    {
                      $eq: ["$linkedModelId", "$$reservationId"],
                    },
                    {
                      $eq: ["$linkedModel", "Reservation"],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalAmount: 1,
              },
            },
          ],
          as: "payment",
        },
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unset: "guestId",
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    console.log(AllReservations);

    // let reservations = AllReservations.map((resv) => {
    //   let plaindocument = resv.toObject({ virtuals: true });
    //   delete plaindocument.id;
    //   return plaindocument;
    // });

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
  try {
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
    if (!statEnums) {
      return res.status(400).json({
        message: "Stats not found",
      });
    }

    if (!statEnums.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status",
      });
    }

    

    let findReservation = await Reservation.findOne({
      _id: reservationid,
      hotel: hotelid,
      status: {
        $nin: ["cancelled", "no_show", "checked_in", "checked_out"],
      },
    }).populate([
      {
        path: "guest",
      },
      {
        path: "hotel",
      },
    ]);

    if (!findReservation) {
      return res.status(400).json({
        message: "Reservation not found",
      });
    }
    //comparing the dates
    let oldstatus = findReservation.status;

    findReservation.status = status.trim().toLowerCase();
    await findReservation.save();

    let emailData = await sendReservationStatusUpdateMail({
      email: findReservation.guest.email,
      guestName: `${findReservation.guest.firstName} ${findReservation.guest.lastName}`,
      hotelName: findReservation.hotel.name,
      confirmationCode: findReservation.confirmationCode,
      oldStatus: oldstatus,
      newStatus: findReservation.status,
    });

    return res.status(201).json({
      message: "Reservation Updated",
    });
  } catch (err) {
    console.log(err);
    if (err) {
      return res.status(500).json({
        message: err.message || err.data.message || "Internal server error",
      });
    }
  }
};

let GetIndividualReservation = async (req, res) => {
  let { hotelid, reservationid } = req.query;

  if (!hotelid || !reservationid) {
    return res.status(400).json({
      message: "hotel id or reservation id not found",
    });
  }

  if (
    !mongoose.Types.ObjectId.isValid(hotelid) ||
    !mongoose.Types.ObjectId.isValid(reservationid)
  ) {
    return res.status(400).json({
      message: "Invalid resv id or hotel id",
    });
  }

  try {
    let findHotel = await Hotel.findById(hotelid);

    if (!findHotel) {
      return res.status(400).json({
        message: "Hotel not found",
      });
    }

    // let reservation = await Reservation.findOne({
    //   hotel: hotelid,
    //   _id: reservationid,
    // }).populate([
    //   {
    //     path: "guest",
    //     select: "email firstName lastName phone address -_id ",
    //   },
    //   {
    //     path: "rooms",
    //     select: "roomNumber pax effectivePrice priceOverride floor -_id",
    //     populate: {
    //       path: "category",
    //       select: "baseRate name -_id",
    //     },
    //   },
    // ]);
    let reservationId = new mongoose.Types.ObjectId(reservationid);

    let reservation = await Reservation.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: ["$_id", reservationId],
              },
              {
                $eq: ["$hotel", findHotel._id],
              },
            ],
          },
        },
      },
      {
        $set: {
          guestId: "$guest",
        },
      },
      {
        $lookup: {
          from: "guests",
          let: {
            guestid: "$guest",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$guestid"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                phone: 1,
                address:1
              },
            },
          ],
          as: "guest",
        },
      },
      {
        $unwind: {
          path: "$guest",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "rooms",
          let: {
            roomIds: {
              $ifNull: ["$rooms", []],
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$roomIds"],
                },
              },
            },
            {
              $lookup: {
                from: "roomcategories",
                let: {
                  categoryId: "$category",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$categoryId"],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      name: 1,
                      baseRate: 1,
                    },
                  },
                ],
                as: "category",
              },
            },
            {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $set: {
                effectivePrice: {
                  $ifNull: ["$priceOverride", "$category.baseRate"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                roomNumber: 1,
                category: 1,
                pax: 1,
                floor: 1,
                effectivePrice: 1,
              },
            },
          ],
          as: "rooms",
        },
      },
      {
        $lookup: {
          from: "folios",
          let: {
            reservationId: "$_id",
            hotelId: "$hotel",
            guestId: "$guestId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$guest", "$$guestId"],
                    },
                    {
                      $eq: ["$hotel", "$$hotelId"],
                    },
                    {
                      $eq: ["$linkedModelId", "$$reservationId"],
                    },
                    {
                      $eq: ["$linkedModel", "Reservation"],
                    },
                    
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "transactions",
                let: {
                  folioId: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$folioid", "$$folioId"],
                      },
                    },
                  },
                  {
                    $project:{
                      _id:0,
                      amount:1,
                      modeOfPayment:1,
                      paymentModeId:1,
                      transactionId:1,
                      status:1,
                      remarks:1,
                      createdAt:1
                    }
                  }
                ],
                as: "transactions",
              },
            },
            {
              $project: {
                totalAmount: 1,
                status: 1,
                amountPaid: 1,
                transactions: 1,
              },
            },
          ],
          as: "openFolio",
        },
      },
      {
        $unwind: {
          path: "$openFolio",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "payments",
          let: {
            folioId: "$openFolio._id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$folio", "$$folioId"],
                },
              },
            },
            {
              $project: {
                paymentName: 1,
                amountToPay: 1,
                paidAmount: 1,
                paymentFor: 1,
                paymentType: 1,
                payableModel: 1,
              },
            },
          ],
          as: "payments",
        },
      },
      {
        $unset: "guestId",
      },
    ]);

    if (reservation.length === 0) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    return res.status(200).json({
      reservation: reservation[0],
    });
  } catch (err) {
    if (err) {
      return res.status(500).json({
        message: err.message || err.data.message || "Internal Server Error",
      });
    }
  }
};

export {
  CreateReservation,
  GetallReservations,
  SetReservationStatus,
  GetIndividualReservation,
};
