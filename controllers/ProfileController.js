import path from "path";
import fs from "fs";
import { prisma } from "../Db-Connect/Db-Config.js";

export const index = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User profile", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const store = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.files || !req.files.profile) {
      return res.status(400).json({
        success: false,
        message: "No files were uploaded.",
      });
    }

    // Get the uploaded file
    const uploadedFile = req.files.profile;
    const fileName = `${Date.now()}_${uploadedFile.name}`;
    const uploadPath = path.join("public", "images", fileName);

    // Ensure the directory exists
    const dir = path.dirname(uploadPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Move the file to the images directory
    uploadedFile.mv(uploadPath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "File upload failed",
        });
      }

      // Update user profile image in database
      const updatedUser = await prisma.Users.update({
        where: { id: userId },
        data: { profile: `/images/${fileName}` },
      });

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const destroy = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const show = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
