const { Router } = require("express");
const express = require("express");
const router = express.Router();
const { updateUser, deleteUser, getUser, getAllUsers, updatePic } = require("../controllers/user.Controller");

router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);
router.get("/", getAllUsers);
router.patch("/profilepic/:id", updatePic);

module.exports = router;
