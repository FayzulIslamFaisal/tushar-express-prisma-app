import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Import the API routes
import ApiRoutes from "./routers/Api.js";
app.use("/api", ApiRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
