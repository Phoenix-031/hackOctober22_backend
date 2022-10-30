const Ins = require("../models/institure.Schema");

const addList = async (req, res, next) => {
	const { name } = req.body;

	try {
		const addName = new Ins({ name });
		const svName = await addName.save();

		res.status(200).json({
			success: true,
			svName,
		});
	} catch (err) {
		next(err);
	}
};

const getList = async (req, res, next) => {
	try {
		const InstituteList = await Ins.find();

		res.status(200).json({
			success: true,
			InstituteList,
		});
	} catch (err) {
		next(err);
	}
};

module.exports = { getList, addList };
