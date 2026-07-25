const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = (folder = "profile") => {
  const uploadPath = path.join(__dirname, `../uploads/${folder}`);

  // Create folder if it doesn't exist
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(
        null,
        uniqueName + path.extname(file.originalname)
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/;

    const ext = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mime = allowedTypes.test(file.mimetype);

    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
};

module.exports = upload;