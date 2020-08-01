const express = require("express");

const mongoose = require("mongoose");

// Port mounted on, expose in docker container
const port = process.env.PORT || 5000;

const app = express();

// MONGO CONFIG
let mongoURL = process.env.MONGO_URI;
let mongoName = process.env.MONGO_DB_NAME;

const MONGO = `mongodb://${mongoURL}/${mongoName}`;

// JSON Middleware
app.use(express.json());

// Connect to MONGO
mongoose
	.connect(MONGO, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log("MongoDB Connected...".green.bold))
	.catch((err) => {
		console.log("connection failed...".red.bold);
		console.log(err);
	});

// USE ROUTES
app.use("/auth-check", require("./routes/api/auth-check"));
app.use("/users", require("./routes/api/users"));
app.use("/", require("./routes/api/auth"));

app.listen(port, () => console.log(`Server is running on ${port}...`));
