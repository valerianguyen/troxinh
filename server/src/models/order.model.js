// models/Order.js
const { DataTypes, or } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const User = require("./user.model");
const Apartment = require("./apartment.model");
const { ENUM_ORDER } = require("../constant");

const Order = sequelize.define(
	"Order",
	{
		order_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		order_code: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		order_status: {
			type: DataTypes.INTEGER,
			defaultValue: ENUM_ORDER.PENDING,
			validate: {
				isIn: [[...Object.values(ENUM_ORDER)]],
			},
		},
		order_amount: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		order_info: {
			type: DataTypes.STRING,
			allowNull: true,
			// like "Pay for 10 days to boost priority (1|2|3)"
		},
		order_pay_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		order_usr_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "usr_id",
			},
		},
		order_apart_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Apartment,
				key: "apart_id",
			},
		},
		order_note: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		order_bank_tran_no: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		order_transaction_no: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		order_bank_code: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		order_type:{
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		order_data:{
			type: DataTypes.STRING,
			allowNull: true,
		}
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);

Order.belongsTo(User, { as: "user", foreignKey: "order_usr_id", onDelete: "CASCADE" });
Order.belongsTo(Apartment, { as: "apartment", foreignKey: "order_apart_id", onDelete: "CASCADE" });
User.hasMany(Order, { as: "orders", foreignKey: "order_usr_id", onDelete: "CASCADE" });
Apartment.hasMany(Order, { as: "orders", foreignKey: "order_apart_id", onDelete: "CASCADE" });
module.exports = Order;
