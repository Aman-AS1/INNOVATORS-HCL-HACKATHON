import User from "../model/user.model.js";
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

const generateRefreshToken = (id) => {
  return jwt.sign(
    {
      _id: id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = generateAccessToken(user._id, user.email);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Error generating tokens");
  }
};


const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
    });

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      return res
        .status(500)
        .json({ message: "Something went wrong while registering the user" });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: createdUser,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!(username || email) || !password) {
      return res.status(400).json({
        message: "Username or Email is required along with Password",
      });
    }

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

  
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    await user.save( refreshToken,{ validateBeforeSave: false })

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Login successful",
        user: loggedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

// 3. Logout User
const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,  // new here means that , we need the updated values from monogoose 
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
        message: "User Logout Success",
      });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

// 4. Refresh Access Token
const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "Unauthorized request",
      });
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(401).json({
        message: "Refresh token is expired or used",
      });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Access token refreshed",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error("Error in refreshAccessToken:", error);
    return res.status(401).json({
      message: error?.message || "Invalid refresh token",
    });
  }
};


const editProfile = async (req, res) => {
  try {
    const user = req.user; 
    const userId = user._id;

    const { age, allergies, medications, gender, height, weight } = req.body;

    
    if (req.body.email || req.body.username) {
      return res.status(400).json({
        success: false,
        error: "Email and username cannot be updated",
      });
    }

    const updatedData = {};

    if (age !== undefined) updatedData.age = age;
    if (gender !== undefined) updatedData.gender = gender;
    if (height !== undefined) updatedData.height = height;
    if (weight !== undefined) updatedData.weight = weight;

    if (Array.isArray(allergies)) updatedData.allergies = allergies;
    if (Array.isArray(medications)) updatedData.medications = medications;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("EditProfile Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update profile",
    });
  }
};



export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  editProfile
};
