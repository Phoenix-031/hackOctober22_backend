const User = require("../models/auth.Schema");
const ErrorResponse = require("../utils/errResponse");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getUser = async (req, res, next) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);

		if (!user) {
			return new ErrorResponse("No such user found", 404);
		}

		const { password, ...userinfo } = user._doc;

		res.status(200).json({
			success: true,
			userinfo,
		});
	} catch (err) {
		next(err);
	}
};

//for admin as well as user
const updateUser = async (req, res, next) => {
	console.log(req.body);
	const decodedparam = jwt.verify(req.params.id, process.env.JWT_SECRET);
	const decodedUserid = jwt.verify(req.body.userId, process.env.JWT_SECRET);

	// console.log(decodedUserid, decodedparam);
	if (decodedparam.id === decodedUserid.id) {
		const salt = await bcrypt.genSalt(5);
		if (req.body.password) {
			req.body.password = await bcrypt.hash(req.body.password, salt);
		}

		try {
			const user = await User.findByIdAndUpdate(
				decodedparam.id,
				{
					$set: req.body,
				},
				{ new: true }
			);

			console.log(user);
			const { password, ...updated } = user._doc;
			res.status(200).json({
				success: true,
				updated,
			});
		} catch (err) {
			req.status(500).json({
				success: false,
				msg: err,
			});
		}
	} else {
		return new ErrorResponse("Invalid user request", 404);
	}
};

//for admin access
const deleteUser = async (req, res, next) => {
	const userId = req.params.id;
	const currentUserId = req.body.currentUserId;

	if (userId == currentUserId) {
		const getuser = User.findById(userId);
		if (!getuser) {
			return new ErrorResponse("Invalid request", 404);
		}

		try {
			await User.findByIdAndRemove(userId);

			res.status(200).json({
				success: true,
				msg: "user deleted successfully",
			});
		} catch (err) {
			next(err);
		}
	} else {
		return new ErrorResponse("Not authorised", 400);
	}
};

//mostly for admin access
const getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find();

		res.status(200).json({
			success: true,
			users,
		});
	} catch (err) {
		next(err);
	}
};

module.exports = { getAllUsers, getUser, deleteUser, updateUser };
