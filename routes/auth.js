const router = require("express").Router();

// const userController = require('./../controllers/userController');
const authController = require("../controllers/auth-controllers");

router.post('/signup', authController.register, authController.sendOTP);
router.post("/resend-otp", authController.resendOTP);
router.post("/verify", authController.verifyOTP);
router.post('/login', authController.login);

module.exports = router;