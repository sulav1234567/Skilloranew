import mongoose from "mongoose";

const HotelInviteSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: [
        "owner",
        "generalManager",
        "manager",
        "frontOffice",
        "housekeeping",
        "foodAndBeverage",
        "kitchen",
        "maintenance",
        "security",
        "accountant",
        "salesMarketing",
        "hr",
      ],
    },

    permissions: [
      {
        type: String,
        enum: [
          "viewDashboard",

          "manageHotel",
          "editHotel",

          "manageRooms",
          "viewRooms",
          "createRoom",
          "editRoom",
          "deleteRoom",

          "manageBookings",
          "viewBookings",
          "createBooking",
          "editBooking",
          "cancelBooking",
          "checkInGuest",
          "checkOutGuest",

          "manageGuests",
          "viewGuests",

          "manageStaff",
          "viewStaff",
          "createStaff",
          "editStaff",
          "deleteStaff",

          "manageHousekeeping",
          "viewHousekeeping",
          "updateRoomStatus",

          "manageRestaurant",
          "viewOrders",
          "createOrder",
          "editOrder",
          "cancelOrder",

          "managePayments",
          "viewPayments",
          "createPayment",
          "refundPayment",

          "manageReports",
          "viewReports",

          "manageSettings",
        ],
      },
    ],

    tokenHash: {
      type: String,
      required: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "expired", "cancelled"],
      default: "pending",
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    acceptedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

HotelInviteSchema.index({ email: 1, hotel: 1, status: 1 });

const HotelInvite =
  mongoose.models.HotelInvite ||
  mongoose.model("HotelInvite", HotelInviteSchema);

export default HotelInvite;