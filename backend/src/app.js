import express from "express";
import morgan from "morgan";
import cors from "cors";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Allow CRA dev origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000"
  })
);

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// API
app.use("/api/transactions", transactionRoutes);

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

export default app;
