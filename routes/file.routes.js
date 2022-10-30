const { getAllFiles, addFile, getFile } = require("../controllers/file.Controller");
const express = require("express");
const router = express.Router();

//file routes

router.get("/getall", getAllFiles);
router.post("/postFiles", addFile);
router.get("/getFile/:fileId", getFile);

module.exports = router;
