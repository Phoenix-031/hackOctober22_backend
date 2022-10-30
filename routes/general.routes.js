const express = require("express");
const router = express.Router();
const { getList, addList } = require("../controllers/list.Controller");

//general routes for frontend features
router.get("/", getList);
router.post("/", addList);

module.exports = router;
