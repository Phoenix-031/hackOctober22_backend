const File = require("../models/file.Schema");
const cloudinary = require("../config/cloudinary");
const ErrorResponse = require("../utils/errResponse");

const getAllFiles = async (req, res, next) => {
	try {
		console.log("something");
	} catch (err) {
		next(err);
	}
};

const addFile = async (req, res, next) => {
	const { Contributor, Institute, Year, Semester, Department, FilePath } = req.body;
	// console.log(FilePath);

	const uploadToCloudinary = await cloudinary.uploader.upload(FilePath, {
		upload_preset: "fklkso3m",
	});

	try {
		if (uploadToCloudinary) {
			const { url } = uploadToCloudinary;

			const file = new File({
				Contributor,
				Institute,
				Year,
				Semester,
				Department,
				url,
			});

			const savedupload = await file.save();

			res.status(200).json({
				success: true,
				savedupload,
			});
		} else {
			return new ErrorResponse("File could not be uploaded", 400);
		}
	} catch (err) {
		next(err);
	}
};

const getFile = async (req, res, next) => {
	try {
		console.log("something");
	} catch (err) {
		next(err);
	}
};

module.exports = { getAllFiles, getFile, addFile };
