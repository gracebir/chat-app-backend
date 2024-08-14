import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { fullname, email, password, gender } = req.body;
  if (!fullname | !email | !password | !gender)
    return res.status(401).json({
      message: "Please fill all fields",
    });

  const profilePicMale = `https://avatar.iran.liara.run/public/boy?username=${
    fullname.split(" ")[0]
  }`;
  const profilePicFemale = `https://avatar.iran.liara.run/public/girl?username=${
    fullname.split(" ")[0]
  }`;

  // hash password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  // check if the user exists
  const existUser = await User.findOne({ email });
  if (existUser)
    return res.status(401).json({ message: "User already exists!" });

  const createUser = new User({
    fullname,
    email,
    password: hash,
    gender,
    profilePic: gender === "male" ? profilePicMale : profilePicFemale,
  });

  const user = await createUser.save();

  delete user.password;

  return res.json(user);
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email | !password)
      return res
        .status(401)
        .json({ message: "Please fill the email and password" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User does not exists" });
    const matched = bcrypt.compare(password, user.password);
    if (!matched)
      return res.status(401).json({ message: "Incorrect password!" });
    generateTokenAndSetCookie(user._id, res);
    return res.status(200).json({
        _id: user.id,
        email: user.email,
        fullname: user.fullname,
        profilePic: user.profilePic,
        gender: user.gender
    })
  } catch (error) {
    console.log(error)
  }
};

export const signout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        return res.status(200).json({
            message: "Logout successfully"
        })
    } catch (error) {
        console.log("Error logout", error.message)
        res.status(500).json({message: "Internal server error"})
    }
};
