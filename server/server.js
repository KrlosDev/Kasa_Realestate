import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

//db
import { connectDB } from "./config/db.js";

//error handlers
import { notFound, errorHandler } from "./middleware/errorHandler.js";

//routes
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
}
//routes
app.use("/api/auth", authRoutes);

//error handlers
app.use("/api", notFound);
app.use("/api", errorHandler);

//choose api behavior based on environment
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.use((req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
