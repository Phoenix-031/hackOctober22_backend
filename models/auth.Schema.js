const mongoose = require("mongoose");
const { isEmail } = require("validator"); // to validate email
// const bcrypt = require("bcrypt"); //for hashing the password

//user authentication schema
const authSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},

		email: {
			type: String,
			required: [true, "Please enter an email"],
			unique: true,
			lowercase: true,
			validate: [isEmail, "Please enter an valid email"],
		},

		isVerified: {
			type: Boolean,
			default: true,
		},

		password: {
			type: String,
			required: [true, "Please enter an password"],
			minlength: [2, "Password should be atleast 6 charecters"],
		},

		profilePic: {
			type: String,
			default: "some url",
		},

		resetPasswordToken: String,

		resetPasswordExpire: Date,

		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

//using mongoose hooks

// authSchema.pre("save", async function (next) {
// 	const salt = await bcrypt.genSalt(10);
// 	this.password = await bcrypt.hash(this.password, salt);
// 	next();
// });

//static method to logIN user
// authSchema.statics.login = async function (email, password) {
// 	const user = await this.findOne({ email });
// 	console.log(password);
// 	console.log(user.password);
// 	console.log(await bcrypt.compare(password, user.password));

// if (!user) {
// 	// eslint-disable-next-line no-undef
// 	return next(new ErrorResponse("No such user exists", 404));
// }

// const auth = await bcrypt.compare(password, user.password);
// console.log(auth);
// if (auth) {
// 	return user;
// } else {
// 	return "passwords are not equal";
// }

//   if (!user) {

// 	const user = await this.findOne({ username });
// 	if (user) {
// 		const mail = await this.findOne({ email });
// 		if (mail) {
// 			const auth = await bcrypt.compare(password, mail.password);
// 			if (auth) {
// 				return user;
// 			}
// 			throw Error("incorrect password");
// 		}
// 		throw Error("incorrect email");
// 	}
// 	throw Error("Invalid Username");
// };
// };

module.exports = mongoose.model("auth", authSchema);
