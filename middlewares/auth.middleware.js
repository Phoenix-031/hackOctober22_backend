const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const authSchema = require("../models/auth.Schema");
dotenv.config({ path: "../config/config.env" });

const token_secrt = process.env.JWT_SECRET;

const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;
	//check json web token exists & is verfied
	if (token) {
		jwt.verify(token, token_secrt, (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.redirect("/login");
			} else {
				console.log(decodedToken);
				next();
			}
		});
	} else {
		res.redirect("/login");
	}
};

//check current user -> this middileware can be used for every get request for every page
const checkUser = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, token_secrt, async (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.locals.user = null; //explicitly giving it a null value
				next();
			} else {
				console.log(decodedToken);
				const user = await authSchema.findById(decodedToken.id);
				res.locals.user = user;
				next();
			}
		});
	} else {
		res.locals.user = null;
		next();
	}
};

module.exports = { requireAuth, checkUser };
