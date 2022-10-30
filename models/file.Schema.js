const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
	{
		Contributor: {
			type: String,
			required: true,
		},

		isAdmin: {
			type: Boolean,
			default: false,
		},

		Institute: {
			type: String,
			required: [true, "Please enter the name of Institute"],
		},

		Year: {
			type: Number,
			required: [true, "Please enter the year"],
		},

		Semester: {
			type: Number,
			required: [true, "Please enter the semester number"],
		},

		Department: {
			type: String,
			required: [true, "Please enter your Department"],
		},

		url: {
			type: String,
			required: true,
			default: "hello",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("files", fileSchema);
