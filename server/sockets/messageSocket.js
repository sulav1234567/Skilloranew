import mongoose from "mongoose";
import User from "../models/user.js";
import ChatModel from "../models/chats.js";

import {
  SocketAuthUser,
  SocketAllowRoles,
} from "../middlewares/socketAuth.middleware.js";

export const initializeMessageSocket = (io) => {
  const messageIO = io.of("/message");

  // ======================================
  // SOCKET AUTHENTICATION
  // ======================================

  messageIO.use(SocketAuthUser);

  messageIO.use(SocketAllowRoles("admin"));

  // ======================================
  // CONNECTION
  // ======================================

  messageIO.on("connection", (socket) => {
    console.log("Message socket connected:", socket.id);

    console.log("Authenticated user:", socket.user.Fullname);

    // ==================================
    // JOIN PERSONAL ROOM
    // ==================================

    socket.on("join", () => {
      const userId = socket.user._id.toString();

      socket.join(`user:${userId}`);

      console.log(`User ${userId} joined user:${userId}`);
    });

    // ==================================
    // GET USERS
    // ==================================

    socket.on("get_users", async () => {
      try {
        const userId = socket.user._id;

        const users = await User.aggregate([
          {
            $match: {
              _id: {
                $ne: userId,
              },
            },
          },

          {
            $lookup: {
              from: "chats",

              let: {
                userId: "$_id",
              },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        {
                          $and: [
                            {
                              $eq: ["$sender", userId],
                            },

                            {
                              $eq: ["$receiver", "$$userId"],
                            },
                          ],
                        },

                        {
                          $and: [
                            {
                              $eq: ["$sender", "$$userId"],
                            },

                            {
                              $eq: ["$receiver", userId],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },

                {
                  $sort: {
                    createdAt: -1,
                  },
                },

                {
                  $limit: 1,
                },
              ],

              as: "LastMessage",
            },
          },

          {
            $sort: {
              "LastMessage.createdAt": -1,
            },
          },

          {
            $project: {
              _id: 1,

              avatar: 1,

              Fullname: 1,

              LastMessage: 1,
            },
          },
        ]);

        socket.emit("users", users);
      } catch (error) {
        console.error(error);

        socket.emit("message_error", {
          message: error.message,
        });
      }
    });

    // ==================================
    // SEND MESSAGE
    // ==================================

    socket.on("send_message", async ({ receiverid, content }) => {
      try {
        // IMPORTANT:
        // sender comes from authenticated socket

        const sender = socket.user;

        if (!receiverid || !mongoose.Types.ObjectId.isValid(receiverid)) {
          return socket.emit("message_error", {
            message: "Invalid Receiver Id",
          });
        }

        if (!content || !content.trim()) {
          return socket.emit("message_error", {
            message: "Message without content is not valid",
          });
        }

        const receiver = await User.findById(receiverid);

        if (!receiver) {
          return socket.emit("message_error", {
            message: "Receiver not found",
          });
        }

        const newMessage = await ChatModel.create({
          sender: sender._id,

          receiver: receiver._id,

          status: "sent",

          contenttype: "text",

          content: content.trim(),
        });

        // Send to receiver

        messageIO.to(`user:${receiver._id}`).emit("new_message", newMessage);

        // Send to sender

        messageIO.to(`user:${sender._id}`).emit("new_message", newMessage);
      } catch (error) {
        console.error("Send message error:", error);

        socket.emit("message_error", {
          message: error.message || "Internal server error",
        });
      }
    });

    socket.on("send_all_message", async ({ receiverid }) => {
      try {
        const sender = socket.user;

        if (!receiverid || !mongoose.Types.ObjectId.isValid(receiverid)) {
          return socket.emit("message_error", {
            message: "Invalid Receiver Id",
          });
        }

        const receiver = await User.findById(receiverid);

        if (!receiver) {
          return socket.emit("message_error", {
            message: "Receiver not found",
          });
        }

        const allMessages = await ChatModel.find({
          $or: [
            {
              sender: sender._id,
              receiver: receiver._id,
            },
            {
              sender: receiver._id,
              receiver: sender._id,
            },
          ],
        })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean();

        allMessages.reverse();

        socket.emit("all_messages", allMessages);
      } catch (err) {
        console.error("Fetch messages error:", err);

        socket.emit("message_error", {
          message: err.message || "Internal server error",
        });
      }
    });

    // ==================================
    // DISCONNECT
    // ==================================

    socket.on("disconnect", () => {
      console.log("Message socket disconnected:", socket.id);
    });
  });
};
