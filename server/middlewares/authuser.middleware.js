import User from "../models/user.js";
import { VerifyAccessToken } from "../utlits/jwt.utlits.js";

export const AuthUser = async (req, res, next) => {
  let accesstoken = req.cookies.accesstoken;
  if (!accesstoken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = VerifyAccessToken(accesstoken);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "ACCESS_TOKEN_EXPIRED",
      });
    }
    res.status(401).json({
      message: "unauthorized",
    });
  }
};

export const allowRoles =  (...roles) => {
  return (req, res, next) => {
    let user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access. Please login first",
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: "Forbidden. You are not allowed to access this route.",
      });
    }

    next();
  };
};
