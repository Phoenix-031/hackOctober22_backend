const express = require("express");
const router = express.Router();
const { updateUser, deleteUser, getUser, getAllUsers } = require("../controllers/user.Controller");

router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);
router.get("/", getAllUsers);

module.exports = router;
