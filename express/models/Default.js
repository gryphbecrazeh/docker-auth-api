// CHANGE DEFAULT TO THE NEW MODEL
//
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DEFAULTSchema = new Schema({
	DEFAULT: {
		type: String,
		required: true,
	},
	DEFAULT_date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = DEFAULT = mongoose.model("DEFAULT", DEFAULTSchema);
