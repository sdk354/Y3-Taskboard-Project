import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

const origins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:5173"];

app.use(cors({ origin: origins }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: Math.round(process.uptime()) });
});

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({ error: `no route for ${req.method} ${req.path}` });
});

// 500 Server Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || "server error",
        ...(err.errors ? { errors: err.errors } : {}),
    });
});

export default app;
