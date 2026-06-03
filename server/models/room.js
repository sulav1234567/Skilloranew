import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomCategory",
      required: true,
      index: true,
    },

    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },

    floor: {
      type: String,
      trim: true,
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: [
        "available",
        "occupied",
        "dirty",
        "cleaning",
        "maintenance",
        "blocked",
      ],
      default: "available",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

RoomSchema.index({ hotel: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model("Room", RoomSchema);