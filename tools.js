// tools.js — زر 11:11 + زر معلومات (Ping / آخر تحديث / زائرين محلي)
(() => {
  function makeBtn(label){
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.style.cssText = `
      border:1px solid rgba(255,255,255,.18);
      background: rgba(0,0,0,.45);
      color: rgba(255,255,255,.95);
      padding:10px 12px;
      border-radius:14px;
      cursor:pointer;
      font-weight:900;
      font-family: Cairo, system-ui, Arial;
      backdrop-filter: blur(10px);
    `;
    return b;
  }

  const wrap = document.createElement("div");
  wrap.id = "toolsWrap";
  wrap.style.cssText = `
    position:fixed;
    right:12px;
    bottom:12px;
    z-index:99999;
    display:flex;
    flex-direction:column;
    gap:10px;
  `;

  // ===== زر اختبار 11:11 =====
  const bTest = makeBtn("اختبار 11:11");
  bTest.onclick = () => {
    const start = Date.now();
    (function wait(){
      if (typeof window.TEST_1111 === "function") return window.TEST_1111();
      if (Date.now() - start > 2500) return alert("11:11 غير جاهز. تأكد رابط event1111.js");
      setTimeout(wait, 80);
    })();
  };

  // ===== نافذة معلومات =====
  let modal = null;
  const VIS_KEY = "MUSAWI_VISITORS_LOCAL";
  const DAY_KEY = "MUSAWI_VISITORS_DAY";
  const LAST_UPDATE_TEXT = "آخر تحديث: عدّلني من tools.js";

  function closeModal(){
    if(modal) modal.remove();
    modal = null;
  }

  async function ping(){
    const el = document.getElementById("__ping__");
    if(!el) return;
    const t0 = performance.now();
    try{
      await fetch(new URL("index.html", document.baseURI).href, { cache:"no-store" });
      el.textContent = Math.round(performance.now() - t0) + " ms";
    }catch{
      el.textContent = "فشل";
    }
  }

  function visitors(){
    const today = new Intl.DateTimeFormat("en-CA", { timeZone:"Asia/Baghdad" }).format(new Date());
    const last = localStorage.getItem(DAY_KEY);
    let c = Number(localStorage.getItem(VIS_KEY) || "0");
    if(last !== today){
      c += 1;
      localStorage.setItem(VIS_KEY, String(c));
      localStorage.setItem(DAY_KEY, today);
    }
    const el = document.getElementById("__vis__");
    if(el) el.textContent = String(c);
  }

  function openModal(){
    if(modal) return;

    modal = document.createElement("div");
    modal.style.cssText = `
      position:fixed; inset:0; z-index:100000;
      background: rgba(0,0,0,.45);
      display:flex; align-items:center; justify-content:center;
      padding:16px;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
      width:min(720px, 100%);
      border-radius:18px;
      border:1px solid rgba(255,255,255,.18);
      background: rgba(10,10,18,.78);
      color:#fff;
      padding:16px;
      font-family: Cairo, system-ui, Arial;
      backdrop-filter: blur(12px);
      box-shadow: 0 24px 70px rgba(0,0,0,.45);
    `;

    box.innerHTML = `
      <div style="font-weight:900; font-size:18px; margin-bottom:10px">معلومات الموقع</div>
      <div style="display:grid; gap:10px; font-size:14px; line-height:1.9; opacity:.95">
        <div>Ping: <b id="__ping__">...</b></div>
        <div>${LAST_UPDATE_TEXT}</div>
        <div>الرابط: <b>${location.href}</b></div>
        <div>عدد الزائرين (محلي): <b id="__vis__">...</b></div>
      </div>
      <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:12px; flex-wrap:wrap">
        <button id="__refresh__" style="all:unset; cursor:pointer; padding:10px 12px; border-radius:14px; font-weight:900; border:1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.10)">تحديث</button>
        <button id="__close__" style="all:unset; cursor:pointer; padding:10px 12px; border-radius:14px; font-weight:900; border:1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.10)">إغلاق</button>
      </div>
    `;

    modal.appendChild(box);
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => { if(e.target === modal) closeModal(); });
    document.getElementById("__close__").onclick = closeModal;
    document.getElementById("__refresh__").onclick = () => { ping(); visitors(); };

    ping();
    visitors();
  }

  const bInfo = makeBtn("معلومات");
  bInfo.onclick = openModal;

  wrap.appendChild(bTest);
  wrap.appendChild(bInfo);

  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(wrap);
    visitors();
  });
})();
