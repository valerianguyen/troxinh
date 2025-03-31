const { ENUM_ROLE } = require('../constant');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');


const createAdmin = async () => {
	const admin = await UserModel.findOne({
		where: {
			usr_email: process.env.ADMIN_EMAIL,
		},
	})
	if (!admin) {
		const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
		await UserModel.create({
			usr_name: process.env.ADMIN_NAME,
			usr_email: process.env.ADMIN_EMAIL,
			usr_password: hashedPassword,
			usr_phone: process.env.ADMIN_PHONE,
			usr_role: ENUM_ROLE.ADMIN,
			usr_avatar: 'https://res.cloudinary.com/drhpxgfnn/image/upload/v1743180048/avatar_oufcgk.jpg',
		});
		console.log('Admin account created successfully!');
	} else {
		console.log('Admin account already exists!');
	}
}
module.exports = createAdmin;