// models/Apartment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const { ENUM_STATUS_VERIFY_APARTMENT } = require("../constant");
const Apartment = require("./apartment.model");
const User = require("./user.model");
// user paid some money to verify apartment
const VerifyApartment = sequelize.define(
	"VerifyApartment",
	{
		ver_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		apart_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Apartment,
				key: "apart_id",
			},
		},
		ver_usr_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "usr_id",
			},
		},
		ver_status: {
			type: DataTypes.SMALLINT,
			defaultValue: ENUM_STATUS_VERIFY_APARTMENT.PENDING,
			validate: {
				isIn: [[...Object.values(ENUM_STATUS_VERIFY_APARTMENT)]],
			},
		},
		// ver_status is done, admin or staff will add reason to this field
		ver_reason: {
			type: DataTypes.TEXT,
		},
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);
Apartment.hasMany(VerifyApartment, { foreignKey: "apart_id", as: "verify_apartment" });
VerifyApartment.belongsTo(Apartment, { foreignKey: "apart_id", as: "apartment" });
User.hasMany(VerifyApartment, { foreignKey: "ver_usr_id", as: "verify_apartment" });
VerifyApartment.belongsTo(User, { foreignKey: "ver_usr_id", as: "user" });
module.exports = VerifyApartment;
