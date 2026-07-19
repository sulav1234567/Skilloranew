import mongoose from "mongoose";
import Hotel from "../../models/hotel.js";
import Reservation from "../../models/reservation.js";

export const GetAllReservationEligibleForCheckin = async (req, res) => {
  let { hotelid } = req.params;

  try {
    if (!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)) {
      return res.status(400).json({
        message: "Hotel id is invalid",
      });
    }

    let hotelDocument = await Hotel.findById(hotelid);
    if (!hotelDocument) {
      return res.status(400).json({
        message: "Hotel not found",
      });
    }
    let AllReservations = await Reservation.aggregate([
      {
        $match: {
          hotel: hotelDocument._id,
          status: "confirmed",
        },
      },
      {
        $set: {
          guestID: "$guest",
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
                email: 1,
                phone: 1,
                firstName: 1,
                lastName: 1,
                address: 1,
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
                    },
                  },
                ],
                as: "category",
              },
            },
            {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $project: {
                _id: 0,
                roomNumber: 1,
                category: 1,
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
            guestId: "$guestID",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                     $eq:["$hotel",hotelDocument._id]
                    },
                    {
                        $eq:["$guest","$$guestId"]
                      
                    },
                    {
                        $eq:["$linkedModelId","$$reservationId"]
                    },
                    {
                        $eq:["$linkedModel","Reservation"]
                    },
                  ],
                },
              },
            },
            {
              $set: {
                dueAmount: { $subtract: ["$totalAmount", "$amountPaid"] },
              },
            },
            {
              $project: {
                _id: 0,
                dueAmount: 1,
              },
            },
          ],
          as: "payment",
        },
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unset: "guestID",
      },
    ]);

    return res.status(200).json({
      eligibleReservations: AllReservations,
    });
  } catch (err) {
    console.log(err);
    if (err) {
      return res.status(500).json({
        message: err,
      });
    }
  }
};
