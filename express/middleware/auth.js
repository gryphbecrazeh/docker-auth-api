const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function auth(req, res, next) {
	const token = req.header("x-auth-token");
	// Check for token
	if (!token)
		return res.status(401).json({
			err: true,
			msg: "No Token, authorization denied",
			success: false,
		});
	try {
		// Verify token
		const decoded = jwt.verify(token, jwtSecret);
		// Add user from payload
		req.id = decoded.id;
		return next();
	} catch (e) {
		res
			.status(400)
			.json({ err: true, msg: "Token is not valid...", success: false });
	}
}

module.exports = auth;
