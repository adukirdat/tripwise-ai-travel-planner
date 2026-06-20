import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      avatar: isNonEmptyString(avatar) ? avatar.trim() : undefined
    });

    return res.status(201).json({
      token: generateToken(user._id),
      user: serializeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    const isPasswordValid = user ? await user.comparePassword(password) : false;

    if (!user || !isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.status(200).json({
      token: generateToken(user._id),
      user: serializeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    user: serializeUser(req.user)
  });
};
