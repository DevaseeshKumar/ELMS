const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://employee-leave-management-system.onrender.com"
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
      secure: true,         // ✅ Enable secure cookies for HTTPS
      httpOnly: true,
      sameSite: "none"      // ✅ Required for frontend-backend on different domains
    },
  })
);

app.use("/uploads", express.static("uploads"));
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect MongoDB
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
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "loader.html"));
// });
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
