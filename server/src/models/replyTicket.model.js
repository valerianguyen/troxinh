// models/ReplyTicket.js
const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const TicketSupport = require("./ticketSupport.model");
const {ENUM_ROLE} = require("../constant");
const ReplyTicket = sequelize.define(
	"ReplyTicket",
	{
		reply_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: TicketSupport,
				key: "ticket_id",
			},
		},
		ticket_reply_by: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isIn: [[...Object.values(ENUM_ROLE)]],
			}
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);

ReplyTicket.belongsTo(TicketSupport, {
	as: "ticket",
	foreignKey: "ticket_id",
	onDelete: "CASCADE",
});
TicketSupport.hasMany(ReplyTicket, {
	as: "replies",
	foreignKey: "ticket_id",
	onDelete: "CASCADE",
})

module.exports = ReplyTicket;
