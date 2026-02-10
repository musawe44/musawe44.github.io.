// admin-tools.js — 7 taps to toggle Admin panel (Test 11:11 + Info)
(() => {
  const TAP_TARGET_SELECTOR = "h1";
  const TAPS_REQUIRED = 7;
  const TAP_RESET_MS = 1200;

  const el = (tag, props = {}, children = []) => {
    const n = document.createElement(tag);
    Object.assign(n, props);
    for (const c of children) n.append(c);
    return n;
  };

  // ===== Force styles (high priority) =====
  const style = el("style", {
    textContent: `
      /* Admin panel always clickable */
      #admPanel, #admPanel *{
        pointer-events: auto !important;
        -webkit-tap-highlight-color: transparent;
      }

      #admPanel{
        position: fixed !important;
        right: 12px !important;
        bottom: 12px !important;
        z-index: 2147483647 !important;
        display: none !important;
        flex-direction: column !important;
        gap: 10px !important;
        width: min(340px, calc(100vw - 24px)) !important;
        padding: 12px !important;
        border-radius: 18px !important;
        border: 1px solid rgba(255,255,255,.18) !important;
        background: rgba(0,0,0,.35) !important;
        backdrop-filter: blur(12px) !important;
        box-shadow: 0 18px 60px rgba(0,0,0,.40) !important;
      }
      body.light #admPanel{
        background: rgba(255,255,255,.70) !important;
        border-color: rgba(0,0,0,.10) !important;
        box-shadow: 0 18px 60px rgba(0,0,0,.16) !important;
      }

      #admPanel.admShow{ display:flex !important; }

      .admHeader{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
      }
      .admTitle{
        font-family: Cairo, system-ui, Arial;
        font-weight: 900;
        font-size: 14px;
        margin: 0;
        color: rgba(255,255,255,.92);
      }
      body.light .admTitle{ color: rgba(10,16,28,.86); }

      .admHint{
        font-family: Cairo, system-ui, Arial;
        font-weight: 900;
        font-size: 12px;
        opacity: .85;
        margin: 0;
        color: rgba(255,255,255,.85);
      }
      body.light .admHint{ color: rgba(10,16,28,.75); }

      .admBtns{
        display:flex;
        gap:8px;
        flex-wrap:wrap;
      }

      .admBtn{
        flex: 1 1 100px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(255,255,255,.10);
        color: rgba(255,255,255,.92);
        padding: 10px 12px;
        border-radius: 14px;
        cursor: pointer;
        font-family: Cairo, system-ui, Arial;
        font-weight: 900;
        white-space: nowrap;
      }
      .admBtn:active{ transform: scale(.98); }
      body.light .admBtn{
        border-color: rgba(0,0,0,.10);
        background: rgba(0,0,0,.04);
        color: rgba(10,16,28,.86);
      }

      /* Modal */
      #admModal{
        position: fixed; inset: 0;
        z-index: 2147483647 !important;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: rgba(0,0,0,.55);
        backdrop-filter: blur(6px);
        pointer-events: auto !important;
      }
      body.light #admModal{ background: rgba(255,255,255,.35); }
      #admModal.show{ display:flex; }

      .admCard{
        width: min(720px, 96vw);
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(0,0,0,.28);
        backdrop-filter: blur(12px);
        padding: 16px;
        color: rgba(255,255,255,.92);
        font-family: Cairo, system-ui, Arial;
        box-shadow: 0 20px 70px rgba(0,0,0,.45);
      }
      body.light .admCard{
        background: rgba(255,255,255,.70);
        border-color: rgba(0,0,0,.10);
        color: rgba(10,16,28,.86);
        box-shadow: 0 20px 70px rgba(0,0,0,.16);
      }
      .admRow{ display:flex; gap:10px; flex-wrap:wrap; margin-top: 10px; }
      .admChip{
        padding: 8px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(255,255,255,.08);
        font-weight: 900;
        font-size: 13px;
      }
      body.light .admChip{
        border-color: rgba(0,0,0,.10);
        background: rgba(0,0,0,.04);
      }
    `
  });
  document.head.appendChild(style);

  // ===== Build panel =====
  const panel = el("div", { id: "admPanel" });

  const header = el("div", { className: "admHeader" }, [
    el("p", { className: "admTitle", textContent: "لوحة الأدمن" }),
    el("p", { className: "admHint", textContent: "7 ضغطات = إظهار/إخفاء" })
  ]);

  const btns = el("div", { className: "admBtns" });
  const btnTest = el("button", { className: "admBtn", textContent: "11:11 (TEST)" });
  const btnInfo = el("button", { className: "admBtn", textContent: "معلومات" });
  const btnHide = el("button", { className: "admBtn", textContent: "إخفاء" });

  btns.append(btnTest, btnInfo, btnHide);
  panel.append(header, btns);
  document.body.appendChild(panel);

  // ===== Modal =====
  const modal = el("div", { id: "admModal" });
  const card = el("div", { className: "admCard" });
  const title = el("h3", { style: "margin:0;font-weight:900;font-size:18px;", textContent: "معلومات" });
  const chips = el("div", { className: "admRow", id: "admChips" });
  const closeBtn = el("button", { className: "admBtn", style: "width:100%;margin-top:12px;", textContent: "إغلاق" });

  card.append(title, chips, closeBtn);
  modal.append(card);
  document.body.appendChild(modal);

  closeBtn.addEventListener("click", () => modal.classList.remove("show"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });

  function setChips(items) {
    chips.innerHTML = "";
    for (const txt of items) chips.append(el("div", { className: "admChip", textContent: txt }));
  }

  // visitors local
  const vKey = "musawi_local_visits";
  const visits = (Number(localStorage.getItem(vKey)) || 0) + 1;
  localStorage.setItem(vKey, String(visits));

  async function pingMs() {
    const t0 = performance.now();
    try {
      await fetch(location.href, { method: "HEAD", cache: "no-store" });
      return Math.round(performance.now() - t0);
    } catch {
      return null;
    }
  }

  btnInfo.addEventListener("click", async () => {
    modal.classList.add("show");
    const lastUpdate = document.lastModified ? new Date(document.lastModified) : null;
    const lastUpdateTxt = lastUpdate ? lastUpdate.toLocaleString("ar-IQ") : "غير معروف";

    setChips([ "Ping: ...", `آخر تحديث: ${lastUpdateTxt}`, `عدد الزيارات (محلي): ${visits}` ]);
    const p = await pingMs();
    setChips([ `Ping: ${p === null ? "غير متاح" : p + "ms"}`, `آخر تحديث: ${lastUpdateTxt}`, `عدد الزيارات (محلي): ${visits}` ]);
  });

  btnHide.addEventListener("click", () => panel.classList.remove("admShow"));

  // TEST 11:11
  btnTest.addEventListener("click", () => {
    if (typeof window.TEST_1111 === "function") {
      window.TEST_1111();
    } else {
      alert("زر TEST جاهز ✅\nلكن لازم event1111.js يعرّف: window.TEST_1111 = () => {...}");
    }
  });

  // ===== 7 taps toggle =====
  const trigger = document.querySelector(TAP_TARGET_SELECTOR) || document.body;
  trigger.style.cursor = "pointer";

  let taps = 0;
  let tmr = null;

  trigger.addEventListener("click", () => {
    taps++;
    clearTimeout(tmr);
    tmr = setTimeout(() => { taps = 0; }, TAP_RESET_MS);
    if (taps >= TAPS_REQUIRED) {
      taps = 0;
      panel.classList.toggle("admShow");
    }
  });
})();
