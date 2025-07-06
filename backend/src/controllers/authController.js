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
    await EmailToken.create({ userId: user._id, token });

    const verifyUrl = `https://nagarseva.vercel.app/verify?token=${token}`;

    await sendEmail(
      user.email,
      "Email Verification – Municipal Corporation Helpdesk",
      `Dear ${user.name}, please verify your email address to activate your Municipal Helpdesk account.`,
      `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 16px; margin-bottom: 24px;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Municipal_Corporation_of_Greater_Mumbai_logo.svg/1200px-Municipal_Corporation_of_Greater_Mumbai_logo.svg.png" 
         alt="Municipal Corporation Logo" 
         width="120" 
         style="margin-bottom: 12px;" />
    <h1 style="color: #1e40af; margin: 0; font-size: 20px;">Municipal Corporation</h1>
    <p style="color: #4b5563; margin: 4px 0 0; font-size: 14px;">Citizen Helpdesk Portal</p>
  </div>

  <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 20px; text-align: center;">
    EMAIL VERIFICATION REQUIRED
  </h2>

  <p style="font-size: 15px; color: #374151; line-height: 1.5;">
    Dear <strong>${user.name}</strong>,
  </p>

  <p style="font-size: 15px; color: #374151; line-height: 1.6; margin-top: 16px;">
    Thank you for registering with the Municipal Corporation Helpdesk Portal. To complete your registration and activate your account, please verify your email address by clicking the button below:
  </p>

  <div style="text-align: center; margin: 28px 0;">
    <a href="${verifyUrl}" 
       target="_blank" 
       style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
      VERIFY EMAIL ADDRESS
    </a>
  </div>

  <div style="background-color: #f8fafc; border-left: 4px solid #1e40af; padding: 12px; margin: 20px 0;">
    <p style="font-size: 14px; color: #4b5563; margin: 0; line-height: 1.5;">
      <strong>Important:</strong> This verification link will expire in <strong>1 hour</strong>. 
      If you did not request this verification, please ignore this email or contact our helpdesk immediately.
    </p>
  </div>

  <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 24px;">
    For security reasons, please do not share this email with anyone. Municipal Corporation representatives will never ask you for your password or verification links.
  </p>

  <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 16px;">
    <p style="font-size: 13px; color: #6b7280; text-align: center; margin-bottom: 8px;">
      <strong>Municipal Corporation Helpdesk</strong><br/>
      Email: helpdesk@municipal.gov.in | Helpline: 1800-XXX-XXXX
    </p>
    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
      This is an auto-generated email. Please do not reply to this message.
    </p>
  </div>
</div>
`
    );

    // ✅ Final response (important!)
    return res.status(201).json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Skip verification check for admin
    if (user.role !== "admin" && !user.isVerified) {
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

    console.log("Token from query:", token);
    console.log("All tokens in DB:", await EmailToken.find({}));

    const emailToken = await EmailToken.findOne({ token: token.trim() });
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

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    // Remove existing tokens
    await EmailToken.deleteMany({ userId: user._id });

    const token = crypto.randomBytes(32).toString("hex");
    await EmailToken.create({ userId: user._id, token });

    const verifyUrl = `https://nagarseva.vercel.app/verify?token=${token}`;

    await sendEmail(
      user.email,
      "Email Verification – MBMC Helpdesk",
      `Dear ${user.name}, please verify your email address to activate your MBMC Helpdesk account.`,
      `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 16px; margin-bottom: 24px;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Municipal_Corporation_of_Greater_Mumbai_logo.svg/1200px-Municipal_Corporation_of_Greater_Mumbai_logo.svg.png" 
         alt="MBMC Logo" 
         width="120" 
         style="margin-bottom: 12px;" />
    <h1 style="color: #1e40af; margin: 0; font-size: 20px;">Municipal Corporation of Greater Mumbai</h1>
    <p style="color: #4b5563; margin: 4px 0 0; font-size: 14px;">Public Grievance Redressal System</p>
  </div>

  <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 20px; text-align: center;">
    EMAIL VERIFICATION REQUIRED
  </h2>

  <p style="font-size: 15px; color: #374151; line-height: 1.5;">
    To,<br/>
    <strong>${user.name}</strong><br/>
    ${user.email}
  </p>

  <p style="font-size: 15px; color: #374151; line-height: 1.6; margin-top: 16px;">
    Thank you for registering with the MBMC Helpdesk Portal. To complete your registration and activate your account, please verify your email address by clicking the button below:
  </p>

  <div style="text-align: center; margin: 28px 0;">
    <a href="${verifyUrl}" 
       target="_blank" 
       style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
      VERIFY EMAIL ADDRESS
    </a>
  </div>

  <div style="background-color: #f8fafc; border-left: 4px solid #1e40af; padding: 12px; margin: 20px 0;">
    <p style="font-size: 14px; color: #4b5563; margin: 0; line-height: 1.5;">
      <strong>Important:</strong> This verification link will expire in <strong>1 hour</strong>. 
      If you did not request this verification, please ignore this email or contact our helpdesk immediately.
    </p>
  </div>

  <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 24px;">
    For security reasons, please do not share this email with anyone. MBMC representatives will never ask you for your password or verification links.
  </p>

  <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 16px;">
    <p style="font-size: 13px; color: #6b7280; text-align: center; margin-bottom: 8px;">
      <strong>MBMC Helpdesk Support</strong><br/>
      Municipal Corporation of Greater Mumbai<br/>
      Tel: 1800-XXX-XXXX | Email: helpdesk@mbmc.gov.in
    </p>
    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
      This is an auto-generated email. Please do not reply to this message.
    </p>
  </div>
</div>
`
    );

    res.json({ message: "Verification email resent" });
  } catch (err) {
    console.error("Error in resendVerification:", err);
    res.status(500).json({ message: "Server error" });
  }
};
