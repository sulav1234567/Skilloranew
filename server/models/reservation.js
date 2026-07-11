import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    confirmationCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    hotel:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,

    },

    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
      index: true,
    },

    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        validate: {
          validator: (v) => v && mongoose.Types.ObjectId.isValid(v),
          message: "A reservation must include at least one room.",
        },
      },
    ],

    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },

    adults: { type: Number, required: true, min: 1, default: 1 },
    children: { type: Number, min: 0, default: 0 },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
        "no_show",
      ],
      default: "pending",
      index: true,
    },

    payment: {
      status: {
        type: String,
        enum: ["unpaid", "partially_paid", "paid", "refunded"],
        default: "unpaid",
      },
      method: {
        type: String,
        enum: ["cash", "card", "upi", "bank_transfer", "esewa","khalti", "other"],
      },
      onlineid: {
        type: String,
        required: [
          function () {
            return this.payment?.method && this.payment.method !== "cash";
          },
          "An online/transaction id is required for non-cash payments.",
        ],
      },
      amountPaid: { type: Number, min: 0, default: 0 },
      remainingAmount: {
        type: Number,
        min: 0,
        default: 0,
      },
      totalAmount:{
         type: Number,
        min: 0,
        default: 0,

      }
    },

    source: {
      type: String,
      enum: ["direct", "website", "phone", "walk_in", "ota", "other"],
      default: "direct",
    },

    specialRequests: { type: String, trim: true, maxlength: 1000 },

    notes: { type: String, trim: true, maxlength: 1000 },

    cancellation: {
      cancelledAt: Date,
      reason: { type: String, trim: true },
      refundAmount: { type: Number, min: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reservationSchema.virtual("nights").get(function () {
  if (!this.checkIn || !this.checkOut) return 0;
  const ms = this.checkOut.getTime() - this.checkIn.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
});

reservationSchema.virtual("totalGuests").get(function () {
  return (this.adults || 0) + (this.children || 0);
});

reservationSchema.pre("validate", function () {
  if (!this.confirmationCode) {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    this.confirmationCode = `RSV-${random}`;
  }

  if (this.checkIn && this.checkOut && this.checkOut <= this.checkIn) {
    return new Error("checkOut must be after checkIn.");
  }


});

reservationSchema.pre("validate", async function () {
  try {
    await this.populate({
      path: "rooms",
      populate: {
        path: "category",
        select: "baseRate",
      },
      select: "category",
    });
    
    let totalamt = Number(this.totalAmount || 0);
    let remAmt = totalamt - this.payment.amountPaid;
    if (remAmt < 0) {
      return new Error("remaining amount must be greater than 0");
    }

   return  this.payment.remainingAmount = remAmt;

    
  } catch (err) {
    return err;
  }
});

let Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
