import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";

import authRouter from "./modules/auth/auth.router.js";
import usersRouter from "./modules/users/users.router.js";
import transactionsRouter from "./modules/transactions/transactions.router.js";
import dashboardRouter from "./modules/dashboard/dashboard.router.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler — must be last
app.use(errorHandler);

export default app;
