const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const User = require("./user.model");

const Token = sequelize.define(
	"Token",
	{
		token_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		token_value: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		token_usr_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "usr_id",
			},
		},
		token_time: {
			type: DataTypes.CHAR(13),
			allowNull: false,
		}
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);

Token.belongsTo(User, { foreignKey: "token_usr_id", onDelete: "CASCADE" });
User.hasMany(Token, { foreignKey: "token_usr_id", onDelete: "CASCADE" });

module.exports = Token;
