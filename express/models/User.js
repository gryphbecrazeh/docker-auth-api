const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	register_date: {
		type: Date,
		default: Date.now,
	},
	roles: {
		type: Array,
		default: ["base"],
	},
	permissions: {
		type: Array,
	},
});

module.exports = User = mongoose.model("user", UserSchema);
