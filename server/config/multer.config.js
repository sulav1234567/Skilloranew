import multer from "multer";
import path from "path";
import crypto from "crypto";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3.config.js";

const uniqueString = (ext) => {
  return `${Date.now()}-${crypto.randomBytes(3).toString("hex")}-${crypto
    .randomBytes(6)
    .toString("hex")}${ext}`;
};

// IMPORTANT:
// For S3, use memoryStorage, not diskStorage.
const storage = multer.memoryStorage();

let upload = (type, limit) => {
  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (type === "all") {
        return cb(null, true);
      }

      if (file.mimetype.startsWith(`${type}`)) {
        cb(null, true);
      } else {
        cb(new Error("this file type is not supported"), false);
      }
    },
    limits: {
      fileSize: limit || 1000 * 1024 * 1024,
    },
  });
};

const uploadToS3 = async (file, folder = "uploads") => {
  if (!file) {
    throw new Error("No file provided");
  }

  const ext = path.extname(file.originalname);
  const fileName = uniqueString(ext);
  const key = `${folder}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  const fileUrl = `${process.env.AWS_PUBLIC_FILE_URL}/${key}`;

  return {
    fileUrl,
    fileKey: key,
  };
};

const deletefile = async (fileKey) => {
  if (!fileKey) return;

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });

    await s3.send(command);

    console.log(`File deleted from S3: ${fileKey}`);
  } catch (err) {
    console.warn(`File not deleted from S3: ${fileKey}. Reason: ${err.message}`);
  }
};

export { upload, uploadToS3, deletefile };