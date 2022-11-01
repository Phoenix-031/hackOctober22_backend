const File = require("../models/file.Schema");

const filterResults = async (req, res, next) => {
	const { Institute, Year, Semester, Department } = req.body;
	console.log(Institute, Year, Semester, Department);

	try {
		// File
		const x = {};
		if (Institute) {
			x["Institute"] = Institute;
		}
		if (Year) {
			x["Year"] = Year;
		}
		if (Semester) {
			x["Semester"] = Semester;
		}
		if (Department) {
			x["Department"] = Department;
		}
		const file = await File.find(x);
		res.json({
			success: true,
			files: file,
		});
	} catch (err) {
		next(err);
	}
};

module.exports = filterResults;
