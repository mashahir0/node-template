import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./interfaces/routes/userRoutes";
import adminRoutes from "./interfaces/routes/adminRoutes";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/user", authRoutes);
app.use("/api/admin", adminRoutes);


connectDB();

app.listen(process.env.PORT, () => console.log("Server running on port 3000"));
