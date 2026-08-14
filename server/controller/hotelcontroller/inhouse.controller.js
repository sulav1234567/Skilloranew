import mongoose from "mongoose";
import CheckIn from "../../models/checkin.js";
import Hotel from "../../models/hotel.js";

export const GetAllInhouseCheckins = async (req, res) => {
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
    let AllCheckIn = await CheckIn.aggregate([
      {
        $match: {
          hotel: hotelDocument._id,
          status: "pending",
        },
      },
      {
        $set: {
          guestID: "$primaryGuest",
        },
      },
      {
        $lookup: {
          from: "guests",
          let: {
            guestId: "$guestID",
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
          as: "primaryGuest",
        },
      },
      {
        $unwind: {
          path: "$primaryGuest",
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
            checkinId: "$_id",
            guestId: "$guestID",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$hotel", hotelDocument._id],
                    },
                    {
                      $eq: ["$guest", "$$guestId"],
                    },
                    {
                      $eq: ["$linkedModelId", "$$checkinId"],
                    },
                    {
                      $eq: ["$linkedModel", "CheckIn"],
                    },
                    {
                      $eq: ["$status", "open"],
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
      inhousecheckins: AllCheckIn,
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
export let GetIndividualCheckIn = async (req, res) => {
  let { hotelid, checkincode } = req.params;

  console.log(hotelid, checkincode);

  if (!hotelid || !checkincode) {
    return res.status(400).json({
      message: "hotel id or reservation id not found",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(hotelid)) {
    return res.status(400).json({
      message: "Invalid resv id or hotel id",
    });
  }

  let splitCheckinCode = checkincode.split("-");
  if (splitCheckinCode[0] != "CINX" && splitCheckinCode[1].length != 6) {
    return res.status(400).json({
      message: "Invalid Checkin Code",
    });
  }

  try {
    let findHotel = await Hotel.findById(hotelid);

    if (!findHotel) {
      return res.status(400).json({
        message: "Hotel not found",
      });
    }

    let Checkin = await CheckIn.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: ["$checkinCode", checkincode.trim()],
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
          primaryGuestId: "$primaryGuest",
        },
      },
      {
        $lookup: {
          from: "guests",
          let: {
            guestid: "$primaryGuestId",
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
              $lookup: {
                from: "files",
                let: {
                  guestID: "$_id",
                  hotelID: "$hotel",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$linkedDocumentid", "$$guestID"] },
                          { $eq: ["$linkedModel", "Guest"] },
                          { $eq: ["$hotel", "$$hotelID"] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      key: 0,
                      Url: 0,
                      linkedDocumentid: 0,
                      linkedModel: 0,
                    },
                  },
                ],
                as: "documents",
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                phone: 1,
                address: 1,
                documents: 1,
              },
            },
          ],
          as: "primaryGuest",
        },
      },
      {
        $unwind: {
          path: "$primaryGuest",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $lookup: {
          from: "guests",
          let: {
            guestids: "$otherGuests",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$guestids"],
                },
              },
            },

            {
              $lookup: {
                from: "files",
                let: {
                  guestID: "$_id",
                  hotelID: "$hotel",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$linkedDocumentid", "$$guestID"] },
                          { $eq: ["$linkedModel", "Guest"] },
                          { $eq: ["$hotel", "$$hotelID"] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      key: 0,
                      Url: 0,
                      linkedDocumentid: 0,
                      linkedModel: 0,
                    },
                  },
                ],
                as: "documents",
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                phone: 1,
                address: 1,
                documents: 1,
              },
            },
          ],
          as: "otherGuests",
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
                  $cond: [
                    { $gt: ["$priceOverride", 0] },
                    "$priceOverride",
                    "$category.baseRate",
                  ],
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
            checkinId: "$_id",
            hotelId: "$hotel",
            guestId: "$primaryGuestId",
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
                      $eq: ["$linkedModelId", "$$checkinId"],
                    },
                    {
                      $eq: ["$linkedModel", "CheckIn"],
                    },
                    {
                      $eq:["$status","open"]
                    }
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
                    $project: {
                      _id: 0,
                      amount: 1,
                      modeOfPayment: 1,
                      paymentModeId: 1,
                      transactionId: 1,
                      status: 1,
                      remarks: 1,
                      createdAt: 1,
                    },
                  },
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
      {
        $lookup: {
          from: "reservations",
          let: {
            resvID: "$reservation",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$resvID"],
                },
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
                    $lookup: {
                      from: "files",
                      let: {
                        guestID: "$_id",
                        hotelID: "$hotel",
                      },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $eq: ["$linkedDocumentid", "$$guestID"] },
                                { $eq: ["$linkedModel", "Guest"] },
                                { $eq: ["$hotel", "$$hotelID"] },
                              ],
                            },
                          },
                        },
                        {
                          $project: {
                            key: 0,
                            Url: 0,
                            linkedDocumentid: 0,
                            linkedModel: 0,
                          },
                        },
                      ],
                      as: "documents",
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      firstName: 1,
                      lastName: 1,
                      email: 1,
                      phone: 1,
                      address: 1,
                      documents: 1,
                    },
                  },
                ],
                as: "guest",
              },
            },
            {
              $unwind:{
                path:"$guest",
                preserveNullAndEmptyArrays:true
              }
            },
            {
              $project: {
                guest: 1,
                _id: 0,
                adults: 1,
                children: 1,
                source: 1,
                specialRequests: 1,
              },
            },
          ],
          as:"reservation"
        },
      },
      {
        $unwind:{
          path:"$reservation",
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $unset:"primaryGuestId"
      }
    ]);

    if (Checkin.length === 0) {
      return res.status(404).json({
        message: "Checkin not found",
      });
    }

    return res.status(200).json({
      checkin: Checkin[0],
    });
  } catch (err) {
    if (err) {
      return res.status(500).json({
        message: err.message || err.data.message || "Internal Server Error",
      });
    }
  }
};
