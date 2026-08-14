import User from "../models/user.js";
import { VerifyAccessToken } from "../utlits/jwt.utlits.js";


export const SocketAuthUser = async (socket, next) => {

  try {

    const cookieHeader =
      socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(
        new Error("Unauthorized")
      );
    }


    const cookies = Object.fromEntries(

      cookieHeader
        .split(";")
        .map(cookie => {

          const [
            key,
            ...value
          ] = cookie
            .trim()
            .split("=");

          return [
            key,
            decodeURIComponent(
              value.join("=")
            )
          ];

        })

    );


    const accesstoken =
      cookies.accesstoken;


    if (!accesstoken) {
      return next(
        new Error("Unauthorized")
      );
    }


    const decoded =
      VerifyAccessToken(accesstoken);


    const user =
      await User
        .findById(decoded.id)
        .select("-password");


    if (!user) {
      return next(
        new Error("User not found")
      );
    }


    socket.user = user;


    next();

  } catch (err) {

    console.error(
      "Socket authentication error:",
      err
    );


    if (
      err.name === "TokenExpiredError"
    ) {

      return next(
        new Error(
          "ACCESS_TOKEN_EXPIRED"
        )
      );

    }


    return next(
      new Error("Unauthorized")
    );

  }

};


export const SocketAllowRoles =
  (...roles) => {

    return (socket, next) => {

      const user =
        socket.user;


      if (!user) {

        return next(
          new Error("Unauthorized")
        );

      }


      if (!roles.includes(user.role)) {

        return next(
          new Error(
            "Forbidden. You are not allowed to access messaging."
          )
        );

      }


      next();

    };

  };