// models/Comment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const User = require("./user.model");
const Apartment = require("./apartment.model");

const Favorites = sequelize.define(
	"Favorites",
	{
		fav_id: {
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
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);

Favorites.belongsTo(User, { as: "user", foreignKey: "usr_id", onDelete: "CASCADE" });
Favorites.belongsTo(Apartment, { as: "apartment", foreignKey: "apart_id", onDelete: "CASCADE" });
User.hasMany(Favorites, { as: "favorites", foreignKey: "usr_id", onDelete: "CASCADE" });
Apartment.hasMany(Favorites, { as: "favorites", foreignKey: "apart_id", onDelete: "CASCADE" });
module.exports = Favorites;
