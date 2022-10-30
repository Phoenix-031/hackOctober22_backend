const { Router } = require("express");
// const { checkUser } = require("../middlewares/auth.middleware");
const router = Router();

const {
	registerUser,
	loginUser,
	forgotpassword,
	resetpassword,
	verifyUser,
} = require("../controllers/auth.Controller");

//Auth Routes

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/logout", logout_get);
router.patch("/forgotpassword", forgotpassword);
router.put("/resetpassword/:resetToken", resetpassword);
router.get("/verify/:token", verifyUser);
// router.post("/verifyphone", verifyPhoneNumber);

module.exports = router;
