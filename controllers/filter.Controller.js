const File = require("../models/file.Schema");

const filterResults = async (req, res, next) => {
	const { Institute, Year, Semester, Department } = req.body;
	console.log(req.body);
	try {
		// File
		const x = {};
		if (Institute) {
			x[Institute] = Institute;
		}
		if (Year) {
			x[Year] = Year;
		}
		if (Semester) {
			x[Semester] = Semester;
		}
		if (Department) {
			x[Department] = Department;
		}
		const file = await File.find(x);
		// if (file.Institute || file.Year || file.Semester || file.Department) {
		// 	res.status(200).json({
		// 		success: true,
		// 		file,
		// 	});
		// }
		res.json({ file });
		console.log({ file });
	} catch (err) {
		next(err);
	}
};

module.exports = filterResults;
