const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//! KAYIT OLMA (REGISTER)
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    //? Güvelik: Şifreyi tuzlayıp (salt) hash' lıyoruz.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //? YENİ KULLANICIYI OLUŞTURUYORUZ
    const newUser = new User({
      username: username,
      password: hashedPassword,
      role: role || "user",
    });

    //? VERİTABANINA KAYDET
    await newUser.save();
    res
      .status(201)
      .json({ message: "Yeni kullanıcı başarılı bir şekilde oluşturuldu." });
  } catch (error) {
    res
      .status()
      .json({ error: "Kayıt sırasında bir hata oluştu: " + err.message });
  }
});

//! GİRİŞ YAPMA (LOGIN)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //? 1. ADIM: Kullanıcı var mı?
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı!" });

    //? 2.ADIM: Şifre doğru mu? (Bcrypt kıyaslaması)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Şifre hatalı!" });

    //? 3.ADIM: Yaka Kartını (Token) Hazırlama
    //? İçine Sadece ID ve ROLE koyuyoruz.
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    //? 4.ADIM: Kartı kullanıcıya teslim et
    res
      .status(200)
      .json({ token: token, role: user.role, message: "Giriş başarılı" });
  } catch (error) {
    res.status(500).json({
      error:
        "Sisteme giriş yapılırken bir hata meydana geldi: " + error.message,
    });
  }
});

module.exports = router;
