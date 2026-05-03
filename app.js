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

  const res = await fetch("https://line-bot-on-render-combine-one.onrender.com/api/categories");
  categories = await res.json();

  const container = document.getElementById("form");
  container.innerHTML = "";

  categories.forEach(c => {

    // ❌ 刪掉 col-6
    // const col = document.createElement("div");
    // col.className = "col-6 mb-2";

    const item = document.createElement("div");
    item.className = "category-item";

    const label = document.createElement("div");
    label.innerText = c;
    label.className = "category-label";

    const input = document.createElement("input");
    input.type = "text";
    input.id = c;
    input.className = "form-control amount-input";
    input.placeholder = "0";

    input.addEventListener("input", () => {
      let value = input.value.replace(/,/g, "");
      if (isNaN(value)) return;

      input.value = value ? Number(value).toLocaleString() : "";
      updateTotal();
    });

    item.appendChild(label);
    item.appendChild(input);

    container.appendChild(item); // ⭐ 直接丟進 grid container
  });
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