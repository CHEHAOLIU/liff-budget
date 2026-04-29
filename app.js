let profile = null;

// 初始化 LIFF
async function init() {
  await liff.init({
    liffId: "2009933896-IKoH3PQY"
  });

  if (!liff.isLoggedIn()) {
    liff.login();
  }

  profile = await liff.getProfile();
}

init();

// 送出資料
async function sendData() {

  const data = {
    user_id: profile.userId,
    food: Number(document.getElementById("food").value || 0),
    transport: Number(document.getElementById("transport").value || 0),
    fun: Number(document.getElementById("fun").value || 0)
  };

  document.getElementById("status").innerText = "送出中...";

  await liff.sendMessages([
    {
      type: "text",
      text: "budget|" + JSON.stringify(data)
    }
  ]);

  document.getElementById("status").innerText = "✅ 已送出";

  setTimeout(() => {
    liff.closeWindow();
  }, 800);
}