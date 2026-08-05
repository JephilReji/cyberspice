import { Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/requireAuth";

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      photoUrl: user.photoUrl,
      isVerified: user.isVerified,
      savedAddresses: user.savedAddresses,
    });
  } catch (err) {
    return res.status(500).json({ message: "Could not load profile." });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { name, phone, photoUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { ...(name && { name }), ...(phone && { phone }), ...(photoUrl && { photoUrl }) },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ name: user.name, phone: user.phone, photoUrl: user.photoUrl });
  } catch (err) {
    return res.status(500).json({ message: "Could not update profile." });
  }
}

export async function changePassword(req: AuthRequest, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    }

    const user = await User.findById(req.userId).select("+password");
    if (!user || !user.password) {
      return res.status(400).json({ message: "Cannot change password for Google sign-in accounts." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password changed successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Could not change password." });
  }
}

export async function addAddress(req: AuthRequest, res: Response) {
  try {
    const { label, fullName, company, address, city, state, pincode, phone, isDefault } = req.body;
    if (!fullName || !address || !city || !state || !pincode || !phone) {
      return res.status(400).json({ message: "All address fields are required." });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (isDefault) {
      user.savedAddresses.forEach((a) => { a.isDefault = false; });
    }

    user.savedAddresses.push({ label: label || "Home", fullName, company, address, city, state, pincode, phone, isDefault: !!isDefault });
    await user.save();

    return res.json(user.savedAddresses);
  } catch (err) {
    return res.status(500).json({ message: "Could not add address." });
  }
}

export async function deleteAddress(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.savedAddresses = user.savedAddresses.filter(
      (a: any) => a._id.toString() !== req.params.addressId
    );
    await user.save();

    return res.json(user.savedAddresses);
  } catch (err) {
    return res.status(500).json({ message: "Could not delete address." });
  }
}
