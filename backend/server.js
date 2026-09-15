// server.js

require("dotenv").config(); // Load .env variables FIRST, before anything else

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const db = require("./config/db"); // MySQL connection pool

// ── Route imports ──────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const groupRoutes = require("./routes/groups");
const syncRoutes = require("./routes/sync");

// ── App setup ──────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// ── Global middleware ──────────────────────────────────────────

// helmet() sets secure HTTP headers (e.g. hides that this is Express)
app.use(helmet());

// cors() allows the Android app (and any other client) to call this API.
// In production, replace "*" with your actual server URL.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded bodies (form submissions, if any)
app.use(express.urlencoded({ extended: true }));

// ── Request logger (dev only) ──────────────────────────────────
// Prints every request to the console so the team can see what's hitting the server.
// Remove or replace with a proper logger (e.g. morgan) before final submission.
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ── Health check ───────────────────────────────────────────────
// GET /health — the Android app (or anyone) can ping this to check the server is up.
// No auth required.
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API routes ─────────────────────────────────────────────────
//
// All routes are prefixed with /api so there is never a clash with
// any static files or the health check above.
//
//  /api/auth      → register, login (public)
//  /api/students  → CRUD + search/filter (protected — lecturer or own record)
//  /api/groups    → list groups, assign/transfer students (protected)
//  /api/sync      → offline sync endpoint (protected)

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/sync", syncRoutes);

// ── 404 handler ────────────────────────────────────────────────
// Catches any request that didn't match a route above.
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global error handler ───────────────────────────────────────
// Express calls this whenever next(err) is called inside a route.
// Keeps error responses consistent across the whole API.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[ERROR]", err.stack || err.message);

  // Don't leak stack traces to clients in production
  const message =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : err.message;

  res.status(err.status || 500).json({ error: message });
});

// ── Start ──────────────────────────────────────────────────────
// Test the database connection before accepting requests.
// This catches a wrong password or unreachable host early.
db.getConnection()
  .then((connection) => {
    connection.release(); // immediately return the connection to the pool
    console.log("%MySQL connection pool is ready");

    app.listen(PORT, () => {
      console.log(`!!server running on port ${PORT}`);
      console.log(`   Health check → http://localhost:${PORT}/health`);
      console.log(`   Auth         → http://localhost:${PORT}/api/auth`);
      console.log(`   Students     → http://localhost:${PORT}/api/students`);
      console.log(`   Groups       → http://localhost:${PORT}/api/groups`);
      console.log(`   Sync         → http://localhost:${PORT}/api/sync`);
    });
  })
  .catch((err) => {
    console.error("!Failed to connect to MySQL:", err.message);
    console.error(
      "   Check your .env file — DB_HOST, DB_USER, DB_PASSWORD, DB_NAME"
    );
    process.exit(1); // Exit so the team knows immediately something is wrong
  });

module.exports = app; // exported so the Testing team can import it in tests