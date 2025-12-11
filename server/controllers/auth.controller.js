import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { User } from "../models/userModel.js";
import { Role } from "../models/rolesModel.js";
import { License } from "../models/licensesModel.js";
import { LicenseType } from "../models/licenseTypesModel.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { checkLicenseExpiration } from "../utils/checkLicenseExpiration.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail
} from "../nodemailer/emails.js";

export const signup = async (req, res, next) => {
  try {
    const { email, password, name, lastName, phone, roleName, licenseTypeId } =
      req.body;

    // Fast-fail on required signup fields
    if (!email || !password || !name || !roleName || !licenseTypeId) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, password, name, role, and license type",
      });
    }

    // Only constructora/broker can self-serve signup
    if (roleName !== "constructora" && roleName !== "broker") {
      return res.status(403).json({
        success: false,
        message: "Only constructora and broker roles can sign up",
      });
    }

    // Prevent duplicate accounts on email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Resolve role and license type up front
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    
    const licenseType = await LicenseType.findById(licenseTypeId);
    if (!licenseType) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid license type" });
    }

    // Create license for the user
    const emissionDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(
      expirationDate.getDate() + licenseType.durationInDays
    );

    const newLicense = await License.create({
      emissionDate,
      expirationDate,
      idLicenseType: licenseType._id,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const verificationToken = generateVerificationCode();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      lastName: lastName || "",
      phone: phone || "",
      idRole: role._id,
      idLicencia: newLicense._id,
      active: false,
      isVerified: false,
      verificationToken,
      verificationTokenExpire: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Generate token and set cookie
    generateTokenAndSetCookie(res, newUser, roleName);

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Return user data (exclude password)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...newUser._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error signing up",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;
  try {
    // Lookup by issued verification code
    const user = await User.findOne({ verificationToken: verificationCode });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user or expired verification code",
      });
    }
    // Activate account and clear tokens
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    user.active = true;

    await user.save();
    // Send welcome email post-verification
    await sendWelcomeEmail(user.email, user.name);

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error verifying email",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Pull user with role for downstream checks
    const user = await User.findOne({ email: email }).populate("idRole");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    // Validate credentials
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    // Enforce activation and license checks
    const isActive = user.active;
    if (!isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Please verify your email.",
      });
    }
    const role = await Role.findById(user.idRole);

    if (role.name === "constructora" || role.name === "broker") {
      const isLicenseExpired = await checkLicenseExpiration(user.idLicense);
      if (isLicenseExpired) {
        user.active = false;
        await user.save();
        return res.status(403).json({
          success: false,
          message: "License has expired. Deactivating Account.",
        });
      }
    }

    // Ejecutivo requires at least one active constructora link
    if (role.name === "ejecutivo_banco" || role.name === "ejecutivo_ventas") {
      const isConstructoraActive = await User.findOne({
        _id: { $in: user.idsConstructoras },
        active: true,
      });
      if (!isConstructoraActive) {
        user.active = false;
        await user.save();
        return res.status(403).json({
          success: false,
          message: "No active constructora associated. Deactivating Account.",
        });
      }
    }

    // Issue session and record last login
    generateTokenAndSetCookie(res, user, role.name);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiresAt

    await user.save();

    // send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error sending password reset email",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const {resetToken} = req.params;
  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendPasswordResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Authenticated", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}