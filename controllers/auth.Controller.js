const User = require("../models/auth.Schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const ErrorResponse = require("../utils/errResponse");
const sendEmail = require("../utils/sendEmail");
// const sendSms = require("../utils/sendSms");

const registerUser = async (req, res, next) => {
	const { username, email, password } = req.body;

	const token = jwt.sign({ email }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});

	const verifyEmailUrl = `${process.env.VERIFY_EMAIL}/${token}`;

	const message = `
		<h1>Please verify your email before u continue furthur</h1>
		<p>Click here to verify your email: <a href = ${verifyEmailUrl} clicktracking= off><button>Verify Email</button></a></p>
		`;

	const salt = await bcrypt.genSalt(5);
	const hashedpassword = await bcrypt.hash(password, salt);

	const existingUserEmail = await User.findOne({ email });
	const existingUsername = await User.findOne({ username });
	if (existingUserEmail) {
		res.status(200).json({
			success: false,
			msg: "Email not available for registration",
		});
		return;
	} else if (existingUsername) {
		res.status(200).json({
			success: false,
			msg: "Username already in use",
		});
		return;
	}

	try {
		await sendEmail({
			to: email,
			subject: "Verify Email",
			text: message,
		});

		// const user = await User.create({ username, email, password }); //creating user to the database

		const user = new User({
			username,
			email,
			password: hashedpassword,
		});

		const svuser = await user.save();

		sendToken(svuser, 201, res);
	} catch (err) {
		// const errors = handelErrors(err);
		// res.status(400).json({
		// 	success: false,
		// 	msg: errors,
		// });

		next(err);
	}
};

const loginUser = async (req, res, next) => {
	// const { username, email, password } = req.body;
	// try {
	// 	const user = await User.login(username, email, password);
	// 	res.status(200).json({
	// 		success: true,
	// 		user: user._id,
	// 	});
	// } catch (err) {
	// 	const errors = handelErrors(err);
	// 	res.status(400).json({
	// 		success: false,
	// 		msg: errors,
	// 	});
	// }

	const { author, password } = req.body;

	if (!author || !password) {
		res.status(400).json({
			success: false,
			msg: "Please provide valid login credentials",
		});
	}

	try {
		// const getuser = await User.login(email, password);
		// console.log(getuser);

		// if (getuser !== "passwords are not equal") {
		// 	res.status(200).json({
		// 		success: true,
		// 	});
		// } else {
		// 	res.status(400).json({
		// 		success: false,
		// 	});
		// }

		// eslint-disable-next-line no-useless-escape

		// const usr = new User();
		// usr.loginUser(req.body, function (err, response) {
		// 	console.log(err);
		// });

		// eslint-disable-next-line no-useless-escape
		const emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		let getuser;
		if (emailregex.test(author)) {
			getuser = await User.findOne({ email: author });
		} else {
			getuser = await User.findOne({ username: author });
		}

		if (!getuser) {
			return next(new ErrorResponse("No such user exists", 200));
		}

		if (!getuser.isVerified) {
			return next(new ErrorResponse("No such user exists", 200));
			// res.status(404).send({
			// 	success: false,
			// 	error: "No such user exists",
			// });
		}
		console.log(getuser);

		const auth = await bcrypt.compare(password, getuser.password);
		// console.log(auth);

		if (auth) {
			sendLoginToken(getuser, 200, res);
		} else {
			return next(new ErrorResponse("Wrong Credentials", 200));
		}
	} catch (err) {
		next(err);
	}
};

const forgotpassword = async (req, res, next) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });

		//if user exists then send password reset link
		if (!user) {
			return next(new ErrorResponse("Email could not be sent", 404));
		}

		const resetToken = crypto.randomBytes(30).toString("hex");
		user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
		user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

		await user.save();

		const passwordResetUrl = `${process.env.PASSWORD_RESET_URL}/${resetToken}`;

		const message = `
        <h1>You have requested a new password reset</h1>
        <p>Click on this link to reset password: <a href = ${passwordResetUrl} clicktracking= off><button>Reset Password</button></a></p>
        `;

		//sending email for resetting password
		try {
			await sendEmail({
				to: user.email,
				subject: "Reset Password",
				text: message,
			});

			res.status(200).json({
				success: true,
				data: "Email sent successfully",
			});

			return;
		} catch (err) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;

			await User.save();

			return next(new ErrorResponse("Email could not be sent", 500));
		}
	} catch (err) {
		next(err);
	}
};

const resetpassword = async (req, res, next) => {
	try {
		const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			next(new ErrorResponse("invalid reset token", 400));
		}

		// user.password = CryptoJS.AES.encrypt(req.body.password, process.env.ENC_KEY).toString();
		// user.password = req.body.password;
		const salt = await bcrypt.genSalt(5);
		const hashedpassword = await bcrypt.hash(req.body.password, salt);

		user.password = hashedpassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();

		res.status(201).json({
			success: true,
			msg: "Password reset successfully",
		});
	} catch (err) {
		next(err);
	}
};

const verifyUser = async (req, res, next) => {
	const { token } = req.params;

	try {
		if (token) {
			const verifiedUserEmail = jwt.verify(token, process.env.JWT_SECRET);
			if (verifiedUserEmail) {
				const getUser = await User.findOne({
					email: verifiedUserEmail.email,
				});

				if (getUser) {
					getUser.isVerified = true;

					await getUser.save();

					res.status(200).json({
						success: true,
						msg: "user verified successfully",
					});
				} else {
					next(new ErrorResponse("email not verified", 400));
				}
			} else {
				next(new ErrorResponse("Verification link expired!", 422));
			}
		}
	} catch (err) {
		next(err);
	}
};

const handelErrors = (err) => {
	console.log(err.message, err.code);
	const errors = { username: "", email: "", password: "" };

	//incorrect username, email, Password -> for login purpose
	if (err.message === "incorrect email") {
		//incorrect email
		errors.email = "That email is not registered";
		return errors;
	}
	if (err.message === "incorrect password") {
		//incorrect password
		errors.password = "Incorrect Password";
		return errors;
	}
	if (err.message === "Invalid Username") {
		//incorrect username
		errors.username = "No such User exists";
		return errors;
	}

	//validating error for duplicate email code
	if (err.code === 11000) {
		errors.email = "This email is already registered";
		return errors;
	}
	//validating errors
	if (err.message.includes("auth validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}
	return errors;
};

const sendToken = (user, statusCode, res) => {
	const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
	res.status(statusCode).json({
		success: true,
		accessToken,
	});
};

const sendLoginToken = (user, statusCode, res) => {
	const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LOGIN_EXPIRE });
	res.status(statusCode).json({
		success: true,
		accessToken,
	});
};

// const verifyPhoneNumber = (req, res, next) => {
// 	try {
// 		const { phone } = req.body;
// 		sendSms("hi there", phone);

// 		res.status(200).json({
// 			success: true,
// 			msg: "sms sent succcessfully",
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

module.exports = {
	loginUser,
	registerUser,
	resetpassword,
	forgotpassword,
	verifyUser,
	handelErrors,
};
