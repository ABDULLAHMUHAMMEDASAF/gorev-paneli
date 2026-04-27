//! 1: HTML'deki elemanları Javascript içine çekiyoruz (Standar işlem)
const userNameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const messageArea = document.getElementById("message");

//! 2: Butona tıklandığında ne olacağını tanımlıyoruz
loginBtn.addEventListener("click", async () => {
  //? Kullanıcının yazdığı bilgileri alalım.
  const userCredentials = {
    username: userNameInput.value.trim(),
    password: passwordInput.value,
  };

  try {
    //! 3: BACKEND' e istek atma (FETCH - Standart)
    //! Backend 5000 portunda çalışıyordu. oraya selam gönderiyoruz.
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST", //? Veriyi gönderdiğimiz için POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userCredentials), //? Veriyi paketleyip yolladık
    });

    const data = await response.json(); //? Sunucudan gelen cevabı açtık
    if (response.ok) {
      //! 4. TOKEN'i ÇEKMECEYE SAKLAMA YERİ (En kritik JWT Adımı!)
      //! Sunucunun gönderdiği o uzun token'i tarayıcı hafızasına kitliyoruz.
      localStorage.setItem("myToken", data.token);
      localStorage.setItem("myRole", data.role);
      window.location.href = "tasks.html";
      messageArea.style.color = "green";
      messageArea.innerText = "Giriş Başarılı! Yönlendiriliyorsunuz...";

      //? 1 saniye sonra görevler sayfasına gidelim. (Onu birazdan oluşturacağız)

      setTimeout(() => {
        window.location.href = "task.html";
      }, 1000);
    } else {
      //! Sunucu hata döndürdüyse (Şifre yanlış vb.)
      messageArea.innerText = data.error;
    }
  } catch (error) {}
});
