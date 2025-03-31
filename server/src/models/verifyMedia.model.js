// post verify
// models/Apartment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const Apartment = require("./apartment.model");
const VerifyApartmentMedia = sequelize.define(
	"VerifyApartmentMedia",
	{
		vam_id: {
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
		vam_url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);
Apartment.hasMany(VerifyApartmentMedia, { foreignKey: "apart_id", as: "verify_apartment_media" });
VerifyApartmentMedia.belongsTo(Apartment, { foreignKey: "apart_id", as: "apartment" });
module.exports = VerifyApartmentMedia;
