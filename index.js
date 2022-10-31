//server imports
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDb = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const fileRoutes = require("./routes/file.routes");
const userRoutes = require("./routes/user.routes");
const listRoutes = require("./routes/general.routes");
const filterRoutes = require("./routes/filter.routes");

const errorHandler = require("./middlewares/error.middleware");

//setting up config config file paths
dotenv.config({ path: "./config/config.env" });

connectDb();

const app = express();
// console.log(process.env);

//middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

//routes
app.get("/", (req, res) => {
	res.status(200).json("server running");
});
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/user", userRoutes);
app.use("/api/list", listRoutes);
app.use("/api/filter", filterRoutes);
// app.get("*", checkUser); // using checkUser middleware for checking current user

app.use(errorHandler);

const PORT = process.env.PORT || 7834;

const server = app.listen(PORT, () => {
	console.log(`server listening on: http://localhost:${PORT}`);
});

// unhandled promise rejection

process.on("unhandledRejection", (err) => {
	console.log(`Error:${err.message}`);
	console.log("shutting down due to unhandled promise rejection");

	server.close(() => {
		process.exit(1);
	});
});
