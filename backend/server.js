const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();
const path = require("path");

const app = express();

// Check environment
const isProduction = process.env.NODE_ENV === "production";

// Trust proxy for secure cookies on platforms like Render
if (isProduction) {
  app.set("trust proxy", 1);
}

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://employeeleavemanagementsys.netlify.app"
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 60 * 1000, // 10 minutes
      secure: isProduction, // true in production for HTTPS
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

// ✅ Serve uploaded files
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connection
mongoose
  .connect(process.env.mongodburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Import routes
const adminRoutes = require("./routes/AdminRoutes");
const hrRoutes = require("./routes/HrRoutes");
const employeeRoutes = require("./routes/EmployeeRoutes");
const contactRoutes = require("./routes/contactRoutes");

// ✅ Register routes
app.use("/api/admin", adminRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Optional landing route
app.get("/", (req, res) => {
  res.send("ELMS Backend is running.");
});

// ✅ Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
