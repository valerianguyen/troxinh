// verify, forgot password
"use strict";
const template_html = {
	verify: ({ name, token, ipAddress, timeLogin }) => {
		return `
		<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Verify Your Email</title>
					<style>
						body {
							font-family: Arial, sans-serif;
							background-color: #f4f4f4;
							color: #333;
							margin: 0;
							padding: 0;
						}
						.container {
							width: 100%;
							max-width: 600px;
							margin: 0 auto;
							background-color: #fff;
							padding: 40px;
							box-sizing: border-box;
							box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
						}
						.header {
							padding: 10px 0;
						}
						.header img {
							max-width: 100px;
						}
						.content h1 {
							color: #333;
						}
						.content p {
							color: #666;
							line-height: 1.6;
							margin: 0;
						}
						.button {
							display: inline-block;
							padding: 10px 20px;
							background-color: #E49BFF;
							color: #fff;
							text-decoration: none;
							border-radius: 5px;
							margin:auto
						}
						.footer {
							text-align: center;
							padding: 10px 0;
							color: #aaa;
							font-size: 12px;
						}
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">Dear ${name},</div>
						<div class="content">
							<p style="margin:10px 0">
								We noticed a new login to your account from a device we don't recognize. If this was you,
								you can safely ignore this email. If this wasn't you, please secure your account
								immediately.
							</p>
							<div>
								<p><span style="color: #C738BD;">Login Details:</span></p>
								<p><span style="color: #C738BD;">IP:</span> ${ipAddress}</p>
								<p><span style="color: #C738BD;">Time:</span> ${timeLogin}</p>
							</div>
							<div style="display: flex; justify-content: center; margin-top: 10px;">
								<a href="http://localhost:3000/auth/verify/${token}" class="button">Verify Login</a>
							</div>
						</div>
						<div class="footer">
							<p>If you did not sign up for this account, you can ignore this email.</p>
							<p>&copy; 2024 Hoang Do. All rights reserved.</p>
						</div>
					</div>
				</body>
			</html>
`;
	},
	forgotPassword: ({ name, new_password }) => {
		return `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Verify Your Email</title>
					<style>
						body {
							font-family: Arial, sans-serif;
							background-color: #f4f4f4;
							color: #333;
							margin: 0;
							padding: 0;
						}
						.container {
							width: 100%;
							max-width: 600px;
							margin: 0 auto;
							background-color: #fff;
							padding: 40px;
							box-sizing: border-box;
							box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
						}
						.header {
							padding: 10px 0;
						}
						.header img {
							max-width: 100px;
						}
						.content h1 {
							color: #333;
						}
						.content p {
							color: #666;
							line-height: 1.6;
							margin: 0;
						}
						.button {
							display: inline-block;
							padding: 10px 20px;
							background-color: #E49BFF;
							color: #fff;
							text-decoration: none;
							border-radius: 5px;
							margin:auto
						}
						.footer {
							text-align: center;
							padding: 10px 0;
							color: #aaa;
							font-size: 12px;
						}
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">Xin chào ${name},</div>
						<div class="content">
							<p style="margin:10px 0;padding:10px 20px;background:#ccc">
								Mật khẩu mới của bạn là: <span style="font-weight:700">${new_password}</span>
							</p>
						</div>
						<div class="footer">
							<p>If you did not sign up for this account, you can ignore this email.</p>
							<p>&copy; 2025 Hoang Do. All rights reserved.</p>
						</div>
					</div>
				</body>
			</html>
		`;
	},
	blockApartment: ({ name, reason, data }) => {
		return `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Tin đăng bị khóa</title>
					<style>
						body {
							font-family: Arial, sans-serif;
							background-color: #f4f4f4;
							color: #333;
							margin: 0;
							padding: 0;
						}
						.container {
							width: 100%;
							max-width: 600px;
							margin: 0 auto;
							background-color: #fff;
							padding: 40px;
							box-sizing: border-box;
							box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
						}
						.header {
							padding: 10px 0;
						}
						.header img {
							max-width: 100px;
						}
						.content h1 {
							color: #333;
						}
						.content p {
							color: #666;
							line-height: 1.6;
							margin: 0;
						}
						.button {
							display: inline-block;
							padding: 10px 20px;
							background-color: #E49BFF;
							color: #fff;
							text-decoration: none;
							border-radius: 5px;
							margin:auto
						}
						.footer {
							text-align: center;
							padding: 10px 0;
							color: #aaa;
							font-size: 12px;
						}
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">Xin chào ${name},</div>
						<div class="content">
							<p style="margin:10px 0">
								Chúng tôi đã khóa tin đăng <a href="http://localhost:5173/apartment/${data.apart_id}">${data.apart_title}</a> của bạn vì lý do: ${reason}
							</p>
						</div>
						<div class="footer">
							<p>If you did not sign up for this account, you can ignore this email.</p>
							<p>&copy; 2025 Hoang Do. All rights reserved.</p>
						</div>
					</div>
				</body>
			</html>
		`;
	},
};
module.exports = template_html;
