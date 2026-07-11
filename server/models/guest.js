import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      trim: true,
    },

    nationality: {
      type: String,
      trim: true,
    },

    idType: {
      type: String,
      enum: ["citizenship", "passport", "license", "national_id"],
      default: "citizenship",
    },

    idNumber: {
      type: String,
      trim: true,
    },

    guestType: {
      type: String,
      enum: ["normal", "vip", "corporate", "blacklisted"],
      default: "normal",
    },

    notes: {
      type: String,
      trim: true,
    },
    createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  },
  { timestamps: true }
);

GuestSchema.index({ hotel: 1, email:1,phone:1,firstName:1,lastName:1 });


let Guest= mongoose.model("Guest", GuestSchema);

 export default Guest