const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const User = require("./user.model");
const Apartment = require("./apartment.model");
const ReportApartment = sequelize.define(
	"ReportApartment",
	{
		report_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		report_usr_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "usr_id",
			},
		},
		report_apart_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Apartment,
				key: "apart_id",
			},
		},
		report_content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);
ReportApartment.belongsTo(User, { as: "user", foreignKey: "report_usr_id", onDelete: "CASCADE" });
ReportApartment.belongsTo(Apartment, {
	as: "apartment",
	foreignKey: "report_apart_id",
	onDelete: "CASCADE",
});
User.hasMany(ReportApartment, { as: "reports", foreignKey: "report_usr_id", onDelete: "CASCADE" });
Apartment.hasMany(ReportApartment, {
	as: "reports",
	foreignKey: "report_apart_id",
	onDelete: "CASCADE",
});
module.exports = ReportApartment;
