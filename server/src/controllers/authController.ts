import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User";
import { Otp } from "../models/Otp";
import { sendOtpEmail } from "../config/email";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function toAuthUser(user: any) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    photoUrl: user.photoUrl,
  };
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Step 1: Send OTP to email before registering
export async function sendOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "An account with this email already exists." });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await Otp.deleteMany({ email }); // Clear old OTPs
    await Otp.create({ email, otp, expiresAt });
    await sendOtpEmail(email, otp);

    return res.json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({ message: "Could not send OTP. Please try again." });
  }
}

// Step 2: Verify OTP + complete registration
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, phone, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "Name, email, password and OTP are required." });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) return res.status(400).json({ message: "OTP not found. Please request a new one." });
    if (otpRecord.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });
    if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: "OTP has expired. Please request a new one." });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "An account with this email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      isVerified: true,
    });

    await Otp.deleteMany({ email }); // Clean up

    const token = signToken(user._id.toString());
    return res.status(201).json({ token, user: toAuthUser(user) });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user._id.toString());
    return res.json({ token, user: toAuthUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function googleLogin(req: Request, res: Response) {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "Missing Google idToken." });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(401).json({ message: "Invalid Google token." });
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        googleId: payload.sub,
        isVerified: true, // Google accounts are pre-verified
        photoUrl: payload.picture,
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      if (payload.picture && !user.photoUrl) user.photoUrl = payload.picture;
      await user.save();
    }

    const token = signToken(user._id.toString());
    return res.json({ token, user: toAuthUser(user) });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(401).json({ message: "Google sign-in failed." });
  }
}
