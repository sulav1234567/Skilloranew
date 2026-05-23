import mongoose from "mongoose";

const HotelRoleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: [
        "owner",
        "generalManager",
        "manager",

        "frontOffice",
        "receptionist",
        "reservationStaff",
        "concierge",

        "housekeeping",
        "laundryStaff",

        "foodAndBevrage",
        "restaurantStaff",
        "kitchenStaff",
        "chef",
        "barStaff",

        "maintenance",
        "engineering",

        "security",

        "accountant",
        "finance",

        "salesMarketing",

        "hr",

        "spaRecreation",

        "itSupport",
      ],
    },
    permissions: {
      type: [String],
      default: [],
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
  },
  { timestamps: true },
);

HotelRoleSchema.index({ user: 1, hotel: 1 ,role:1}, { unique: true });

const HotelRole = mongoose.model("HotelRole", HotelRoleSchema);

export default HotelRole;
