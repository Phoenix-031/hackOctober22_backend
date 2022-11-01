const cloudinary = require("cloudinary").v2;

// cloudinary.config({
// 	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// 	api_key: process.env.CLOUDINARY_API_KEY,
// 	api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
	cloud_name: "drwrctrgz",
	api_key: "633482449759686",
	api_secret: "zSAhCITYy6i7_oRyCH3N0MT4oQE",
});

module.exports = cloudinary;
