// on-this-day-real.js — حدث حقيقي في مثل هذا اليوم (من Wikipedia/Wikimedia) — ملف واحد
(() => {
  const TZ = "Asia/Baghdad";
  const LANG = "ar";         // ar أو en
  const TYPE = "events";     // events | births | deaths
  const PICK = "random";     // random | first
  const MAX_CHARS = 140;     // قص النص إذا طويل
  const SHOW_YEAR = true;

  function baghdadMonthDay() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    const m = parts.find(p => p.type === "month")?.value;
    const d = parts.find(p => p.type === "day")?.value;
    return { m, d };
  }

  function clampText(s) {
    s = String(s || "").replace(/\s+/g, " ").trim();
    if (s.length <= MAX_CHARS) return s;
    return s.slice(0, MAX_CHARS - 1).trim() + "…";
  }

  // ===== UI =====
  const style = document.createElement("style");
  style.textContent = `
    #otdRealWrap{
      position: fixed;
      top: 120px;
      left: 50%;
      transform: translateX(-50%);
      width: min(980px, calc(100% - 20px));
      z-index: 72;
      pointer-events: none;
      font-family: Cairo, system-ui, Arial;
    }

    #otdRealCard{
      pointer-events: auto;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(0,0,0,.20);
      backdrop-filter: blur(10px);
      box-shadow: 0 12px 30px rgba(0,0,0,.22);
      padding: 12px 14px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap: 12px;
      animation: otdIn .6s ease both;
    }
    body.light #otdRealCard{
      background: rgba(255,255,255,.65);
      border-color: rgba(0,0,0,.10);
      box-shadow: 0 12px 30px rgba(0,0,0,.12);
    }

    @keyframes otdIn{
      from{ opacity:0; transform: translateY(-8px); }
      to{ opacity:1; transform: translateY(0); }
    }

    #otdRealLeft{
      display:flex;
      flex-direction:column;
      gap: 4px;
      min-width: 0;
    }
    #otdRealTitle{
      margin:0;
      font-weight: 900;
      font-size: 13px;
      color: rgba(255,255,255,.90);
      opacity: .92;
      white-space:nowrap;
    }
    body.light #otdRealTitle{ color: rgba(10,16,28,.82); }

    #otdRealText{
      margin:0;
      font-weight: 900;
      font-size: 15px;
      line-height: 1.8;
      color: rgba(255,255,255,.92);
      overflow:hidden;
      text-overflow: ellipsis;
    }
    body.light #otdRealText{ color: rgba(10,16,28,.86); }

    #otdRealRight{
      flex: 0 0 auto;
      display:flex;
      align-items:center;
      gap:8px;
    }
    #otdRealYear{
      font-weight: 900;
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.08);
      color: rgba(255,255,255,.88);
      white-space:nowrap;
    }
    body.light #otdRealYear{
      border-color: rgba(0,0,0,.10);
      background: rgba(0,0,0,.04);
      color: rgba(10,16,28,.80);
    }

    #otdRealBtn{
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.10);
      color: rgba(255,255,255,.92);
      padding: 8px 10px;
      border-radius: 14px;
      cursor: pointer;
      font-family: inherit;
      font-weight: 900;
      white-space:nowrap;
    }
    #otdRealBtn:active{ transform: scale(.98); }
    body.light #otdRealBtn{
      border-color: rgba(0,0,0,.10);
      background: rgba(0,0,0,.04);
      color: rgba(10,16,28,.86);
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.id = "otdRealWrap";
  wrap.innerHTML = `
    <div id="otdRealCard" style="display:none">
      <div id="otdRealLeft">
        <p id="otdRealTitle">حدث حقيقي في مثل هذا اليوم</p>
        <p id="otdRealText">...</p>
      </div>
      <div id="otdRealRight">
        <span id="otdRealYear" style="display:none"></span>
        <button id="otdRealBtn" title="حدث آخر">تغيير</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  const card = document.getElementById("otdRealCard");
  const textEl = document.getElementById("otdRealText");
  const yearEl = document.getElementById("otdRealYear");
  const btn = document.getElementById("otdRealBtn");

  let items = [];

  function renderOne(item) {
    if (!item) return;
    const year = item.year || "";
    const txt = clampText(item.text || "");
    textEl.textContent = txt || "تعذر عرض الحدث";
    if (SHOW_YEAR && year) {
      yearEl.style.display = "inline-flex";
      yearEl.textContent = String(year);
    } else {
      yearEl.style.display = "none";
    }
  }

  function pickItem() {
    if (!items.length) return null;
    if (PICK === "first") return items[0];
    return items[Math.floor(Math.random() * items.length)];
  }

  async function load() {
    try {
      const { m, d } = baghdadMonthDay();
      const url = `https://api.wikimedia.org/feed/v1/wikipedia/${LANG}/onthisday/${TYPE}/${m}/${d}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();

      // شكل البيانات: { events: [...] } أو births/deaths
      items = Array.isArray(data?.[TYPE]) ? data[TYPE] : [];
      if (!items.length) return;

      card.style.display = "flex";
      renderOne(pickItem());
    } catch (e) {
      // إذا فشل، نخفي البطاقة بدل ما نخرب شكل الموقع
      card.style.display = "none";
    }
  }

  btn.addEventListener("click", () => {
    if (!items.length) return;
    renderOne(pickItem());
  });

  load();
})();
