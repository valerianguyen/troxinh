// models/Comment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const Apartment = require("./apartment.model");

const Image = sequelize.define(
	"Image",
	{
		img_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		img_url: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		img_alt: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		apart_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Apartment,
				key: "apart_id",
			},
		},
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);

Image.belongsTo(Apartment, { as: "apartment", foreignKey: "apart_id", onDelete: "CASCADE" });
Apartment.hasMany(Image, { as: "images", foreignKey: "apart_id", onDelete: "CASCADE" });

module.exports = Image;
