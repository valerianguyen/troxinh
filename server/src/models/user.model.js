// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const { ENUM_ROLE } = require("../constant");
const User = sequelize.define(
	"User",
	{
		usr_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		usr_avatar: {
			type: DataTypes.STRING(255),
			defaultValue: "https://picsum.photos/id/237/200/300",
		},
		usr_name: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		usr_role: {
			type: DataTypes.SMALLINT,
			defaultValue: ENUM_ROLE.USER,
			validate: {
				isIn: [[...Object.values(ENUM_ROLE)]],
			},
		},
		usr_phone: {
			type: DataTypes.STRING(15),
		},
		usr_email: {
			type: DataTypes.STRING(100),
			unique: true,
			allowNull: false,
			index: true,
		},
		usr_password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		usr_totals_apartment: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		usr_address: {
			type: DataTypes.STRING(255),
		},
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);

module.exports = User;
