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

    // 一列 row
    const row = document.createElement("div");
    row.className = "row align-items-center mb-2";

    // 左邊：類別
    const labelCol = document.createElement("div");
    labelCol.className = "col-4";
    labelCol.innerText = c;

    // 右邊：輸入框
    const inputCol = document.createElement("div");
    inputCol.className = "col-8";

    const input = document.createElement("input");
    input.type = "number";
    input.id = c;
    input.className = "form-control";
    input.placeholder = "輸入金額";

    inputCol.appendChild(input);

    // 組合
    row.appendChild(labelCol);
    row.appendChild(inputCol);

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