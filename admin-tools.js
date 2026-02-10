// admin-tools.js — Force-hide admin buttons + 7 taps toggle
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

  // ✅ Force CSS (wins over most site CSS)
  const style = el("style", {
    textContent: `
      .admForceHide{ display:none !important; }
      #admWrap{ display:none !important; }
      #admWrap.admShow{ display:flex !important; }

      #admWrap{
        position: fixed;
        right: 12px;
        bottom: 12px;
        z-index: 99999;
        gap: 8px;
        align-items: center;
        padding: 10px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(0,0,0,.22);
        backdrop-filter: blur(10px);
      }
      body.light #admWrap{
        background: rgba(255,255,255,.55);
        border-color: rgba(0,0,0,.10);
      }
      .admBtn{
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
      body.light .admBtn{
        border-color: rgba(0,0,0,.10);
        background: rgba(0,0,0,.04);
        color: rgba(10,16,28,.86);
      }

      /* Modal */
      #admModal{
        position: fixed; inset: 0;
        z-index: 100000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: rgba(0,0,0,.55);
        backdrop-filter: blur(6px);
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
      .admTitle{ margin: 0 0 10px; font-weight: 900; font-size: 18px; }
      .admRow{ display:flex; gap:10px; flex-wrap: wrap; margin-top: 10px; }
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
      .admClose{ margin-top: 12px; width: 100%; }
    `
  });
  document.head.appendChild(style);

  // ✅ hide old buttons if موجودة بالصفحة
  function forceHideOldButtons() {
    const buttons = Array.from(document.querySelectorAll("button, a, div"));
    for (const b of buttons) {
      const t = (b.textContent || "").trim();
      if (t === "11:11" || t === "معلومات" || t === "معلوماتي" || t === "Info") {
        b.classList.add("admForceHide");
      }
    }
  }

  // ===== create our hidden admin UI =====
  const wrap = el("div", { id: "admWrap" });
  const btn1111 = el("button", { className: "admBtn", textContent: "11:11" });
  const btnInfo = el("button", { className: "admBtn", textContent: "معلومات" });
  wrap.append(btn1111, btnInfo);
  document.body.appendChild(wrap);

  // Modal
  const modal = el("div", { id: "admModal" });
  const card = el("div", { className: "admCard" });
  const title = el("h3", { className: "admTitle", textContent: "لوحة معلومات" });
  const chips = el("div", { className: "admRow", id: "admChips" });
  const closeBtn = el("button", { className: "admBtn admClose", textContent: "إغلاق" });
  card.append(title, chips, closeBtn);
  modal.append(card);
  document.body.appendChild(modal);

  closeBtn.addEventListener("click", () => modal.classList.remove("show"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });

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

  function setChips(items) {
    chips.innerHTML = "";
    for (const txt of items) chips.append(el("div", { className: "admChip", textContent: txt }));
  }

  btnInfo.addEventListener("click", async () => {
    modal.classList.add("show");
    const lastUpdate = document.lastModified ? new Date(document.lastModified) : null;
    const lastUpdateTxt = lastUpdate ? lastUpdate.toLocaleString("ar-IQ") : "غير معروف";
    setChips([ "Ping: ...", `آخر تحديث: ${lastUpdateTxt}`, `عدد الزيارات (محلي): ${visits}` ]);
    const p = await pingMs();
    setChips([ `Ping: ${p === null ? "غير متاح" : p + "ms"}`, `آخر تحديث: ${lastUpdateTxt}`, `عدد الزيارات (محلي): ${visits}` ]);
  });

  btn1111.addEventListener("click", () => {
    if (typeof window.TEST_1111 === "function") return window.TEST_1111();
    alert("زر 11:11 جاهز ✅\nلكن event1111.js لازم يعرّف window.TEST_1111()");
  });

  // ===== 7 taps toggle =====
  const trigger = document.querySelector(TAP_TARGET_SELECTOR) || document.body;
  trigger.style.cursor = "pointer";

  let taps = 0;
  let tmr = null;

  function show() { wrap.classList.add("admShow"); }
  function hide() { wrap.classList.remove("admShow"); }

  // ✅ Start hidden
  hide();
  forceHideOldButtons();

  trigger.addEventListener("click", () => {
    taps++;
    clearTimeout(tmr);
    tmr = setTimeout(() => { taps = 0; }, TAP_RESET_MS);
    if (taps >= TAPS_REQUIRED) {
      taps = 0;
      wrap.classList.contains("admShow") ? hide() : show();
    }
  });
})();
