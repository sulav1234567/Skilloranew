import mongoose from "mongoose";

const RoomCategorySchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    baseRate: {
      type: Number,
      required: true,
      min: 0,
    },

    maxPax: {
      type: Number,
      default: 2,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  },
  { timestamps: true }
);

RoomCategorySchema.index({ hotel: 1, name: 1 }, { unique: true });

export default mongoose.model("RoomCategory", RoomCategorySchema);