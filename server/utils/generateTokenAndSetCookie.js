import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, newUser, roleName) => {
  // Generate JWT token
  const token = jwt.sign(
    { userId: newUser._id, email: newUser.email, role: roleName },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Set cookie to maintain session
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};
