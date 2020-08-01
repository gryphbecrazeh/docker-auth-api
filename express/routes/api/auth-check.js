const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const jwtsecret = process.env.JWT_SECRET;

const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/User");

// @route POST /
// @desc Authorize User
// @access PUBLIC
router.post("/", (req, frontEndRes) => {
	const { user } = req;
	console.log("auth-check hit...");
	// Super Simple Validation
	if (!user) {
		console.log("decode failed...");
		return frontEndRes.status(400).json({
			err: true,
			msg: "An error has occurred in AUTH-CHECK...",
			success: false,
		});
	}
	console.log(user);
	// Check Existing User
	// User.findOne({ email: user }).then((user) => {
	// 	if (!user) {
	// 		return frontEndRes.status(400).json({
	// 			err: true,
	// 			msg: "User Not Found...",
	// 			success: false,
	// 		});
	// 	}
	// 	// Validate Password with BCrypt
	// 	bcrypt.compare(password, user.password).then((isMatch) => {
	// 		if (!isMatch) {
	// 			return frontEndRes.status(400).json({
	// 				err: true,
	// 				msg: "Invalid Credentials",
	// 				success: false,
	// 			});
	// 		}
	// 		jwt.sign(
	// 			{
	// 				id: user.id,
	// 			},
	// 			jwtsecret,
	// 			(err, token) => {
	// 				if (err) throw err;
	// 				delete user.password;
	// 				frontEndRes.json({
	// 					token,
	// 					user: {
	// 						...user._doc,
	// 					},
	// 				});
	// 			}
	// 		);
	// 	});
	// });
});

// @route GET /user
// @desc Get User data
// @access Private
router.get("/user", auth, (req, frontEndRes) => {
	User.findById(req.user.id)
		.select("-password")
		.then((user) => frontEndRes.json(user))
		.catch((err) =>
			frontEndRes.status(400).json({
				err: true,
				msg: "User data not found...",
				success: false,
			})
		);
});

module.exports = router;
