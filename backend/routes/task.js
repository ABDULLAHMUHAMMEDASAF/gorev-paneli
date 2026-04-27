const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware.js"); // Fedaiyi buraya çağırıyoruz.
const Task = require("../models/Task.js");

//! 1. ROTA: Yeni Görev Ekleme (POST isteği)
router.post("/ekle", verifyToken, async (req, res) => {
  try {
    //? req.body.title -> Standart (Kullanıcının gönderdiği veri)
    //? req.user.id -> Bizim (Fedai'nin karta bakıp req'e eklediği ID)
    const { title } = req.body;

    const newTask = new Task({
      title: title,
      userId: req.user.id, //! İşte burada eşleşme yapıyoruz.
    });

    //? .save() -> STANDART (Mongoose'un veriyi DB'ye kaydetme komutu)
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({
      error: "Görev kaydedilirken bir hata oluştu! Hata: " + error.message,
    });
  }
});

//! 2. ROTA: Sadece giriş yapan kişininin kendi görevlerini listelemesi (GET)
router.get("/listele", verifyToken, async (req, res) => {
  try {
    //? .find() -> STANDART (Veritabanında arama yapan komut)
    //? "Sadece bu kullanıcıya ait görevleri bul" diyoruz
    const myTasks = await Task.find({ userId: req.user.id });
    res.json(myTasks);
  } catch (error) {
    res.status(500).json({ error: "Görevler getirilemedi!" });
  }
});

//! 3. ROTA: Sadece Admin olan kullanıcıyı silebilsin.
router.delete("/sil/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(401).json({ message: "Yalnızca adminler silebilir." });
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask)
      return res.status(404).json({ message: "Görev bulunamadı" });
    res.json({ message: "Görev başarıyla silindi" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Silme işlemi esnasında bir hata meydana geldi." });
  }
});

module.exports = router;
