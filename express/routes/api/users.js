const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const jwtsecret = process.env.JWT_SECRET;

// User Model
const User = require("../../models/User");

// Auth middleware
const auth = require("../../middleware/auth");

// @route GET /users
// @desc Get all USERS
// @access PUBLIC
router.get("/", auth, (req, frontEndRes) => {
	return User.find()
		.sort({ date: -1 })
		.then((users) =>
			frontEndRes.status(200).json({
				err: false,
				users: users,
				success: true,
			})
		)
		.catch((err) => {
			frontEndRes.status(400).json({
				err: true,
				msg: "Users not found...",
				success: false,
			});
		});
});

// @route DELETE /users:ID
// @desc Delete a User
// @access PUBLIC
router.delete("/:id", auth, (req, frontEndRes) => {
	return User.findById(req.params.id).then((user) => {
		user
			.remove()
			.then(() => {
				frontEndRes.status(200).json({
					err: false,
					msg: "User successfully deleted...",
					success: true,
				});
			})
			.catch((err) => {
				frontEndRes.status(404).json({
					err: true,
					msg: "User does not exist...",
					success: false,
				});
			});
	});
});

// @route PUT /users:id
// @desc Edit user
// @access PUBLIC
router.put("/:id", auth, (req, frontEndRes) => {
	const { _id, name, email, password } = req.body;
	let id = _id,
		updatedUser = {
			name,
			email,
			password: null,
		};
	// Simple Validation
	if (!_id || !name || !email) {
		return frontEndRes.status(400).json({
			err: true,
			msg: "Name and Email fields must have a value..",
			success: false,
		});
	}
	if (password) {
		// Create salt & hash
		bcrypt.genSalt(10, (saltErr, salt) => {
			if (saltErr) {
				throw saltErr;
			}
			bcrypt.hash(password, salt, (hashErr, hash) => {
				if (hashErr) {
					throw hashErr;
				}
				updatedUser.password = hash;
			});
		});
	}
	if (!updatedUser.password) delete updatedUser.password;

	User.findByIdAndUpdate(id, updatedUser, { useFindAndModify: false })
		.then((user) => {
			if (user.password) delete user.password;

			return frontEndRes.status(200).json({
				err: false,
				user: user,
				msg: "User successfully updated",
				success: true,
			});
		})
		.catch((err) => {
			return frontEndRes.status(400).json({
				err: true,
				msg: "An error has occurred",
				success: false,
				error: err,
			});
		});
});
//
// @route POST /users
// @desc Create user
// @access PUBLIC
router.post("/", (req, frontEndRes) => {
	const { name, email, password } = req.body;
	let newUser = new User({
		name,
		email,
		password: null,
	});
	console.log("posting request...", req.body);
	// Really Simple Validation
	if (!name || !email || !password) {
		return frontEndRes.status(400).json({
			err: true,
			msg: "Please enter all fields...",
			success: false,
		});
	}

	// Check for existing user
	User.findOne({ $or: [{ name }, { email }] })
		.then((user) => {
			if (user)
				return frontEndRes.status(400).json({
					err: true,
					msg: "User already exists...",
					success: false,
				});
			bcrypt.genSalt(10, (saltErr, salt) => {
				if (saltErr) throw saltErr;

				bcrypt.hash(password, salt, (hashErr, hash) => {
					if (hashErr) throw hashErr;

					newUser.password = hash;
					newUser
						.save()
						.then((user) => {
							delete user.password;
							jwt.sign(
								{ id: user.id },
								jwtsecret,
								{ expiresIn: 3600 },
								(signErr, token) => {
									if (signErr) throw signErr;
									console.log("User successfully created");
									frontEndRes.status(200).json({
										err: false,
										token: token,
										user: {
											id: user.id,
											name: user.name,
											email: user.email,
										},
										msg: "New user successfully created...",
										success: true,
									});
								}
							);
						})
						.catch((err) => {
							console.log(err);
							return frontEndRes.status(400).json({
								err: true,
								msg: "Saving error",
								error: err,
								success: false,
							});
						});
				});
			});
		})
		.catch((err) => {
			console.log(err);
			frontEndRes.status(400).json({
				err: true,
				msg: "Error in updating database...",
				error: err,
				success: false,
			});
		});
});

module.exports = router;
