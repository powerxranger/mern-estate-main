import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import signUpRoutes from "./routes/signup.routes.js";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();

const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to Mongo"))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

app.listen(3005, () => console.log("server is running on` 3005!"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
