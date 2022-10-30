const mongoose = require("mongoose");

const connectDb = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
		});

		console.log(`mongoDB successfully connected to: ${conn.connection.host}`);
	} catch (err) {
		console.log(err);
	}
};

module.exports = connectDb;
