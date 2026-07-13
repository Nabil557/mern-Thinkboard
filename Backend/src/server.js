import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/noteRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

// console.log(process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

//middleware
if (process.env.NODE_ENV !== "production") {
    app.use(
    cors({
        origin: "http://localhost:5173",
    }),
  ); // this middleware will allow cross origin requests
}
app.use(express.json()); // this middleware will parse JSON boddies: req.body
app.use(rateLimiter); // this middleware will limit the number of requests to the server

// simple costum middleware
// app.use((req, res, next) =>{
//     console.log(`req method is ${req.method} req URL is ${req.url}`);
//     next();
// });

app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
}

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Connect to MongoDB first, then start the server
connectDB()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    })
    .catch((err) => {
    console.error("Failed to start server due to DB connection error:", err);
    });
