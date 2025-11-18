import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import Admin from "../model/admin.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access. No token provided",
      });
    }

    // Check token using jwt
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access. User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access. Invalid token",
    });
  }
};

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access. No token provided",
      });
    }

    // Check token using jwt
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const admin = await Admin.findById(decodedToken?._id).select(
      "-password "
    );

    if (!admin) {
      return res.status(401).json({
        message: "Unauthorized access. User not found",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access. Invalid token",
    });
  }
};


