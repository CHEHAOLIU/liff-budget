let categories = [];
let profile = null;

console.log("APP JS LOADED");

async function init() {

  await liff.init({
    liffId: "2009933896-IKoH3PQY"
  });

  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }

  profile = await liff.getProfile();

  await loadCategories();
}

init();

async function loadCategories() {

  const res = await fetch("https://line-bot-on-render-combine-one.onrender.com/api/categories");
  const categories = await res.json();

  const container = document.getElementById("form");
  container.innerHTML = "";

  categories.forEach(c => {

    // 外層 row
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.marginBottom = "8px";
    row.style.gap = "10px";

    // 類別文字
    const label = document.createElement("div");
    label.innerText = c;
    label.style.width = "120px"; // 固定寬度，對齊用

    // 輸入框
    const input = document.createElement("input");
    input.id = c;
    input.type = "number";
    input.placeholder = "輸入金額";

    // 組合
    row.appendChild(label);
    row.appendChild(input);

    container.appendChild(row);
  });
}

async function sendData() {

  const budgets = {};

  categories.forEach(c => {
    const val = document.getElementById(c).value;
    budgets[c] = Number(val || 0);
  });

  document.getElementById("status").innerText = "送出中...";

  await fetch("https://line-bot-on-render-combine-one.onrender.com/api/budget", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: profile.userId,
      budgets: budgets
    })
  });

  document.getElementById("status").innerText = "✅ 已儲存";
}