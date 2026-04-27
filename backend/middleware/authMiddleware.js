const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  //? 1. İstekteki başlığı (Header) kontrol et. Kartı nerede taşıyoruz? "Authorization" başlığında.
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res
      .status(401)
      .json({ error: "Yaka kartı (Token) yok! Giriş yapmalısın" });

  //? Token genelde "Bearer <TOKEN>" formatında gelir. Sadece token kısmını alalım.
  const token = authHeader.split(" ")[1];

  try {
    //? 2. Mühür kontrolü (Pentagon anahtarı burada devreye giriyor.)
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    //? 3. Kartın içindeki bilgileri (ID ve ROLE) isteğin içine paketle ki bir sonraki adımda kullanabilelim.
    req.user = verified;

    //? 4. Her şey yolunda, "geçebilirsin" komutu!
    next(); //! Her şey yolunda devam et.
  } catch (error) {
    res.status(403).json({ error: "Geçersiz veya süresi dolmuş Token!" });
  }
};

module.exports = verifyToken;
