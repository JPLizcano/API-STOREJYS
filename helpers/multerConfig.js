const multer = require("multer");

const storage = multer.memoryStorage(); // Guarda la imagen en memoria antes de subirla a Cloudinary

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo se permiten archivos de imagen"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
