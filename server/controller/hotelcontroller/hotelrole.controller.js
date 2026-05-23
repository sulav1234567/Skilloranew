import Hotel from "../../models/hotel.js";
import HotelInvite from "../../models/hotelinvitation.js";
import HotelRole from "../../models/hotelroles.js";
import User from "../../models/user.js";
import {
  generateInviteToken,
  hashInviteToken,
} from "../../utlits/invitetoken.utlits.js";
import { emailRegex } from "../../utlits/rejex.utlits.js";
import { sendRoleInvitationMail } from "../mail.controller.js";

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
    const HotelUser = await HotelRole.findOne({ user: user._id });

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

export const SendRoleInvitation = async (req, res) => {
  let user = req.user;
  let invitaionid = null
  try {
    let hotelid = req.params.hotelid;
    let { email, role } = req.body;

    if (!hotelid || !email || !role) {
      return res.status(400).json({
        message: "Invalid Parameters",
      });
    }

    let FindHotel = await Hotel.findById(hotelid);

    if (!FindHotel) {
      return res.status(400).json({
        message: "The requested Hotel is not available",
      });
    }
    let roleEnumValues = HotelRole.schema.path("role").enumValues;

    if (
      !Array.from(roleEnumValues).some(
        (value) => value === role.trim().toLowerCase(),
      )
    ) {
      return res.status(400).json({
        message: "The Role Is invalid",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    let FindExistingUser = await User.findOne({ email: email });

    if (!FindExistingUser) {
      return res.status(400).json({
        message: "The User With Particular Email Not Found",
      });
    }

    let FindExistingRole = await HotelRole.findOne({
      user: FindExistingUser._id,
      hotel: hotelid,
    });

    if (FindExistingRole) {
      return res.status(400).json({
        message: "This User is already assigned in this role",
      });
    }

    let findRoleInvitation = await HotelInvite.findOne({
      email: FindExistingUser.email,
      hotel: hotelid,
      status: { $in: ["pending", "accepted"] },
    });
   let findOwnerRoleInvitation = await HotelInvite.findOne({hotel:FindHotel._id,status:{$in:["pending","accepted"]},role:"owner"})
    if (findRoleInvitation || findOwnerRoleInvitation) {
      return res.status(400).json({
        message: "The Invitation is already sent or already accepted ",
      });
    }

    let invitationToken = generateInviteToken();
    let hashedToken = hashInviteToken(invitationToken);
    let invitationLink = `${process.env.FRONTEND_URL}/accept-invitation/${invitationToken}`;
    let permissionEnumValues =
      HotelInvite.schema.path("permissions").options.type[0].enum|| [];

    let CreateInvitation = new HotelInvite({
      hotel: FindHotel._id,

      email: FindExistingUser.email,

      role: role,

      permissions: role === "owner" ? permissionEnumValues : [],

      tokenHash: hashedToken,

      invitedBy: user._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
     await CreateInvitation.save();
     invitaionid = CreateInvitation._id
    await sendRoleInvitationMail({
      email: FindExistingUser.email,
      name: FindExistingUser.Fullname,
      hotelName: FindHotel.name,
      role: role,
      inviteLink: invitationLink,
      invitedBy: user.Fullname,
    });



    res.status(201).json({
      message:"Invitation Sent Successfully"
    })
  } catch (err) {

    

    if(err){
      await HotelInvite.findByIdAndDelete(invitaionid)
       res.status(500).json({
      message:err.message || err.data.message || "Internal server error" 
    })
    }
  }
};
