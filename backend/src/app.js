import express from "express";
import cors from "cors";

const app = express();

// comma separated list in CORS_ORIGIN, falls back to the vite dev server
const origins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];

app.use(cors({ origin: origins }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: Math.round(process.uptime()) });
});

app.use((req, res) => {
  res.status(404).json({ error: `no route for ${req.method} ${req.path}` });
});

// express picks this up as the error handler because of the 4 args
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "server error" });
});

export default app;
