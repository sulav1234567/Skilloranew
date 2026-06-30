import mongoose from "mongoose";
export const RoomAmenity = Object.freeze({
  // Connectivity
  WIFI: "WIFI",
  ETHERNET: "ETHERNET",

  // Climate
  AIR_CONDITIONING: "AIR_CONDITIONING",
  HEATING: "HEATING",
  CEILING_FAN: "CEILING_FAN",

  // Bathroom
  PRIVATE_BATHROOM: "PRIVATE_BATHROOM",
  BATHTUB: "BATHTUB",
  SHOWER: "SHOWER",
  HAIRDRYER: "HAIRDRYER",
  TOILETRIES: "TOILETRIES",
  BATHROBE: "BATHROBE",
  SLIPPERS: "SLIPPERS",

  // Kitchen & refreshments
  MINIBAR: "MINIBAR",
  KITCHENETTE: "KITCHENETTE",
  REFRIGERATOR: "REFRIGERATOR",
  MICROWAVE: "MICROWAVE",
  COFFEE_MAKER: "COFFEE_MAKER",
  ELECTRIC_KETTLE: "ELECTRIC_KETTLE",

  // Entertainment
  TV: "TV",
  SMART_TV: "SMART_TV",
  CABLE_CHANNELS: "CABLE_CHANNELS",
  STREAMING_SERVICES: "STREAMING_SERVICES",

  // Comfort & furnishings
  BALCONY: "BALCONY",
  TERRACE: "TERRACE",
  DESK: "DESK",
  SEATING_AREA: "SEATING_AREA",
  SOFA_BED: "SOFA_BED",
  WARDROBE: "WARDROBE",
  IN_ROOM_SAFE: "IN_ROOM_SAFE",
  IRON: "IRON",
  BLACKOUT_CURTAINS: "BLACKOUT_CURTAINS",
  SOUNDPROOFING: "SOUNDPROOFING",

  // Policy
  NON_SMOKING: "NON_SMOKING",
  SMOKING_ALLOWED: "SMOKING_ALLOWED",
  PET_FRIENDLY: "PET_FRIENDLY",

  // Accessibility
  WHEELCHAIR_ACCESSIBLE: "WHEELCHAIR_ACCESSIBLE",
  ROLL_IN_SHOWER: "ROLL_IN_SHOWER",
  GRAB_BARS: "GRAB_BARS",

  // Services
  ROOM_SERVICE: "ROOM_SERVICE",
  DAILY_HOUSEKEEPING: "DAILY_HOUSEKEEPING",
});

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
      default:"N/A"
    },

    baseRate: {
      type: Number,
      required: true,
      min: 0,
      default:null
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
    },
    amenities:[
      {
        type:String,
        enum:Object.values(RoomAmenity)
      }

    ]
  },
  
  { timestamps: true }
);

RoomCategorySchema.index({ hotel: 1, name: 1 }, { unique: true });

 let RoomCategory = mongoose.model("RoomCategory", RoomCategorySchema);
 export default RoomCategory;