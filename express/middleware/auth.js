const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function auth(req, res, next) {
	const token = req.header("x-auth-token");
	console.log(token);
	// Check for token
	if (!token)
		return res.status(401).json({ msg: "No Token, authorization denied" });
	try {
		// Verify token
		const decoded = jwt.verify(token, jwtSecret);

		// Add user from payload
		req.user = decoded;
		console.log(decoded);
		next();
	} catch (e) {
		console.log("token validation failed...");
		res
			.status(400)
			.json({ err: true, msg: "Token is not valid", success: false });
	}
}

module.exports = auth;
