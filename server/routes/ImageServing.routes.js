import express from "express";
import { allowRoles, AuthUser } from "../middlewares/authuser.middleware.js";
import mongoose from "mongoose";
import FileModel from "../models/files.js";
import { s3 } from "../config/s3.config.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { pipeline } from "node:stream/promises";
let router = express.Router();

router.get(
  "/hotel/:hotelid/media/:mediaid",
  AuthUser,
  allowRoles("admin"),
  async (req, res) => {
    let { hotelid, mediaid } = req.params;

    try {
      if (!hotelid || !mongoose.Types.ObjectId.isValid(hotelid)) {
        return res.status(400).json({
          message: "Invalid Hotel Id",
        });
      }

      if (!mediaid || !mongoose.Types.ObjectId.isValid(mediaid)) {
        return res.status(400).json({
          message: "Invalid media id",
        });
      }

      let media = await FileModel.findOne({
        hotel: hotelid,
        _id: mediaid,
      });

      if (!media) {
        return res.status(400).json({
          message: "Media Not Found",
        });
      }
      const bucketName = process.env.AWS_BUCKET_NAME;
      const objectKey = media.key;

      if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME is not configured");
      }

      if (!objectKey) {
        throw new Error("S3 object key is missing");
      }

      const input = {
        Bucket: bucketName,
        Key: objectKey,
      };

      const command = new GetObjectCommand(input);
      const s3Object = await s3.send(command);

      res.setHeader(
        "Content-Type",
        s3Object.ContentType || "application/octet-stream",
      );

      res.setHeader("Cache-Control", "private, max-age=3600");
      await pipeline(s3Object.Body, res);
    } catch (err) {
     
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Unable to serve image",
        });
      }
    }
  },
);

let ImageServingRouter = router;
export default ImageServingRouter;
