const User = require("../model/User.model");
const { sequelize } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

// middleware
const {
  generateToken,
  verifyToken,
} = require("../middleware/jwtAuthentication");
const roleAuthorize = require("../middleware/roleBased");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userRole = role || "user";

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    // Set token in response header
    res.setHeader("Authorization", `Bearer ${token}`);

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.get("/protected", verifyToken, (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Protected route accessed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

// get dummy data from the jsonplace holder api
router.get("/dummy-data", async (req, res) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

// if user is admin then only he can access this route
router.get("/admin-only", verifyToken, roleAuthorize("admin"), (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Admin route accessed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

// if user is employee then only he can access this route
router.get("/employee-only", verifyToken, roleAuthorize("employee"), (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Employee route accessed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

module.exports = router;
