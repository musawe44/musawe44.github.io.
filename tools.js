// tools.js — زر معلومات + زر 11:11 (اختياري) + أدوات خفيفة
(() => {
  // ===== Helpers =====
  const $ = (id) => document.getElementById(id);

  // ===== زر معلومات أكثر (يظهر دائمًا) =====
  function addInfoButton() {
    if ($("moreInfoBtn")) return;

    const style = document.createElement("style");
    style.textContent = `
      #moreInfoBtn{
        position: fixed;
        right: 12px;
        bottom: 12px;
        z-index: 9999;
        text-decoration: none;
        padding: 10px 12px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(255,255,255,.10);
        color: rgba(255,255,255,.92);
        font-family: Cairo, system-ui, Arial;
        font-weight: 900;
        box-shadow: 0 10px 24px rgba(0,0,0,.14);
        backdrop-filter: blur(10px);
      }
      #moreInfoBtn:hover{ background: rgba(255,255,255,.14); }

      body.light #moreInfoBtn{
        border-color: rgba(0,0,0,.10);
        background: rgba(0,0,0,.04);
        color: rgba(10,16,28,.86);
      }
    `;
    document.head.appendChild(style);

    const a = document.createElement("a");
    a.id = "moreInfoBtn";
    a.href = "info.html";
    a.textContent = "معلومات أكثر";
    document.body.appendChild(a);
  }

  // ===== زر 11:11 يظهر فقط بعد 7 ضغطات على الوقت =====
  function addHidden1111Button() {
    let taps = 0;
    let timer = null;

    const timeEl = $("timeNow") || $("timeGhost"); // حسب صفحتك
    if (!timeEl) return;

    timeEl.style.pointerEvents = "auto"; // حتى يقبل الضغط

    timeEl.addEventListener("click", () => {
      taps++;
      clearTimeout(timer);
      timer = setTimeout(() => (taps = 0), 1200);

      if (taps >= 7) {
        taps = 0;
        show1111Button();
      }
    });

    function show1111Button() {
      // إذا موجود لا نعيده
      if ($("btn1111")) {
        // toggle إظهار/إخفاء
        $("btn1111").style.display =
          $("btn1111").style.display === "none" ? "block" : "none";
        return;
      }

      const btn = document.createElement("button");
      btn.id = "btn1111";
      btn.textContent = "11:11";
      btn.style.cssText = `
        position: fixed;
        left: 12px;
        bottom: 12px;
        z-index: 9999;
        padding: 10px 12px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(0,0,0,.30);
        color: rgba(255,255,255,.92);
        font-family: Cairo, system-ui, Arial;
        font-weight: 900;
        cursor: pointer;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 24px rgba(0,0,0,.18);
      `;

      btn.addEventListener("click", () => {
        // إذا عندك event1111.js فيه دالة preview اسمها startEvent
        if (window.start1111Preview) {
          window.start1111Preview(); // نادِ دالة جاهزة لو موجودة
          return;
        }

        // fallback: رسالة بسيطة
        alert("✨ 11:11 — Preview\n(اربطني بملف event1111.js حتى أشغّل الحدث)");
      });

      document.body.appendChild(btn);
    }
  }

  // ===== Init =====
  function init() {
    addInfoButton();
    addHidden1111Button();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
