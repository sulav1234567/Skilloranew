import mongoose from "mongoose";

let checkinSchema = new mongoose.Schema(
  {
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
    primaryGuest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
    },
    otherGuests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
      },
    ],
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    actualCheckInTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
    checkinCode: {
      type: String,
      required:true
    },
    hasConsented: {
      type: Boolean,
      required: true,
    },
    consentText: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "inHouse","checkedOut"],
      required:true
    },
    actualCheckinDate:{
      type:Date,
      default:Date.now,
      required:true
    },
    expectedCheckoutDate:{
      type:Date,
      required:true
    }
  },
  { timestamps: true },
);

checkinSchema.pre("validate", function () {
  if (!Array.isArray(this.rooms) || this.rooms.length === 0) {
    this.invalidate("rooms", "At least one room is required.");
  }

  if (
    this.primaryGuest &&
    this.otherGuests?.some(
      (guestId) => guestId.toString() === this.primaryGuest.toString(),
    )
  ) {
    this.invalidate(
      "otherGuests",
      "Primary guest cannot also appear in other guests.",
    );
  }

  if (this.otherGuests?.length) {
    const uniqueGuestIds = new Set(
      this.otherGuests.map((guestId) => guestId.toString()),
    );

    if (uniqueGuestIds.size !== this.otherGuests.length) {
      this.invalidate("otherGuests", "Duplicate guests are not allowed.");
    }
  }

  if (this.isNew && !this.checkinCode) {
    this.checkinCode = `CINX-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;
  }
});
checkinSchema.index({ hotel: 1, reservation: 1 });

checkinSchema.index({ hotel: 1,checkinCode: 1});

let CheckIn = mongoose.model("CheckIn", checkinSchema);

export default CheckIn;
