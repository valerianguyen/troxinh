// models/TicketSupport.js
const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const User = require("./user.model");
const { ENUM_STATUS_TICKET } = require("../constant");

const TicketSupport = sequelize.define(
	"TicketSupport",
	{
		ticket_id: {
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
		ticket_title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ticket_content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		staff_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: User,
				key: "usr_id",
			},
		},
		ticket_status: {
			type: DataTypes.SMALLINT,
			defaultValue: ENUM_STATUS_TICKET.PENDING,
			validate: {
				isIn: [[...Object.values(ENUM_STATUS_TICKET)]],
			},
		},
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);

TicketSupport.belongsTo(User, { as: "user", foreignKey: "usr_id", onDelete: "CASCADE" });
TicketSupport.belongsTo(User, { as: "staff", foreignKey: "staff_id", onDelete: "CASCADE" });
User.hasMany(TicketSupport, {
	as: "staff_tickets",
	foreignKey: "staff_id",
	onDelete: "CASCADE",
})
User.hasMany(TicketSupport, {
	as: "user_tickets",
	foreignKey: "usr_id",
	onDelete: "CASCADE",
})



module.exports = TicketSupport;
