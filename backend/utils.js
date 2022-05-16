import jwt from "jsonwebtoken";
export const generateToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      _id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};
