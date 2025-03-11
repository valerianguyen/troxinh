// models/RentRequest.js
const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const User = require("./user.model");
const Apartment = require("./apartment.model");
const { ENUM_RENT_REQUEST } = require("../constant");

const RentRequest = sequelize.define(
	"RentRequest",
	{
		request_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		usr_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "usr_id",
			},
		},
		apart_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Apartment,
				key: "apart_id",
			},
		},
		appointmentTime: {
			type: DataTypes.CHAR(13),
			allowNull: false,
		},
		status: {
			type: DataTypes.SMALLINT,
			defaultValue: ENUM_RENT_REQUEST.PENDING,
			validate: {
				isIn: [[...Object.values(ENUM_RENT_REQUEST)]],
			},
		},
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);

RentRequest.belongsTo(User, { as: "user", foreignKey: "usr_id", onDelete: "CASCADE" });
RentRequest.belongsTo(Apartment, {
	as: "apartment",
	foreignKey: "apart_id",
	onDelete: "CASCADE",
});
User.hasMany(RentRequest, { as: "rent_requests", foreignKey: "usr_id", onDelete: "CASCADE" });
Apartment.hasMany(RentRequest, { as: "rent_requests", foreignKey: "apart_id", onDelete: "CASCADE" });

module.exports = RentRequest;
