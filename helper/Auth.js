import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserModel from "../Modals/User.js";

dotenv.config();

const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "Member",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

const verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]?.replace(/^"|"$/g, "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

/** Restrict route to one or more roles. Falls back to DB lookup if JWT has no role (old tokens). */
export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      let role = req.user?.role;
      const userId = req.user?.id || req.user?._id;

      if (!role && userId) {
        const user = await UserModel.findById(userId).select("role");
        role = user?.role;
        if (role) req.user.role = role;
      }

      if (!role || !allowedRoles.includes(role)) {
        return res.status(403).json({
          status: 403,
          message: "Forbidden: you do not have permission for this action",
        });
      }

      next();
    } catch (err) {
      console.error("authorizeRoles error:", err);
      return res.status(500).json({ message: "Authorization check failed" });
    }
  };
};

export const ROLES = {
  ADMINS: ["Admin", "SuperAdmin"],
  MANAGEMENT: ["Admin", "SuperAdmin", "Manager"],
  OPERATIONS: ["Admin", "SuperAdmin", "Manager", "Staff"],
};

export { signInToken, verify };

