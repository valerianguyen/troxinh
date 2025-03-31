const template_html = require("../utils/template.email");
const transporter = require("../dbs/init.nodemailer");

class EmailService {
	static send = ({ receiver, templateName }) => {
		const template = {
			forgotPassword: async ({ name, new_password }) => {
				let info = await transporter.sendMail({
					from: "Shop <anhanhxxz0@gmail.com>",
					to: receiver,
					subject: "Xin chào, " + receiver,
					html: template_html[templateName]({ name, new_password }),
				});
				return info.messageId;
			},
			blockApartment: async ({ name, reason, data }) => {
				let info = await transporter.sendMail({
					from: "Shop <anhanhxxz0@gmail.com>",
					to: receiver,
					subject: "Xin chào, " + receiver,
					html: template_html[templateName]({ name, reason, data }),
				});
				return info.messageId;
			},
			unBlockApartment: async ({ name, data }) => {
				let info = await transporter.sendMail({
					from: "Shop <anhanhxxz0@gmail.com>",
					to: receiver,
					subject: "Xin chào, " + receiver,
					html: template_html[templateName]({ name, data }),
				});
				return info.messageId;
			},
		};
		return template[templateName];
	};
}

module.exports = EmailService;
