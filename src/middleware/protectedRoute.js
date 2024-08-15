import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unathorized ~ No provided token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      res.status(401).json({ message: "Unathorized ~ Invalid token" });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) res.status(401).json({ message: "User does not exist" });

    req.user = user
    next()
  } catch (error) {
    console.log("Error sending message", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default protectedRoute
