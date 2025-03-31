const path = require("path");
const FILE_DIR = path.join(__dirname, "../uploads");
const fs = require("fs");
if (!fs.existsSync(FILE_DIR)) {
	fs.mkdirSync(FILE_DIR);
}

module.exports = {
	CLIENT_URL: process.env.CLIENT_URL,
	AI_SERVICE_URL: process.env.AI_SERVICE_URL,
	FILE_DIR,
};
