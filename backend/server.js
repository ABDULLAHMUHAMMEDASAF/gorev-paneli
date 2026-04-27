const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/task.js");
const authRoutes = require("./routes/auth.js");
const mongoose = require("mongoose");

dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();

//! APP USE
app.use(cors());
app.use(express.json());

//! APP ROUTES
app.use("/task", taskRoutes);
app.use("/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Bağlantısı Başarılı");
    app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda çalışıyor`));
  })
  .catch((err) => console.log("❌ DB Bağlantı Hatası:", err));
