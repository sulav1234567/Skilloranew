import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelRole",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["hotel", "resort", "guest-house", "homestay", "resturant"],
      default: "hotel",
    },

    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    address: {
      country: {
        type: String,
        default: "Nepal",
      },
      province: String,
      city: {
        type: String,
        required: true,
      },
      area: String,
      street: String,
      zipCode: String,
    },

    location: {
      x:Number,
      y:Number
    },

    contact: {
      phone: String,
      email: String,
      website: String,
    },

    image:{
      originalname:String,
      mimetype:String,
      filename:String,
      size:String

    },

    amenities: [
      {
        type: String,
        enum: [
          "wifi",
          "parking",
          "swimming-pool",
          "restaurant",
          "bar",
          "gym",
          "spa",
          "airport-shuttle",
          "room-service",
          "laundry",
          "ac",
          "hot-water",
          "tv",
        ],
      },
    ],

    policies: {
      checkInTime: {
        type: String,
        default: "12:00 PM",
      },
      checkOutTime: {
        type: String,
        default: "11:00 AM",
      },
      cancellationPolicy: String,
      petAllowed: {
        type: Boolean,
        default: false,
      },
      smokingAllowed: {
        type: Boolean,
        default: false,
      },
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"],
      default: "pending",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

hotelSchema.index({ location: "2dsphere" });
hotelSchema.index({ "address.city": 1 });
hotelSchema.index({ name: "text", description: "text" });

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;