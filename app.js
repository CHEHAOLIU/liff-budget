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
  categories = await res.json();

  const container = document.getElementById("form");
  container.innerHTML = "";

  categories.forEach(c => {

    const label = document.createElement("div");
    label.innerText = c;

    const input = document.createElement("input");
    input.id = c;
    input.type = "number";
    input.placeholder = "輸入金額";

    container.appendChild(label);
    container.appendChild(input);
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