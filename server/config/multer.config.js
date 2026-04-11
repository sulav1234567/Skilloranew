import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const uploadDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "uploads",
);

let uniquestring = (ext) => {
  return `${Date.now()}-${crypto.randomBytes(3).toString("hex")}-${crypto.randomBytes(6).toString("hex")}${ext}`;
};

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniquename = uniquestring(path.extname(file.originalname));
    cb(null, uniquename);
  },
});

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
    limits: { fileSize: limit || 1000 * 1024 * 1024 },
  });
};

const deletefile = (filename) => {
  if (!filename) return;

  const filePath = path.join(__dirname, "../uploads", filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File deleted: ${filePath}`);
    } else {
      console.warn(`File not found, skipping deletion: ${filePath}`);
    }
  } catch (err) {
    console.warn(`File not deleted: ${filePath}. Reason: ${err.message}`);
  }
};
export { upload, deletefile };
