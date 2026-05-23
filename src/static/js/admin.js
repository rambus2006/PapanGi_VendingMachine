// ── 인증 ──
async function doLogin() {
    const pw = document.getElementById("loginInput").value;
    if (!pw) return;

    try {
        const res = await fetch("/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: pw }),
        });
        if (!res.ok) { Toast.error("비밀번호가 틀렸어요"); return; }

        document.getElementById("loginOverlay").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        startClock();
        loadDrinks();
    } catch (e) {
        Toast.error("서버 오류가 발생했습니다");
    }
}

async function doLogout() {
    await fetch("/admin/logout", { method: "POST" }).catch(() => { });
    location.reload();
}

function startClock() {
    const el = document.getElementById("headerTime");
    const tick = () => { el.textContent = new Date().toLocaleTimeString("ko-KR"); };
    tick();
    setInterval(tick, 1000);
}

// ── 탭 전환 ──
function switchTab(name, btn) {
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.getElementById(`tab-${name}`).classList.remove("hidden");
    btn.classList.add("active");

    if (name === "stock") loadStock();
    if (name === "stats") initStats();
}

// ── 음료 관리 ──
let drinks = [];

async function loadDrinks() {
    try {
        const res = await fetch("/admin/drinks");
        if (!res.ok) throw new Error();
        drinks = await res.json();
        renderDrinkTable();
    } catch (e) {
        Toast.error("음료 목록 로드 실패");
    }
}

function renderDrinkTable() {
    const tbody = document.getElementById("drinkTableBody");
    tbody.innerHTML = drinks.map(d => `
    <tr>
      <td>${d.id}</td>
      <td>${d.name}</td>
      <td>₩${d.price.toLocaleString()}</td>
      <td>${d.stock ?? "-"}</td>
      <td>${d.type ?? "can"}</td>
      <td>
        <button class="btn-edit"   onclick="openDrinkModal(${d.id})">수정</button>
        <button class="btn-delete" onclick="deleteDrink(${d.id})">삭제</button>
      </td>
    </tr>
  `).join("");
}

function openDrinkModal(id) {
    const modal = document.getElementById("drinkModal");
    modal.classList.remove("hidden");

    if (id) {
        const d = drinks.find(x => x.id === id);
        document.getElementById("modalTitle").textContent = "음료 수정";
        document.getElementById("modalId").value = d.id;
        document.getElementById("modalName").value = d.name;
        document.getElementById("modalPrice").value = d.price;
        document.getElementById("modalStock").value = d.stock ?? 0;
    } else {
        document.getElementById("modalTitle").textContent = "음료 추가";
        document.getElementById("modalId").value = "";
        document.getElementById("modalName").value = "";
        document.getElementById("modalPrice").value = "";
        document.getElementById("modalStock").value = "";
    }
}

function closeDrinkModal() {
    document.getElementById("drinkModal").classList.add("hidden");
}

async function saveDrink() {
    const id = document.getElementById("modalId").value;
    const name = document.getElementById("modalName").value.trim();
    const price = parseInt(document.getElementById("modalPrice").value);
    const stock = parseInt(document.getElementById("modalStock").value);

    if (!name || isNaN(price)) { Toast.warning("이름과 가격을 입력해주세요"); return; }

    try {
        const url = id ? `/admin/drinks/${id}` : "/admin/drinks";
        const method = id ? "PUT" : "POST";
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, stock }),
        });
        if (!res.ok) throw new Error();

        Toast.success(id ? "수정됐어요" : "추가됐어요");
        closeDrinkModal();
        loadDrinks();
    } catch (e) {
        Toast.error("저장 실패");
    }
}

async function deleteDrink(id) {
    if (!confirm("삭제할까요?")) return;
    try {
        const res = await fetch(`/admin/drinks/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        Toast.success("삭제됐어요");
        loadDrinks();
    } catch (e) {
        Toast.error("삭제 실패");
    }
}

// ── 재고 관리 ──
async function loadStock() {
    try {
        const res = await fetch("/admin/drinks");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const grid = document.getElementById("stockGrid");
        grid.innerHTML = data.map(d => `
      <div class="stock-card">
        <div class="stock-name">${d.name}</div>
        <div class="stock-count">현재: ${d.stock ?? 0}개</div>
        <input type="number" class="stock-input" id="stock-${d.id}" value="${d.stock ?? 0}" min="0" />
        <button class="btn-stock-save" onclick="saveStock(${d.id})">저장</button>
      </div>
    `).join("");
    } catch (e) {
        Toast.error("재고 로드 실패");
    }
}

async function saveStock(id) {
    const val = parseInt(document.getElementById(`stock-${id}`).value);
    if (isNaN(val) || val < 0) { Toast.warning("올바른 수량을 입력해주세요"); return; }
    try {
        const res = await fetch(`/admin/drinks/${id}/stock`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: val }),
        });
        if (!res.ok) throw new Error();
        Toast.success("재고 업데이트 완료");
        loadStock();
    } catch (e) {
        Toast.error("저장 실패");
    }
}

// ── 매출 통계 ──
function initStats() {
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    document.getElementById("dateFrom").value = weekAgo;
    document.getElementById("dateTo").value = today;
    loadStats();
}

async function loadStats() {
    const from = document.getElementById("dateFrom").value;
    const to = document.getElementById("dateTo").value;
    if (!from || !to) { Toast.warning("날짜를 선택해주세요"); return; }

    try {
        const res = await fetch(`/admin/stats?from=${from}&to=${to}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        // 요약 카드
        document.getElementById("statCards").innerHTML = `
      <div class="stat-card">
        <div class="stat-card-label">총 매출</div>
        <div class="stat-card-value">₩${(data.total_revenue ?? 0).toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">총 판매수</div>
        <div class="stat-card-value">${(data.total_sold ?? 0).toLocaleString()}개</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">인기 음료</div>
        <div class="stat-card-value" style="font-size:16px">${data.top_drink ?? "-"}</div>
      </div>
    `;

        // 상세 테이블
        const rows = data.records ?? [];
        document.getElementById("statsTableBody").innerHTML = rows.length
            ? rows.map(r => `
          <tr>
            <td>${r.date}</td>
            <td>${r.drink_name}</td>
            <td>${r.count}개</td>
            <td>₩${r.revenue.toLocaleString()}</td>
          </tr>
        `).join("")
            : `<tr><td colspan="4" style="text-align:center;color:#4a7a55;padding:1rem">데이터 없음</td></tr>`;
    } catch (e) {
        Toast.error("통계 로드 실패");
    }
}