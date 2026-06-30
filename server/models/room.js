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
        "reserved"
      ],
      default: "available",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    priceOverride: {
      type: Number,
      default: null,
    },
    pax: {
      type: Number,
      required: true,
      
    },
    description:{
      type:String
    },
    roomSize:{
      type:Number,
      default:null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    
  },
);
RoomSchema.virtual("effectivePrice").get(function () {
  if (this.priceOverride !== null) return this.priceOverride;
  if (this.category && this.category.priceOverride !== null)
    return this.category.baseRate;
  return null;
});

RoomSchema.index({ hotel: 1, roomNumber: 1 }, { unique: true });

let  Room = mongoose.model("Room", RoomSchema);
export default Room;
