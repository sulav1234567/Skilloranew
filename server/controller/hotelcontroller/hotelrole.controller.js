import HotelRole from "../../models/hotelroles.js";
import User from "../../models/user.js";
import { emailRegex } from "../../utlits/rejex.utlits.js";

export const SearchUser = async (req, res) => {
  const { email } = req.body;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Email format not valid",
      ok: false,
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("_id Fullname email avatar,role");
    const HotelUser = await HotelRole.findOne({user:user._id})

    if (!user || HotelUser) {
      return res.status(404).json({
        message: "User not found or not eligible for this task",
        ok: false,
      });
    }

    return res.status(200).json({
      message: "User found",
      ok: true,
      user,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
      ok: false,
    });
  }
};