// models/Apartment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const User = require("./user.model");
const { ENUM_STATUS_APARTMENT } = require("../constant");
const Apartment = sequelize.define(
	"Apartment",
	{
		apart_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		apart_title: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		apart_area: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		apart_price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		apart_address: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		apart_description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		apart_total_room: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
			},
		},
		apart_total_toilet: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 0,
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
		apart_city: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		apart_district: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		apart_ward: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		apart_type: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		apart_category: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		apart_report_reason: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		apart_priority: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		apart_time_start: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		apart_expired_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		apart_status: {
			type: DataTypes.INTEGER,
			defaultValue: ENUM_STATUS_APARTMENT.PENDING,
			validates: {
				isIn: [[...Object.values(ENUM_STATUS_APARTMENT)]],
			},
			// 0 pending, 1: active, 2: block,
			// use status instead apart_isPublished
		},
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
	{
		indexes: [
			{
				unique: true,
				fields: ["apart_title"],
			},
		],
	},
);

Apartment.belongsTo(User, { as: "user", foreignKey: "usr_id", onDelete: "CASCADE" });
User.hasMany(Apartment, { as: "apartments", foreignKey: "usr_id", onDelete: "CASCADE" });
module.exports = Apartment;
