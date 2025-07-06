import User from "../models/User.js";
import EmailToken from "../models/EmailToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role: "citizen",
      isVerified: false,
    });

    const token = crypto.randomBytes(32).toString("hex");

    await EmailToken.create({
      userId: user._id,
      token,
    });

    const verifyUrl = `https://nagarseva.vercel.app/verify?token=${token}`;

    const sent = await sendEmail(
      user.email,
      "Verify your email – MBMC Helpdesk",
      `Hi ${user.name}, please verify your email.`,
      `<p>Hello ${user.name},</p>
       <p>Click the link below to verify your email and activate your account:</p>
       <a href="${verifyUrl}" target="_blank">Verify Email</a>
       <p>This link will expire in 1 hour.</p>`
    );

    if (!sent) {
      // Optional: delete unverified user if email fails
      await User.findByIdAndDelete(user._id);
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    res.status(201).json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("❌ Error in loginUser:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const emailToken = await EmailToken.findOne({ token });
    if (!emailToken)
      return res.status(400).json({ message: "Invalid or expired token" });

    const user = await User.findById(emailToken.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();
    await emailToken.deleteOne();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Error in verifyEmail:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
