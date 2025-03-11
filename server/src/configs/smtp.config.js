"use strict";
const host = process.env.HOST_EMAIL || "smtp.gmail.com";
const port = process.env.PORT_EMAIL || 465;
const config = {
	authEmail: process.env.SMTP_AUTH_EMAIL || "",
	authPasswordEmail: process.env.SMTP_AUTH_PASSWORD_EMAIL || "",
};

module.exports = { host, port, ...config };
