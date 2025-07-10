import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();

// Start scheduled jobs only in production
if (process.env.NODE_ENV === "production") job.start();

// Middlewares
app.use(rateLimiter);
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Main transactions route
app.use("/api/transactions", transactionsRoute);

// ✅ Root route for browser users (instead of showing "Cannot GET /")
app.get("/", (req, res) => {
  res.send("🚀 Wallet API is running!");
});


// ❌ Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Routes
app.use("/api/transactions", transactionsRoute);

// ✅ Add this default route for base URL
app.get("/", (req, res) => {
  res.send("🚀 Wallet API is running!");
});


// Start server after DB is initialized
const PORT = process.env.PORT || 5001;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("✅ Server is up and running on PORT:", PORT);
  });
});
