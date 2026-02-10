// admin-tools.js — Admin buttons hidden + 7 taps to reveal + Info modal
(() => {
  // ===== Settings =====
  const TAP_TARGET_SELECTOR = "h1";    // يضغط 7 مرات على عنوان MUSAWI
  const TAPS_REQUIRED = 7;
  const TAP_RESET_MS = 1200;

  // ===== Helpers =====
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, props = {}, children = []) => {
    const n = document.createElement(tag);
    Object.assign(n, props);
    for (const c of children) n.append(c);
    return n;
  };

  // ===== Inject minimal styles =====
  const style = el("style", {
    textContent: `
      .admWrap{
        position: fixed;
        right: 12px;
        bottom: 12px;
        z-index: 99999;
        display: none;
        gap: 8px;
        align-items: center;
        padding: 10px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(0,0,0,.22);
        backdrop-filter: blur(10px);
      }
      body.light .admWrap{
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
      .admModal{
        position: fixed; inset: 0;
        z-index: 100000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: rgba(0,0,0,.55);
        backdrop-filter: blur(6px);
      }
      body.light .admModal{ background: rgba(255,255,255,.35); }
      .admModal.show{ display:flex; }

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
      .admTitle{
        margin: 0 0 10px;
        font-weight: 900;
        font-size: 18px;
      }
      .admRow{
        display:flex;
        gap:10px;
        flex-wrap: wrap;
        margin-top: 10px;
      }
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
      .admClose{
        margin-top: 12px;
        width: 100%;
      }
    `
  });
  document.head.appendChild(style);

  // ===== Build UI (hidden by default) =====
  const wrap = el("div", { className: "admWrap", id: "admWrap" });

  const btn1111 = el("button", { className: "admBtn", textContent: "11:11" });
  const btnInfo = el("button", { className: "admBtn", textContent: "معلومات" });

  wrap.append(btn1111, btnInfo);
  document.body.appendChild(wrap);

  // ===== Info modal =====
  const modal = el("div", { className: "admModal", id: "admModal" });
  const card = el("div", { className: "admCard" });
  const title = el("h3", { className: "admTitle", textContent: "لوحة معلومات" });

  const chips = el("div", { className: "admRow", id: "admChips" });
  const closeBtn = el("button", { className: "admBtn admClose", textContent: "إغلاق" });

  card.append(title, chips, closeBtn);
  modal.append(card);
  document.body.appendChild(modal);

  closeBtn.addEventListener("click", () => modal.classList.remove("show"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });

  function setChips(items) {
    chips.innerHTML = "";
    items.forEach(txt => chips.append(el("div", { className: "admChip", textContent: txt })));
  }

  // ===== Visitors (local only) =====
  // ملاحظة: هذا عداد "محلي" لكل جهاز/متصفح فقط (بدون سيرفر ما نكدر نعدّ الزوار الحقيقيين)
  const vKey = "musawi_local_visits";
  const visits = (Number(localStorage.getItem(vKey)) || 0) + 1;
  localStorage.setItem(vKey, String(visits));

  // ===== Ping (lightweight) =====
  async function pingMs() {
    // نستخدم نفس الأصل (بدون طلبات خارجية)
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

    setChips([
      "Ping: ...",
      `آخر تحديث: ${lastUpdateTxt}`,
      `عدد الزيارات (محلي): ${visits}`
    ]);

    const p = await pingMs();
    setChips([
      `Ping: ${p === null ? "غير متاح" : p + "ms"}`,
      `آخر تحديث: ${lastUpdateTxt}`,
      `عدد الزيارات (محلي): ${visits}`
    ]);
  });

  // ===== 11:11 Test Button =====
  btn1111.addEventListener("click", () => {
    // إذا عندك event1111.js عامل window.TEST_1111
    if (typeof window.TEST_1111 === "function") {
      window.TEST_1111(); // يشغّل الحدث يدويًا
      return;
    }
    // fallback: إذا ما موجود
    alert("زر 11:11 جاهز ✅\nبس لازم يكون عندك event1111.js مفعّل ويعرّف TEST_1111().");
  });

  // ===== 7 taps reveal (toggle) =====
  const trigger = $(TAP_TARGET_SELECTOR) || document.body;
  trigger.style.cursor = "pointer";

  let taps = 0;
  let tmr = null;

  function showAdmin() { wrap.style.display = "flex"; }
  function hideAdmin() { wrap.style.display = "none"; }

  // نخليها Toggle حتى تگدر تخفيها بعدين بنفس 7 ضغطات
  function toggleAdmin() {
    const visible = wrap.style.display !== "none";
    visible ? hideAdmin() : showAdmin();
  }

  // مخفية افتراضيًا
  hideAdmin();

  trigger.addEventListener("click", () => {
    taps++;
    clearTimeout(tmr);
    tmr = setTimeout(() => { taps = 0; }, TAP_RESET_MS);

    if (taps >= TAPS_REQUIRED) {
      taps = 0;
      toggleAdmin();
    }
  });
})();
