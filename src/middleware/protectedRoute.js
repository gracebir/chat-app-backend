import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectedRoute = async (req, res, next) => {
  try {
    console.log("Cookies: ", req.cookies);  // Log cookies received by the server
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized ~ No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token: ", decoded);  // Log decoded token
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized ~ Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export default protectedRoute
