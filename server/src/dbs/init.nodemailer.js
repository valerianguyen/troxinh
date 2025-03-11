const nodemailer = require("nodemailer");
// Import NodeMailer (after npm install)
const { host, port, authEmail, authPasswordEmail } = require("../configs/smtp.config");
const transporter = nodemailer.createTransport({
	host,
	port,
	secure: true,
	auth: {
		user: authEmail,
		pass: authPasswordEmail,
	},
});

module.exports = transporter;
