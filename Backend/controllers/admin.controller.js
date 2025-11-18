import Admin from "../model/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessToken = (id, email) => {
  return jwt.sign(
    {
      _id: id,
      email: email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};



const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        message: "Admin already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newAdmin = await Admin.create({
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
    });

    const createdAdmin = await Admin.findById(newAdmin._id).select(
      "-password"
    );

    if (!createdAdmin) {
      return res
        .status(500)
        .json({ message: "Something went wrong while registering the admin" });
    }

    return res.status(201).json({
      message: "Admin registered successfully",
      admin: createdAdmin,
    });
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!(username || email) || !password) {
      return res.status(400).json({
        message: "Username or Email is required along with Password",
      });
    }

    // FIXED: check both email and username
    const admin = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // FIXED: check if password exists in DB
    if (!admin.password) {
      return res.status(500).json({ message: "Password missing in database" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(admin._id, admin.email);

    const loggedInAdmin = await Admin.findById(admin._id).select("-password");

    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .json({
        message: "Login successful",
        admin: loggedInAdmin,
        accessToken,
      });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    return res.status(500).json({ message: error.message });
  }
};


// 3. Logout Admin
const logoutAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(
      req.admin._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true, // new here means that , we need the updated values from monogoose
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        message: "Admin Logout Success",
      });
  } catch (error) {
    console.error("Error in logoutAdmin:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};



export { registerAdmin, loginAdmin, logoutAdmin };
