require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const sequelize = require("./dbs/init.mysql");
const allowedOrigins = [
	'http://localhost:5173',
];

const corsOptions = {
	origin: (origin, callback) => {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, origin);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true, // Enable credentials
};

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(helmet());
app.use(
	compression({
		level: 6,
		threshold: 100 * 1000, // if file is compressed when storage > 100kb
	}),
);
app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

// app.use("/", require("./routes"));

sequelize
	.sync({ force: false }) // Set force: true to drop tables and recreate them
	.then(() => {
		console.log("Database & tables created!");
	})
	.catch((err) => {
		console.error("Error creating tables:", err);
	});
// routes/userRoutes.js

app.use("/api/", require("./routes"));


app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});
app.use((error, req, res, next) => {
	const statusCode = error.status || 500;
	const errorResponse = {
		message: error.status == 500 ? "Internal Server Error" : error.message,
		code: statusCode,
		status: "error",
	};
	console.error(error.stack);
	if (process.env.NODE_ENV === "dev") errorResponse.stack = error.stack;
	return res.status(statusCode).json(errorResponse);
});
module.exports = app;
