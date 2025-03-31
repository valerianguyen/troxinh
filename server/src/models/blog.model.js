const { DataTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysql");
const User = require("./user.model");
const { ENUM_STATUS_APARTMENT } = require("../constant");
const Blog = sequelize.define(
	"Blog",
	{
		blog_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		blog_title: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		blog_content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		blog_image: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		usr_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "usr_id",
			},
		},
	},
	{
		timestamps: true,
		freezeTableName: true,
	},
);
User.hasMany(Blog, {
	foreignKey: "usr_id",
	as: "blogs",
});
Blog.belongsTo(User, {
	foreignKey: "usr_id",
	as: "user",
});
module.exports = Blog;
