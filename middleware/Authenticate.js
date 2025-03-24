import jwt from "jsonwebtoken";
import { prisma } from "../Db-Connect/Db-Config.js";

// headers: {
//     Accept: "application/json",
//     Authorization: `Bearer ${token}`,
// },

const AuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    // Fetch the user from the database
    const user = await prisma.Users.findUnique({
      where: { email: decoded.email },
      select: { id: true, name: true, email: true, profile: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default AuthMiddleware;
