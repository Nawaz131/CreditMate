const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    // Step 1: Get data
    const { name, shopName, email, password, phone } = req.body;

    // Step 2: Validate fields
    if (!name || !shopName || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Step 3: Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Step 4: Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Step 5: Create user
    const newUser = await User.create({
      name,
      shopName,
      email,
      phone,
      password: hashedPassword,
    });

    // Step 6: Send response
    return res.status(201).json({
      message: "Signup successful",
      data: {
        id: newUser._id,
        name: newUser.name,
        shopName: newUser.shopName,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    // Step 7: Handle error
    return res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    // Step 1: Get data
    const { email, password } = req.body;

    // Step 2: Validate fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Step 3: Find user
    const user = await User.findOne({ email });

    // Step 4: Check user
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Step 5: Compare password
    const isPasswordMatch = await bcryptjs.compare(
      password,
      user.password
    );

    // Step 6: Check password
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Step 7: Generate token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Step 8: Send response
    return res.status(200).json({
      message: "Login Successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        shopName: user.shopName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  signup,
  login,
};