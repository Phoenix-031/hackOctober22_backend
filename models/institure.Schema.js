const mongoose = require("mongoose");

const InstituteSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Institute", InstituteSchema);
