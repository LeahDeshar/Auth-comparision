import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, JWT_SECRET); // Verify the token
      req.user = decodedToken; // Attach the decoded token to the request object
      console.log("req user", req.user);
    } catch (err) {
      console.error("Token verification failed:", err);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  next();
};
