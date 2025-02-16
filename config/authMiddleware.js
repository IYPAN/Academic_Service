const jwt = require("jwt-simple");
const dotenv = require("dotenv");

dotenv.config();

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
        return res.status(401).json({ error: "Access Denied. No Token Provided." });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access Denied. Token is missing." });
    }

    try {
        // Ensure SECRET_KEY is set
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is missing in environment variables.");
        }

        // Decode token
        const decoded = jwt.decode(token, process.env.SECRET_KEY);

        // Check user role
        if (decoded.role !== "academic") {
            return res.status(403).json({ error: "Access Denied. You are not authorized." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ error: "Invalid Token", details: error.message });
    }
};

module.exports = { authenticate };
