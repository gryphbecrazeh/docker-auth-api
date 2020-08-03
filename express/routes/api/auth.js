const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const jwtsecret = process.env.JWT_SECRET;

// User Model
const User = require("../../models/User");

// @route POST /
// @desc Authorize User
// @access PUBLIC
router.post("/", (req, frontEndRes) => {
	const { user, password } = req.body;

	// Super Simple Validation
	if (!user || !password) {
		return frontEndRes.status(400).json({
			err: true,
			msg: "Please enter all fields...",
			success: false,
		});
	}

	// Check Existing User
	User.findOne({ $or: [{ user }, { email: user }] }).then((user) => {
		if (!user) {
			return frontEndRes.status(400).json({
				err: true,
				msg: "User Not Found...",
				success: false,
			});
		}
		// Validate Password with BCrypt
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (!isMatch) {
				return frontEndRes.status(400).json({
					err: true,
					msg: "Invalid Credentials",
					success: false,
				});
			}
			jwt.sign(
				{
					id: user.id,
				},
				jwtsecret,
				(err, token) => {
					if (err) throw err;

					delete user.password;
					frontEndRes.json({
						token,
						user: {
							...user,
						},
					});
				}
			);
		});
	});
});

module.exports = router;
