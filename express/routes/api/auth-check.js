const express = require("express");

const router = express.Router();

const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/User");

// Cache Expires by default in 100 MINUTES
let cacheExpire = process.env.CACHE_EXPIRE_MINS * 60000 || 100 * 60000;

let cacheEnabled = process.env.CACHE_ENABLED || true;

// Cache associative array, properties accessed by User ID
const cache = [];

const removeFromCache = async (user) => {
	return await setTimeout(() => {
		cache[user.id] = null;
	}, cacheExpire);
};

const setCache = (user) => {
	delete user.password;
	cache[user.id] = user;
	return removeFromCache(user);
};

// @route POST /auth-check
// @desc Check whether a user is valid
// @access PUBLIC
router.get("/", auth, (req, frontEndRes) => {
	const { id } = req;
	// Super Simple Validation
	if (!id) {
		return frontEndRes.status(400).json({
			err: true,
			msg: "Token is not present in storage, or not valid...",
			success: false,
		});
	}
	if (!cache[id]) {
		// Check Existing User
		return User.findById(id)
			.then((user) => {
				if (!user)
					return frontEndRes
						.status(400)
						.json({ err: true, msg: "User not found...", success: false });

				delete user.password;

				if (cacheEnabled) setCache(user);

				return frontEndRes.status(200).json({
					err: false,
					msg: "User successfully validated...",
					user: user,
					success: true,
				});
			})
			.catch((err) => {
				return frontEndRes.status(400).json({
					err: true,
					msg:
						"An error has occurred while attempting to search for the user...",
					error: err,
					success: false,
				});
			});
	}
	return frontEndRes.status(200).json({
		err: false,
		msg: "User successfully validated...",
		user: cache[id],
		success: true,
	});
});

module.exports = router;
