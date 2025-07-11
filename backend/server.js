const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();
const path = require("path");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

// Trust proxy required for secure cookies (Render)
if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://employeeleavemanagementsys.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 60 * 1000,
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax"
    },
  })
);

app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connection
mongoose.connect(process.env.mongodburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Routes
const adminRoutes = require('./routes/AdminRoutes');
const hrRoutes = require('./routes/HrRoutes');
const employeeRoutes = require('./routes/EmployeeRoutes');
const contactRoutes = require("./routes/contactRoutes");

app.use('/api/admin', adminRoutes);
app.use('/api/hr', hrRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/contact", contactRoutes);

// Optional landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
