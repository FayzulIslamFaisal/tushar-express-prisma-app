import { prisma } from "../Db-Connect/Db-Config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new user
// POST /api/auth/register
export const Register = async (req, res) => {
  try {
    const { password, email, name } = req.body;
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ success: false, message: " All Field is required" });
    }
    const userExists = await prisma.Users.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.Users.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        profile: true,
      },
    });
    res
      .status(201)
      .json({ success: true, message: "User created successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// login a user
// POST /api/auth/login

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Field is required" });
    }
    const user = await prisma.Users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
        password: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create a token
    const tokenData = {
      email: user.email,
      name: user.name,
      id: user.id,
      profile: user.profile,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "User logged in",
      user,
      access_token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
