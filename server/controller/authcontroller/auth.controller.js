import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import {
  GenerateAccessToken,
  GenerateRefreshToken,
  VerifyRefreshToken,
} from "../../utlits/jwt.utlits.js";
import {
  sendPasswordMail,
  sendPasswordResetLink,
  sendWelcomeMail,
} from "../mail.controller.js";
import { emailRegex } from "../../utlits/rejex.utlits.js";
import {
  generateInviteToken,
  hashInviteToken,
} from "../../utlits/invitetoken.utlits.js";
import PasswordReset from "../../models/passwordreset.js";
import { generateStrongPassword } from "../../utlits/generatepassword.utlits.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = isProduction
  ? `HttpOnly; Secure; SameSite=${process.env.SAME_SITE}; Domain=.skillsoora.com`
  : `HttpOnly; SameSite=${process.env.SAME_SITE}`;

export const SignupUser = async (req, res) => {
  try {
    const {
      skilloraemail,
      skillorafullname,
      skillorapassword,
      skilloraconfirmpassword,
    } = req.body;
    console.log(
      skilloraemail,
      skillorafullname,
      skillorapassword,
      skilloraconfirmpassword,
    );

    if (
      !skilloraemail ||
      !skillorafullname ||
      !skillorapassword ||
      !skilloraconfirmpassword
    ) {
      return res.status(400).json({
        message: "some fields are missing",
      });
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(skilloraemail)) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    let finduser = await User.findOne({ email: skilloraemail });

    if (skillorapassword != skilloraconfirmpassword) {
      return res.status(400).json({
        message: "Passwords Doesnot Match",
      });
    }

    const hashedpassword = await bcrypt.hash(skillorapassword, 10);

    if (!finduser) {
      const createUser = new User({
        Fullname: skillorafullname,
        email: skilloraemail,
        password: hashedpassword,
        authprovider: {
          local: true,
          google: false,
          github: false,
        },
        role: "user",
      });
      await createUser.save();
      return res.status(200).json({
        message: "You Are Successfully registered to this system",
      });
    }

    if (finduser && finduser.authprovider?.google) {
      finduser.password = hashedpassword;
      finduser.authprovider.local = true;
      await finduser.save();
      return res.status(200).json({
        message: "Local account linked to Google account",
      });
    }

    return res.status(400).json({
      message: "Wrong Credentials",
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

export const LoginUser = async (req, res) => {
  let { skilloraloginemail, skilloraloginpassword } = req.body;

  if (!skilloraloginemail || !skilloraloginpassword) {
    return res.status(400).json({
      message: "Data Missing",
    });
  }

  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(skilloraloginemail)) {
    return res.status(400).json({
      message: "Invalid Email",
    });
  }

  let finduser = await User.findOne({ email: skilloraloginemail });

  if (!finduser) {
    return res.status(400).json({
      message: "Wrongn Credentials",
    });
  }

  let compare = await bcrypt.compare(skilloraloginpassword, finduser.password);
  if (!compare) {
    return res.status(400).json({
      message: "Wrongn Credentials",
    });
  }

  try {
    let accesstoken = GenerateAccessToken(finduser);
    let refreshtoken = GenerateRefreshToken(finduser);
    let hashrefreshtoken = await bcrypt.hash(refreshtoken, 10);

    res.setHeader("Set-Cookie", [
      `refreshtoken=${refreshtoken}; ${cookieOptions}; Path=/`,
      `accesstoken=${accesstoken}; ${cookieOptions}; Path=/`,
    ]);

    finduser.refreshtoken = hashrefreshtoken;
    await finduser.save();
    try {
      await sendWelcomeMail({ email: finduser.email, name: finduser.Fullname });
    } catch (err) {
      console.log("Password email sending failed:", err.message);
    }

    res.status(200).json({
      message: "login successful",
    });
  } catch (err) {
    console.log(err);
    res.status(err?.response?.status || 500).json({
      message: "Internal Server Error. Try Again!",
    });
  }
};

export const RefreshToken = async (req, res) => {
  let refreshtoken = req.cookies.refreshtoken;

  if (!refreshtoken) {
    res.setHeader("Set-Cookie", [
      `refreshtoken=; ${cookieOptions}; Path=/`,
      `accesstoken=; ${cookieOptions}; Path=/`,
    ]);

    return res.status(401).json({
      message: "Unauthorized Please Login Again!",
    });
  }

  try {
    const decoded = VerifyRefreshToken(refreshtoken);

    const user = await User.findById(decoded.id);

    if (!user || !user.refreshtoken) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const isvalid = await bcrypt.compare(refreshtoken, user.refreshtoken);

    if (!isvalid) {
      return res.status(400).json({
        message: "Invalid Refresh Token",
      });
    }

    const accesstoken = GenerateAccessToken(user);
    const refreshtokeng = GenerateRefreshToken(user);
    const hashrefreshtoken = await bcrypt.hash(refreshtokeng, 10);

    user.refreshtoken = hashrefreshtoken;
    await user.save();
    res.setHeader("Set-Cookie", [
      `refreshtoken=${refreshtokeng}; ${cookieOptions}; Path=/`,
      `accesstoken=${accesstoken}; ${cookieOptions}; Path=/`,
    ]);

    res.status(200).json({
      message: "ok",
    });
  } catch (err) {
    res.setHeader("Set-Cookie", [
      `refreshtoken=; ${cookieOptions}; Path=/`,
      `accesstoken=; ${cookieOptions}; Path=/`,
    ]);

    return res.status(401).json({
      message: "Unauthorized Please Login Again",
    });
  }
};

export const Logout = async (req, res) => {
  try {
    const refreshtoken = req.cookies.refreshtoken;

    if (refreshtoken) {
      try {
        const decoded = VerifyRefreshToken(refreshtoken);
        const user = await User.findById(decoded.id);

        if (user) {
          user.refreshtoken = null;
          await user.save();
        }
      } catch (err) {}
    }

    res.setHeader("Set-Cookie", [
      `refreshtoken=; ${cookieOptions}; Path=/`,
      `accesstoken=; ${cookieOptions}; Path=/`,
    ]);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

export const ForgotPassword = async (req, res) => {
  let {email} = req.body;
  console.log(email)

  if (!email || !emailRegex.test(email)) {
    return res.status(401).json({
      message: "Invalid Email",
    });
  }

  try {
    let user = await User.findOne({ email: email });

    if (user) {
      let resettoken = generateInviteToken();
      let hashResetToken = hashInviteToken(resettoken);

      let PasswordResetLink = new PasswordReset({
        user: user._id,
        token: hashResetToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      await PasswordResetLink.save();

      await sendPasswordResetLink({
        email: user.email,
        name: user.Fullname,
        resetLink: `${process.env.FRONTEND_URL}/resetmypassword/${resettoken}`,
      });
    }

    res.status(201).json({
      message: "Reset link Has Been Sent. Check Your Email",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "error occured",
    });
  }
};

export const ResetPassword = async (req, res) => {
  let { token } = req.params;

  if (!token) {
    return res.status(401).json({
      message: "params not found",
    });
  }

  try {
    let hashedToken = hashInviteToken(token);
    let findPasswordResets = await PasswordReset.findOne({
      token: hashedToken,
    });

    if (!findPasswordResets) {
      return res.status(401).json({
        message: "link not found",
      });
    }

    if (findPasswordResets.isUsed === true) {
      return res.status(401).json({
        message: "Link Already Used",
      });
    }
    if (
      findPasswordResets.expiresAt < Date.now() &&
      findPasswordResets.status != "expired"
    ) {
      findPasswordResets.status = "expired";
      await findPasswordResets.save();
    }

    if (findPasswordResets.status === "expired") {
      return res.status(401).json({
        message: "Link Expired",
      });
    }

    let findUser = await User.findById(findPasswordResets.user);

    if (!findUser) {
      return res.status(401).json({
        message: "Link Error",
      });
    }

    let newPassword = generateStrongPassword();
    let hashedNewPassword = await bcrypt.hash(newPassword, 10);

    findUser.password = hashedNewPassword;
    await findUser.save();

    await sendPasswordMail({
      email: findUser.email,
      name: findUser.Fullname,
      password: newPassword,
    });
    findPasswordResets.isUsed = true;
    await findPasswordResets.save();

    res.status(201).json({
      message: "Password Reseted Successfully. Check Your Email",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
