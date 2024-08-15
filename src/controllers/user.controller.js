import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const currentUser = req.user._id
        const user = await User.find({_id: {$ne: currentUser}}).select("-password")
        res.status(200).json({users: user})
    } catch (error) {
        console.log("Error Get all users", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}