const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  //? title -> Standart/Zorunluü
  //? Kullanıcının req.body içinde gönderdiği görev başlığı buraya gelecek
  title: { type: String, required: true },

  //? completed -> VARSAYILAN (Default)
  //? Yeni görev eklenince otomatik olarak "yapılmadı" (false) olarak başlasın
  completed: { type: Boolean, default: false },

  //? userId -> BİZİM KRİTİK BAĞLANTIMIZ
  //? Bu görev hangi kullanıcıya ait?
  //? Fedai'nin (verifyToken) bize verdiği o req.user.id'yi buraya kaydedeceğiz.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //? User modeline elam gönderiyoruz, "Sahibi orada" diyoruz
    required: true,
  },
  createdAt: { type: Date, defdault: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
