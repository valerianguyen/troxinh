// models/Comment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const User = require("./user.model");
const Apartment = require("./apartment.model");
const { ENUM_COMMENT } = require("../constant");

const Comment = sequelize.define(
	"Comment",
	{
		cmt_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		cmt_rate: {
			type: DataTypes.INTEGER,
			validate: {
				min: 1,
				max: 5,
			},
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
		cmt_content: {
			type: DataTypes.TEXT,
		},
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);

Comment.belongsTo(User, { as: "user", foreignKey: "usr_id", onDelete: "CASCADE" });
Comment.belongsTo(Apartment, { as: "apartment", foreignKey: "apart_id", onDelete: "CASCADE" });
User.hasMany(Comment, { as: "comments", foreignKey: "usr_id", onDelete: "CASCADE" });
Apartment.hasMany(Comment, { as: "comments", foreignKey: "usr_id", onDelete: "CASCADE" });
module.exports = Comment;
