import mongoose, { mongo } from "mongoose";
import Hotel from "../../models/hotel.js";
import Reservation from "../../models/reservation.js";
import Guest from "../../models/guest.js";
import CheckIn from "../../models/checkin.js";
import FileModel from "../../models/files.js";
import Room from "../../models/room.js";
import Folio from "../../models/folio.js";
import { deletefile, uploadToS3 } from "../../config/multer.config.js";
import PaymentModel from "../../models/payment.js";
import fs from "fs/promises";
import { emailRegex, phoneRegex } from "../../utlits/rejex.utlits.js";

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
                      $eq: ["$hotel", hotelDocument._id],
                    },
                    {
                      $eq: ["$guest", "$$guestId"],
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
export const  GetIndividualReservation = async (req, res) => {
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
              {
                $eq:["$status","confirmed"]
              }
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
            guestid: "$guestId",
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
                  guestID: "$$guestid",
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

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
const deleteLocalFiles = async (files = []) => {
  const validFiles = files.filter((file) => file?.path);

  const results = await Promise.allSettled(
    validFiles.map((file) => fs.unlink(file.path)),
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `Failed to delete local file ${validFiles[index].path}:`,
        result.reason?.message,
      );
    }
  });
};

export const CreateCheckin = async (req, res) => {
  const session = await mongoose.startSession();

  const images = Array.isArray(req.files) ? req.files : [];

  const uploadedFileInfo = [];

  try {
    const {
      guestid,
      isprimary,
      hasconsented,
      consenttext,
      guestname,
      guestemail,
      guestphone,
      guestaddress,
      guesttype,
      guestidtype,
      guestidnumber,
      guestnationality,
    } = req.body;

    const { hotelid, reservationid } = req.params;

    // FormData sends boolean values as strings.
    const isPrimaryValue = isprimary === true || isprimary === "true";

    const hasConsentedValue = hasconsented === true || hasconsented === "true";

    if (!isPrimaryValue) {
      throw new AppError("The selected guest must be the primary guest", 400);
    }

    if (!hasConsentedValue) {
      throw new AppError("Guest consent is required", 400);
    }

    if (typeof consenttext !== "string" || !consenttext.trim()) {
      throw new AppError("Consent text is required", 400);
    }

    if (!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)) {
      throw new AppError("Invalid Hotel ID", 400);
    }

    if (!reservationid || !mongoose.Types.ObjectId.isValid(reservationid)) {
      throw new AppError("Invalid Reservation ID", 400);
    }

    if (
      !guestid &&
      (!guestname ||
        !guestemail ||
        !guestphone ||
        !guestaddress ||
        !guestidnumber ||
        !guestidtype ||
        !guesttype ||
        !guestnationality)
    ) {
      throw new AppError("There is not enough Guest Information", 400);
    }

    session.startTransaction();

    let guest = null;

    const hotel = await Hotel.findById(hotelid).session(session);

    if (!hotel) {
      throw new AppError("Hotel not found", 404);
    }

    if (!guestid) {
      const cleanedGuestEmail = guestemail.trim().toLowerCase() || null;
      const isValidguestemail = cleanedGuestEmail
        ? emailRegex.test(cleanedGuestEmail)
        : null;
      const isValidguestphone = guestphone ? phoneRegex.test(guestphone) : null;
      let splittedGuestName = guestname.trim().split(" ");

      let cleanedguestidtype = guestidtype.trim();
      let cleanedguesttype = guesttype.trim();

      const guestIdTypeEnum = Guest.schema.path("idType").enumValues;
      const guestTypeEnum = Guest.schema.path("guestType").enumValues;

      if (!isValidguestemail || !isValidguestphone) {
        throw new AppError("Invalid guest email or phone", 400);
      }

      if (
        !guestIdTypeEnum.includes(cleanedguestidtype) ||
        !guestTypeEnum.includes(cleanedguesttype)
      ) {
        throw new AppError("Invalid guest idtype or guesttype", 400);
      }

      let findExistingGuest = await Guest.find({
        hotel: hotel._id,
        $or: [
          {
            email: cleanedGuestEmail,
          },
          {
            phone: guestphone,
          },
        ],
      });

      if (findExistingGuest.length != 0) {
        throw new AppError("This Guest Already Exists so search it first", 400);
      }

      guest = new Guest({
        firstName: splittedGuestName[0],
        lastName: splittedGuestName[1],
        phone: guestphone,
        email: cleanedGuestEmail,
        hotel: hotel._id,
        idType: cleanedguestidtype,
        guestType: cleanedguesttype,
        address: guestaddress,

        nationality: guestnationality,

        idNumber: guestidnumber,

        createdBy: req.user._id,
      });

      await guest.save({ session });
    }

    const reservation = await Reservation.findOne({
      _id: reservationid,
      hotel: hotel._id,
    }).session(session);

    if (!reservation) {
      throw new AppError("Reservation not found in this hotel", 400);
    }
    if (guestid) {
      guest = await Guest.findOne({
        _id: guestid,
        hotel: hotel._id,
      }).session(session);
    }

    if (!guest) {
      throw new AppError("Guest not found in this hotel", 400);
    }

    /*
     * Check for another active stay belonging
     * to the same primary guest.
     *
     * Use the exact status value defined in your schema.
     */
    const conflictingCheckIn = await CheckIn.findOne({
      hotel: hotel._id,
      primaryGuest: guest._id,
      status: {
        $ne: "checked_out",
      },

      actualCheckInTime: { $lt: reservation.checkOut },
      expectedCheckoutDate: { $gt: reservation.checkIn },
    }).session(session);

    if (conflictingCheckIn) {
      throw new AppError(
        "A stay with the same primary guest already exists",
        400,
      );
    }

    /*
     * Find existing guest ID documents.
     * Keep the name value consistent everywhere.
     */
    const guestDocuments = await FileModel.find({
      hotel: hotel._id,
      linkedDocumentid: guest._id,
      linkedModel: "Guest",
      name: "guestID",
    }).session(session);

    const requiredDocumentCount = 2;
    const missingDocumentCount = Math.max(
      requiredDocumentCount - guestDocuments.length,
      0,
    );

    if (images.length < missingDocumentCount) {
      throw new AppError(
        `Upload at least ${missingDocumentCount} more guest document${
          missingDocumentCount === 1 ? "" : "s"
        }`,
        400,
      );
    }

    /*
     * Validate check-in date.
     */
    const today = new Date();
    const reservationCheckIn = new Date(reservation.checkIn);

    if (Number.isNaN(reservationCheckIn.getTime())) {
      throw new AppError("Reservation has an invalid check-in date", 400);
    }

    const isSameDate =
      today.getFullYear() === reservationCheckIn.getFullYear() &&
      today.getMonth() === reservationCheckIn.getMonth() &&
      today.getDate() === reservationCheckIn.getDate();

    if (!isSameDate) {
      throw new AppError("The reservation check-in date is not today", 400);
    }

    /*
     * Check room availability.
     */
    const rooms = await Room.find({
      _id: {
        $in: reservation.rooms,
      },
      hotel: hotel._id,
      status: "available",
    }).session(session);

    if (rooms.length !== reservation.rooms.length) {
      throw new AppError("Some selected rooms are not available", 400);
    }

    /*
     * Find open reservation folios that need
     * to be transferred to the check-in folio.
     */
    const guestFolios = await Folio.find({
      hotel: hotel._id,
      status: "open",
      linkedModelId: reservation._id,
      linkedModel: "Reservation",
    }).session(session);

    const amountToTransfer = guestFolios.reduce((total, folio) => {
      const totalAmount = Number(folio.totalAmount) || 0;

      const amountPaid = Number(folio.amountPaid) || 0;

      return total + (totalAmount - amountPaid);
    }, 0);

    /*
     * Upload only the number of documents that
     * are actually missing.
     *
     * MongoDB cannot roll back S3 uploads, so we
     * store their keys and delete them in catch.
     */
    for (let index = 0; index < missingDocumentCount; index++) {
      const image = images[index];

      const uploadedImage = await uploadToS3(image, "guestdocument");

      uploadedFileInfo.push({
        fileUrl: uploadedImage.fileUrl,
        fileKey: uploadedImage.fileKey,
        originalname: image.originalname,
        size: image.size,
        mimetype: image.mimetype,
      });
    }

    /*
     * Do not use forEach(async () => {}).
     * Use for...of so every save is awaited.
     */
    for (const fileInfo of uploadedFileInfo) {
      const newFile = new FileModel({
        linkedModel: "Guest",
        linkedDocumentid: guest._id,
        size: fileInfo.size,
        mimetype: fileInfo.mimetype,
        originalname: fileInfo.originalname,
        Url: fileInfo.fileUrl,
        key: fileInfo.fileKey,
        hotel: hotel._id,
        name: "guestID",
      });

      await newFile.save({ session });
    }

    /*
     * Create check-in.
     */
    const newCheckIn = new CheckIn({
      reservation: reservation._id,
      status: "pending",
      rooms: reservation.rooms,
      primaryGuest: guest._id,
      hotel: hotel._id,
      checkedInBy: req.user._id,
      hasConsented: hasConsentedValue,
      consentText: consenttext.trim(),
      expectedCheckoutDate: reservation.checkOut,
    });

    await newCheckIn.save({ session });

    /*
     * Update reservation.
     */
    reservation.status = "checked_in";
    await reservation.save({ session });

    /*
     * Mark rooms as occupied.
     */
    const roomUpdateResult = await Room.updateMany(
      {
        _id: {
          $in: reservation.rooms,
        },
        hotel: hotel._id,
        status: "available",
      },
      {
        $set: {
          status: "occupied",
        },
      },
      {
        session,
      },
    );

    if (roomUpdateResult.modifiedCount !== reservation.rooms.length) {
      throw new AppError("Unable to occupy all reservation rooms", 400);
    }

    /*
     * Create the check-in folio.
     */
    const newFolio = new Folio({
      hotel: hotel._id,
      guest: guest._id,
      linkedModelId: newCheckIn._id,
      linkedModel: "CheckIn",
      status: "open",
      totalAmount: amountToTransfer,
      amountPaid: 0,
    });

    await newFolio.save({ session });

    /*
     * Create transfer payment only when there
     * is an amount to transfer.
     */
    console.log(amountToTransfer);
    if (amountToTransfer > 0) {
      const transferredFolioIds = guestFolios.map((folio) => folio._id);

      const newPayment = new PaymentModel({
        paymentName: "Transferred from reservation folio",
        folio: newFolio._id,
        amountToPay: amountToTransfer,
        paymentFor: "Transferred from old folio",
        paymentItem: transferredFolioIds,
        payableModel: "Folio",
        createdBy: req.user._id,
        paymentType: "receive",
      });

      await newPayment.save({ session });

      /*
       * Close transferred reservation folios.
       */
      for (const folio of guestFolios) {
        const folioDue = Math.max(
          (Number(folio.totalAmount) || 0) - (Number(folio.amountPaid) || 0),
          0,
        );

        folio.status = "transferred";
        folio.transferredAmount = folioDue;
        folio.transferredToModel = "CheckIn";
        folio.transferredTo = newCheckIn._id;

        await folio.save({ session });
      }
    }

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Guest checked in successfully",
      checkIn: newCheckIn,
    });
  } catch (err) {
    console.log(err);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    // Delete any S3 files uploaded before the error occurred.
    await Promise.allSettled(
      uploadedFileInfo
        .filter((file) => file?.fileKey)
        .map((file) => deletefile(file.fileKey)),
    );

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  } finally {
    await deleteLocalFiles(images);
    await session.endSession();
  }
};
