// tools.js — أزرار مؤقتة + صفحة معلومات (Ping / Last Update / Visitors)
// يعمل من المتصفح فقط — بدون أي مكتبات

(() => {
  // ========= إعدادات (عدّل هنا فقط) =========
  const LAST_UPDATE_TEXT = "آخر تحديث: اكتب تاريخك هنا"; 
  // مثال: "آخر تحديث: 2026-02-10 01:30 AM"

  const SHOW_TEST_1111_BUTTON = true;   // زر اختبار 11:11
  const SHOW_INFO_BUTTON = true;        // زر معلومات

  // عدد الزوار (محلي لكل جهاز). لو تريد عداد عالمي لازم API خارجي/سيرفر.
  const VISITOR_KEY = "MUSAWI_VISITORS_LOCAL";

  // ========= أدوات =========
  function el(tag, props = {}, children = []) {
    const x = document.createElement(tag);
    Object.assign(x, props);
    children.forEach(c => x.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return x;
  }

  function css(x, styles) {
    Object.assign(x.style, styles);
    return x;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
  }

  // ========= زرّين عائمين =========
  const wrap = css(el("div"), {
    position: "fixed",
    right: "12px",
    bottom: "12px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    fontFamily: "system-ui, Cairo, Arial",
  });

  function makeBtn(label) {
    return css(el("button", { type: "button", textContent: label }), {
      border: "1px solid rgba(255,255,255,.18)",
      background: "rgba(0,0,0,.45)",
      color: "rgba(255,255,255,.95)",
      padding: "10px 12px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "800",
      backdropFilter: "blur(10px)",
    });
  }

  // ========= نافذة المعلومات =========
  let modal = null;

  function closeModal() {
    if (modal) modal.remove();
    modal = null;
  }

  function openModal() {
    if (modal) return;

    const overlay = css(el("div"), {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.45)",
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    });

    const box = css(el("div"), {
      width: "min(720px, 100%)",
      borderRadius: "18px",
      border: "1px solid rgba(255,255,255,.18)",
      background: "rgba(10,10,18,.75)",
      color: "#fff",
      boxShadow: "0 24px 70px rgba(0,0,0,.45)",
      backdropFilter: "blur(12px)",
      padding: "16px",
    });

    const title = css(el("div", { textContent: "معلومات الموقع" }), {
      fontWeight: "900",
      fontSize: "18px",
      marginBottom: "10px",
    });

    const content = css(el("div"), {
      display: "grid",
      gap: "10px",
      fontSize: "14px",
      lineHeight: "1.8",
      opacity: "0.95",
    });

    const linePing = el("div", { innerHTML: `Ping: <b id="__ping__">...</b>` });
    const lineUpd  = el("div", { innerHTML: `آخر تحديث: <b>${escapeHtml(LAST_UPDATE_TEXT.replace(/^آخر تحديث:\s*/,""))}</b>` });
    const lineUrl  = el("div", { innerHTML: `الرابط: <b>${escapeHtml(location.href)}</b>` });
    const lineVis  = el("div", { innerHTML: `عدد الزائرين (محلي): <b id="__vis__">...</b>` });

    content.appendChild(linePing);
    content.appendChild(lineUpd);
    content.appendChild(lineUrl);
    content.appendChild(lineVis);

    const rowBtns = css(el("div"), {
      display: "flex",
      gap: "10px",
      marginTop: "12px",
      justifyContent: "flex-end",
      flexWrap: "wrap",
    });

    const btnRefresh = makeBtn("تحديث البيانات");
    const btnClose = makeBtn("إغلاق");

    btnClose.onclick = closeModal;
    btnRefresh.onclick = () => {
      updatePing();
      updateVisitors();
    };

    rowBtns.appendChild(btnRefresh);
    rowBtns.appendChild(btnClose);

    box.appendChild(title);
    box.appendChild(content);
    box.appendChild(rowBtns);

    overlay.appendChild(box);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    modal = overlay;
    document.body.appendChild(modal);

    // أول تحميل
    updatePing();
    updateVisitors();
  }

  // ========= Ping =========
  async function updatePing() {
    const pingEl = document.getElementById("__ping__");
    if (!pingEl) return;

    // نستخدم ملف خفيف (index.html أو manifest) حتى يكون قياسه سريع
    const target = new URL("index.html", document.baseURI).href;
    const t0 = performance.now();
    try {
      await fetch(target, { method: "GET", cache: "no-store" });
      const ms = Math.round(performance.now() - t0);
      pingEl.textContent = `${ms} ms`;
    } catch {
      pingEl.textContent = "فشل";
    }
  }

  // ========= Visitors (محلي) =========
  function updateVisitors() {
    const visEl = document.getElementById("__vis__");
    if (!visEl) return;

    // يزيد مرة وحدة باليوم لنفس الجهاز حتى ما يضل يزيد بكل ريفرش
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Baghdad" }).format(new Date());
    const keyDay = `${VISITOR_KEY}_DAY`;
    const lastDay = localStorage.getItem(keyDay);

    let count = Number(localStorage.getItem(VISITOR_KEY) || "0");
    if (lastDay !== today) {
      count += 1;
      localStorage.setItem(VISITOR_KEY, String(count));
      localStorage.setItem(keyDay, today);
    }
    visEl.textContent = String(count);
  }

  // ========= زر اختبار 11:11 =========
  function test1111Now() {
    // الأفضل: إذا عندك event1111.js ويعرّف window.TEST_1111
    if (typeof window.TEST_1111 === "function") {
      window.TEST_1111();
      return;
    }

    // خيار ثاني: إذا عندك دالة ثانية
    if (typeof window.__TEST_1111__ === "function") {
      window.__TEST_1111__();
      return;
    }

    // إذا ماكو ملف 11:11 أساساً
    alert("ملف 11:11 غير مربوط أو ماكو TEST_1111.\nاربط event1111.js أو فعّل دالة TEST_1111.");
  }

  // ========= حقن الأزرار =========
  if (SHOW_TEST_1111_BUTTON) {
    const b1 = makeBtn("اختبار 11:11");
    b1.onclick = test1111Now;
    wrap.appendChild(b1);
  }

  if (SHOW_INFO_BUTTON) {
    const b2 = makeBtn("معلومات");
    b2.onclick = openModal;
    wrap.appendChild(b2);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(wrap);
    // سجّل زيارة محلية
    updateVisitors();
  });
})();
