const multer = require("multer");

// Configure storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "src/uploads/"); // Uploads will be saved in 'uploads' directory
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + "-" + file.originalname);
	},
	// filter video and image file
	fileFilter: (req, file, cb) => {
		if (file.mimetype.includes("video") || file.mimetype.includes("image")) {
			cb(null, true);
		} else {
			cb(new Error("Tệp không hỗ trợ"), false);
		}
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 50 * 1024 * 1024 }, // 10MB limit
});
module.exports = { upload };
