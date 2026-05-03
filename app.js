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


// ⭐ 載入分類 + 建立 UI（兩欄 + 財報風）
async function loadCategories() {

  const res = await fetch("https://https://line-bot-on-render-combine-one.onrender.com/api/categories");
  categories = await res.json(); // ⭐ 注意：不要再用 const 蓋掉

  const container = document.getElementById("form");
  container.innerHTML = "";

  categories.forEach(c => {

    // ⭐ 兩欄
    const col = document.createElement("div");
    col.className = "col-6 mb-2";

    const row = document.createElement("div");
    row.className = "d-flex justify-content-between align-items-center";

    // 類別
    const label = document.createElement("div");
    label.innerText = c;
    label.className = "category-label";

    // 輸入框
    const input = document.createElement("input");
    input.type = "text"; // ⭐ 為了千分位
    input.id = c;
    input.className = "form-control amount-input";
    input.placeholder = "0";

    // ⭐ 千分位 + 即時更新總計
    input.addEventListener("input", () => {
      let value = input.value.replace(/,/g, "");

      if (isNaN(value)) return;

      input.value = value ? Number(value).toLocaleString() : "";

      updateTotal();
    });

    row.appendChild(label);
    row.appendChild(input);
    col.appendChild(row);
    container.appendChild(col);
  });
}


// ⭐ 計算總預算
function updateTotal() {

  let total = 0;

  categories.forEach(c => {
    const input = document.getElementById(c);
    if (!input) return;

    const value = input.value.replace(/,/g, "");
    if (!isNaN(value) && value !== "") {
      total += Number(value);
    }
  });

  document.getElementById("total").innerText = total.toLocaleString();
}


// ⭐ 送出預算（改名：submitBudget）
async function submitBudget() {

  const budgets = {};

  categories.forEach(c => {
    const input = document.getElementById(c);
    let value = input.value.replace(/,/g, "");
    budgets[c] = value ? Number(value) : 0;
  });

  document.getElementById("status").innerText = "送出中...";

  await fetch("https://https://line-bot-on-render-combine-one.onrender.com/api/budget", {
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