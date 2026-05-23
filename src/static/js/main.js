const SHELF_SIZE = 8;

const STYLE_MAP = [
  { match: /물|워터|아이시스|수소/i, type: "bottle", color: "linear-gradient(180deg,rgba(180,210,240,0.95),rgba(140,180,220,0.9))", textColor: "#335577", icon: "💧" },
  { match: /막걸리|동동주/i, type: "bottle", color: "linear-gradient(180deg,rgba(240,235,220,0.98),rgba(220,210,185,0.95))", textColor: "#665544", icon: "🍶" },
  { match: /밀키스/i, type: "bottle", color: "linear-gradient(180deg,rgba(180,200,240,0.95),rgba(140,170,220,0.9))", textColor: "#334488", icon: "🍼" },
  { match: /옥수수|수염차/i, type: "bottle", color: "linear-gradient(180deg,rgba(210,190,140,0.95),rgba(180,160,100,0.9))", textColor: "#554422", icon: "🌽" },
  { match: /녹차|보리차|현미/i, type: "bottle", color: "linear-gradient(180deg,rgba(160,220,170,0.95),rgba(120,190,130,0.9))", textColor: "#225533", icon: "🍵" },
  { match: /커피|레쓰비|맥심|캔커피/i, type: "can", color: "linear-gradient(180deg,#aa7733,#774422)", icon: "☕" },
  { match: /콜라|코카|COCA/i, type: "can", color: "linear-gradient(180deg,#cc1111,#880000)", icon: "🥤" },
  { match: /펩시/i, type: "can", color: "linear-gradient(180deg,#1133bb,#0a1a77)", icon: "🧃" },
  { match: /사이다|칠성/i, type: "can", color: "linear-gradient(180deg,#22aa44,#116622)", icon: "🥤" },
  { match: /환타|오렌지/i, type: "can", color: "linear-gradient(180deg,#ff8800,#cc5500)", icon: "🍊" },
  { match: /레몬|유자/i, type: "can", color: "linear-gradient(180deg,#ccdd00,#889900)", icon: "🍋" },
  { match: /복숭아|피치/i, type: "can", color: "linear-gradient(180deg,#ffaa66,#cc6633)", icon: "🍑" },
  { match: /맥주|카스|하이트|맥콜/i, type: "can", color: "linear-gradient(180deg,#2255aa,#113377)", icon: "🍺" },
  { match: /에너지|고갈비|핫식스/i, type: "can", color: "linear-gradient(180deg,#2244aa,#112266)", icon: "⚡" },
  { match: /스파클링|탄산/i, type: "can", color: "linear-gradient(180deg,#dd2244,#991133)", icon: "🫧" },
];
const DEFAULT_STYLE = { type: "can", color: "linear-gradient(180deg,#557788,#334455)", icon: "🥤" };

function resolveStyle(drink) {
  if (drink.type && drink.color) return drink;
  const matched = STYLE_MAP.find((s) => s.match.test(drink.name)) || DEFAULT_STYLE;
  return { ...matched, ...drink };
}

function makeLabel(name) {
  if (name.length <= 4) return name;
  const mid = Math.ceil(name.length / 2);
  return name.slice(0, mid) + "\n" + name.slice(mid);
}

// ── 상태 ──
let shelves = [[], [], []];
let allDrinks = [];
let inserted = 0;
let selected = null;

// ── 음료 목록 로드 ──
async function loadDrinks() {
  updateStatus("로딩 중...");
  try {
    const res = await fetch("/drinks");
    if (!res.ok) throw new Error(res.status);
    const raw = await res.json();

    allDrinks = raw.map((d) => ({ ...resolveStyle(d), label: d.label || makeLabel(d.name) }));
    shelves = [[], [], []];
    allDrinks.forEach((d, i) => shelves[Math.floor(i / SHELF_SIZE) % 3].push(d));

    buildShelves();
    updateStatus("동전을 넣어주세요");
  } catch (e) {
    updateStatus("로드 실패");
    Toast.error("음료 목록을 불러올 수 없습니다");
  }
}

// ── 선반 렌더링 ──
function buildShelves() {
  shelves.forEach((shelf, si) => {
    const shelfEl = document.getElementById(`shelf${si + 1}`);
    const priceEl = document.getElementById(`price${si + 1}`);
    shelfEl.innerHTML = "";
    priceEl.innerHTML = "";

    shelf.forEach((d) => {
      const wrap = document.createElement("div");
      wrap.className = "drink";
      wrap.id = `drink-${d.id}`;
      wrap.onclick = () => selectDrink(d.id, wrap);

      const item = document.createElement("div");
      item.className = d.type === "bottle" ? "bottle" : "can";
      item.style.background = d.color;
      if (d.textColor) item.style.color = d.textColor;
      item.textContent = d.label;
      wrap.appendChild(item);
      shelfEl.appendChild(wrap);

      const pc = document.createElement("div");
      pc.className = "price-cell";
      pc.textContent = `₩${d.price.toLocaleString()}`;
      priceEl.appendChild(pc);
    });
  });
  updateAffordability();
}

function updateAffordability() {
  allDrinks.forEach((d) => {
    const el = document.getElementById(`drink-${d.id}`);
    if (!el) return;
    el.classList.toggle("cant-afford", inserted > 0 && inserted < d.price);
  });
  const buyBtn = document.getElementById("btn-buy");
  if (selected) {
    const d = allDrinks.find((x) => x.id === selected.drinkId);
    buyBtn.disabled = !d || inserted < d.price;
  } else {
    buyBtn.disabled = true;
  }
}

function selectDrink(id, el) {
  document.querySelectorAll(".drink").forEach((d) => d.classList.remove("selected"));
  el.classList.add("selected");
  selected = { drinkId: id };
  const d = allDrinks.find((x) => x.id === id);
  updateStatus(`${d.name} — ₩${d.price.toLocaleString()}`);
  updateAffordability();
}

// ── 동전 투입 ──
function insertCoin(amount) {
  inserted += amount;
  document.getElementById("lcd-amount").textContent = `₩ ${inserted.toLocaleString()}`;
  animateCoin(amount);
  updateAffordability();

  if (selected) {
    const d = allDrinks.find((x) => x.id === selected.drinkId);
    updateStatus(inserted >= d.price ? "✓ 구매 가능!" : `₩${(d.price - inserted).toLocaleString()} 더 필요`);
  } else {
    updateStatus(inserted > 0 ? "음료를 선택하세요" : "동전을 넣어주세요");
  }
  Toast.info(`₩${amount.toLocaleString()} 투입 → 누적 ₩${inserted.toLocaleString()}`);
}

function animateCoin(amount) {
  const visual = document.getElementById("coinSlotVisual");
  const coin = document.createElement("div");
  coin.className = "falling-coin";
  coin.textContent = amount >= 1000 ? "🟡" : amount >= 500 ? "🟠" : "⚪";
  visual.appendChild(coin);
  setTimeout(() => coin.remove(), 500);
}

// ── 구매 ──
async function buyDrink() {
  if (!selected) { Toast.warning("음료를 먼저 선택해주세요!"); return; }

  const d = allDrinks.find((x) => x.id === selected.drinkId);
  if (!d) return;
  if (inserted < d.price) { Toast.warning(`₩${(d.price - inserted).toLocaleString()} 부족합니다`); return; }

  try {
    const res = await fetch("/drinks/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drink_id: d.id, money: inserted }),
    });
    const result = await res.json();

    if (!res.ok) { Toast.error(result.detail || "구매 실패"); return; }

    const change = inserted - d.price;
    inserted = 0;
    dispenseAnimation(d, change);
    Toast.success(`${d.name} 나왔습니다! 거스름돈 ₩${change.toLocaleString()}`);
    document.querySelectorAll(".drink").forEach((el) => el.classList.remove("selected"));
    selected = null;
    document.getElementById("lcd-amount").textContent = "₩ 0";
    updateStatus("동전을 넣어주세요");
    updateAffordability();

    if (result.stock !== undefined) {
      const target = allDrinks.find((x) => x.id === d.id);
      if (target) target.stock = result.stock;
      if (result.stock === 0) {
        const el = document.getElementById(`drink-${d.id}`);
        if (el) { el.style.opacity = "0.2"; el.style.pointerEvents = "none"; }
      }
    }
  } catch (e) {
    Toast.error("서버 오류가 발생했습니다");
  }
}

function dispenseAnimation(d, change) {
  const tray = document.getElementById("dispenseTray");
  const content = document.getElementById("dispenseContent");
  content.textContent = "";
  content.className = "dispense-inner empty";

  const falling = document.createElement("div");
  falling.className = "falling-drink";
  falling.textContent = d.icon || "🥤";
  tray.appendChild(falling);

  setTimeout(() => {
    falling.remove();
    content.className = "dispense-inner";
    content.textContent = `${d.icon || "🥤"} ${d.name}${change > 0 ? `  잔돈 ₩${change.toLocaleString()}` : ""}`;
  }, 580);
  setTimeout(() => {
    content.className = "dispense-inner empty";
    content.textContent = "꺼내는 곳";
  }, 3800);
}

// ── 반환/취소 ──
function cancelInsert() {
  if (inserted === 0) { Toast.info("투입된 금액이 없습니다"); return; }
  Toast.info(`₩${inserted.toLocaleString()} 반환됩니다`);
  inserted = 0;
  selected = null;
  document.querySelectorAll(".drink").forEach((el) => el.classList.remove("selected"));
  document.getElementById("lcd-amount").textContent = "₩ 0";
  updateStatus("동전을 넣어주세요");
  updateAffordability();
}

function updateStatus(msg) {
  document.getElementById("lcd-status").textContent = msg;
}

loadDrinks();
