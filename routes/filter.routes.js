const filterResults = require("../controllers/filter.Controller");
const express = require("express");
const router = express.Router();

//filter routes

router.post("/", filterResults);

module.exports = router;
