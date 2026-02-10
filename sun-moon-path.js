// sun-moon-path.js — مسار الشمس/القمر + شخص يمشي (بشكل جميل) — ملف واحد
(() => {
  const TZ = "Asia/Baghdad";

  // Basra (نفس إحداثياتك)
  const LAT = 30.5085;
  const LON = 47.7804;

  // ===== Helpers =====
  function pad2(n){ return String(n).padStart(2,"0"); }

  function nowBaghdadParts(){
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year:"numeric", month:"2-digit", day:"2-digit",
      hour:"2-digit", minute:"2-digit", second:"2-digit",
      hour12:false
    }).formatToParts(new Date());
    const get = (t) => parts.find(p=>p.type===t)?.value;
    return {
      y:+get("year"), m:+get("month"), d:+get("day"),
      hh:+get("hour"), mm:+get("minute"), ss:+get("second"),
    };
  }

  function toLocalDate({y,m,d,hh=0,mm=0,ss=0}){
    return new Date(y, m-1, d, hh, mm, ss);
  }

  function parseIsoToLocal(iso){
    // iso مثل: "2026-02-10T06:33"
    const [date, time] = iso.split("T");
    const [Y,M,D] = date.split("-").map(Number);
    const [h,mi] = time.split(":").map(Number);
    return new Date(Y, M-1, D, h, mi, 0);
  }

  // ===== UI Inject =====
  const style = document.createElement("style");
  style.textContent = `
    #smPathCard{
      margin-top: 16px;
      width: min(980px, 100%);
      margin-left:auto; margin-right:auto;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(255,255,255,.06);
      backdrop-filter: blur(10px);
      box-shadow: 0 18px 40px rgba(0,0,0,.18);
      padding: 14px 14px 12px;
      overflow: hidden;
      position: relative;
      font-family: Cairo, system-ui, Arial;
    }
    body.light #smPathCard{
      border-color: rgba(0,0,0,.10);
      background: rgba(0,0,0,.03);
      box-shadow: 0 18px 40px rgba(0,0,0,.10);
    }

    .smTop{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      margin-bottom: 10px;
    }
    .smTitle{
      font-weight: 900;
      font-size: 14px;
      color: rgba(255,255,255,.90);
      margin:0;
      white-space:nowrap;
    }
    body.light .smTitle{ color: rgba(10,16,28,.86); }

    .smMeta{
      font-weight: 900;
      font-size: 12px;
      color: rgba(255,255,255,.75);
      margin:0;
      text-align:left;
      direction:ltr;
      white-space:nowrap;
    }
    body.light .smMeta{ color: rgba(10,16,28,.70); }

    .smStage{
      position: relative;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(0,0,0,.18);
      overflow:hidden;
      height: 90px;
    }
    body.light .smStage{
      border-color: rgba(0,0,0,.10);
      background: rgba(255,255,255,.55);
    }

    /* Glow soft in center */
    .smStage::before{
      content:"";
      position:absolute; inset:-30px;
      background:
        radial-gradient(220px 120px at 50% 50%, rgba(255,255,255,.10), transparent 60%),
        radial-gradient(220px 120px at 75% 35%, rgba(34,197,94,.10), transparent 60%),
        radial-gradient(220px 120px at 25% 65%, rgba(59,130,246,.10), transparent 60%);
      pointer-events:none;
      opacity:.9;
    }

    .smLine{
      position:absolute;
      left: 14px;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      height: 8px;
      border-radius: 999px;
      background: rgba(255,255,255,.10);
      overflow:hidden;
    }
    body.light .smLine{ background: rgba(0,0,0,.06); }

    .smFill{
      position:absolute;
      inset:0;
      width: 0%;
      border-radius: 999px;
      background: rgba(255,255,255,.55);
      opacity: .75;
      transition: width .6s ease;
    }
    body.light .smFill{
      background: rgba(10,16,28,.65);
      opacity:.45;
    }

    .smEnds{
      position:absolute;
      left: 12px; right: 12px;
      top: 10px;
      display:flex;
      justify-content:space-between;
      align-items:center;
      pointer-events:none;
    }

    .smEnd{
      display:flex;
      align-items:center;
      gap:8px;
      padding: 8px 10px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.06);
      color: rgba(255,255,255,.92);
      font-weight: 900;
      font-size: 12px;
    }
    body.light .smEnd{
      border-color: rgba(0,0,0,.10);
      background: rgba(0,0,0,.03);
      color: rgba(10,16,28,.82);
    }

    .smIcon{
      width: 26px; height: 26px;
      display:grid; place-items:center;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(0,0,0,.16);
      font-size: 14px;
    }
    body.light .smIcon{
      background: rgba(255,255,255,.55);
      border-color: rgba(0,0,0,.10);
    }

    /* Walker */
    .smWalker{
      position:absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      left: 14px;
      width: 30px;
      height: 30px;
      border-radius: 999px;
      display:grid;
      place-items:center;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.14);
      backdrop-filter: blur(6px);
      box-shadow: 0 10px 30px rgba(0,0,0,.25);
      transition: left .6s ease;
    }
    body.light .smWalker{
      background: rgba(0,0,0,.03);
      border-color: rgba(0,0,0,.10);
      box-shadow: 0 10px 30px rgba(0,0,0,.12);
    }

    .smGuy{
      font-size: 16px;
      filter: drop-shadow(0 6px 10px rgba(0,0,0,.25));
    }

    .smBottom{
      margin-top: 10px;
      display:flex;
      justify-content:space-between;
      gap: 10px;
      flex-wrap: wrap;
      color: rgba(255,255,255,.78);
      font-weight: 900;
      font-size: 12px;
    }
    body.light .smBottom{ color: rgba(10,16,28,.72); }

    .smChip{
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.06);
    }
    body.light .smChip{
      border-color: rgba(0,0,0,.10);
      background: rgba(0,0,0,.03);
    }
  `;
  document.head.appendChild(style);

  const card = document.createElement("section");
  card.id = "smPathCard";
  card.innerHTML = `
    <div class="smTop">
      <p class="smTitle">🌙☀️ مسار اليوم</p>
      <p class="smMeta" id="smMeta">...</p>
    </div>

    <div class="smStage">
      <div class="smEnds">
        <div class="smEnd">
          <span class="smIcon">🌙</span>
          <span id="smMoonTxt">قبل الشروق</span>
        </div>
        <div class="smEnd">
          <span class="smIcon">☀️</span>
          <span id="smSunTxt">قبل الغروب</span>
        </div>
      </div>

      <div class="smLine">
        <div class="smFill" id="smFill"></div>
      </div>

      <div class="smWalker" id="smWalker" title="أنا">
        <span class="smGuy">🚶</span>
      </div>
    </div>

    <div class="smBottom">
      <div class="smChip" id="smState">...</div>
      <div class="smChip" id="smHint">...</div>
    </div>
  `;

  // نحطه "نهاية الصفحة": قبل الفوتر إذا موجود، أو آخر body
  const footer = document.querySelector("footer");
  if (footer && footer.parentNode) footer.parentNode.insertBefore(card, footer);
  else document.body.appendChild(card);

  const metaEl   = document.getElementById("smMeta");
  const moonTxt  = document.getElementById("smMoonTxt");
  const sunTxt   = document.getElementById("smSunTxt");
  const fillEl   = document.getElementById("smFill");
  const walkerEl = document.getElementById("smWalker");
  const stateEl  = document.getElementById("smState");
  const hintEl   = document.getElementById("smHint");

  let sunrise = null;   // Date local (Baghdad)
  let sunset  = null;   // Date local (Baghdad)
  let nextSunrise = null;

  function fmtHM(d){
    const hh = pad2(d.getHours());
    const mm = pad2(d.getMinutes());
    return `${hh}:${mm}`;
  }

  async function loadSunTimes(){
    try{
      const parts = nowBaghdadParts();
      const dateStr = `${parts.y}-${pad2(parts.m)}-${pad2(parts.d)}`;

      // Open-Meteo daily sunrise/sunset
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${LAT}&longitude=${LON}` +
        `&daily=sunrise,sunset` +
        `&timezone=${encodeURIComponent(TZ)}` +
        `&start_date=${dateStr}&end_date=${dateStr}`;

      const res = await fetch(url, { cache:"no-store" });
      if(!res.ok) throw new Error("sun api fail");
      const data = await res.json();

      const sr = data?.daily?.sunrise?.[0];
      const ss = data?.daily?.sunset?.[0];
      if(!sr || !ss) throw new Error("missing sunrise/sunset");

      sunrise = parseIsoToLocal(sr);
      sunset  = parseIsoToLocal(ss);

      // next sunrise (tomorrow) for night progress
      const tomorrow = toLocalDate({y:parts.y, m:parts.m, d:parts.d});
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tStr = `${tomorrow.getFullYear()}-${pad2(tomorrow.getMonth()+1)}-${pad2(tomorrow.getDate())}`;

      const url2 =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${LAT}&longitude=${LON}` +
        `&daily=sunrise` +
        `&timezone=${encodeURIComponent(TZ)}` +
        `&start_date=${tStr}&end_date=${tStr}`;

      const res2 = await fetch(url2, { cache:"no-store" });
      if(res2.ok){
        const d2 = await res2.json();
        const ns = d2?.daily?.sunrise?.[0];
        if(ns) nextSunrise = parseIsoToLocal(ns);
      }

      moonTxt.textContent = `الشروق ${fmtHM(sunrise)}`;
      sunTxt.textContent  = `الغروب ${fmtHM(sunset)}`;

      metaEl.textContent = `البصرة • شروق ${fmtHM(sunrise)} — غروب ${fmtHM(sunset)}`;
    }catch(e){
      metaEl.textContent = "تعذر جلب الشروق/الغروب";
      stateEl.textContent = "⚠️";
      hintEl.textContent = "تأكد من الإنترنت";
    }
  }

  function setPosition(pct){
    pct = Math.max(0, Math.min(1, pct));
    // المسار من 14px إلى (عرض الكرت - 14px)
    const stage = card.querySelector(".smStage");
    const rect = stage.getBoundingClientRect();
    const leftPadding = 14;
    const rightPadding = 14;
    const x = leftPadding + pct * (rect.width - leftPadding - rightPadding);
    walkerEl.style.left = `${x}px`;
    fillEl.style.width = `${Math.round(pct*1000)/10}%`;
  }

  function update(){
    if(!sunrise || !sunset){
      setPosition(0);
      return;
    }

    const n = nowBaghdadParts();
    const now = toLocalDate(n);

    // الحالة:
    // 1) نهار: من الشروق إلى الغروب -> يمشي باتجاه الشمس
    // 2) ليل: من الغروب إلى شروق بكرا -> يرجع باتجاه القمر
    if(now >= sunrise && now <= sunset){
      const span = sunset - sunrise;
      const done = now - sunrise;
      const pct = span > 0 ? done / span : 0;

      setPosition(pct);

      stateEl.textContent = "☀️ نهار";
      const leftMin = Math.max(0, Math.round((sunset - now)/60000));
      hintEl.textContent = `متبقي على الغروب: ${leftMin} دقيقة`;
    } else {
      // ليل
      const ns = nextSunrise || (() => {
        const tmp = new Date(sunrise);
        tmp.setDate(tmp.getDate()+1);
        return tmp;
      })();

      // إذا قبل الشروق (فجر): من منتصف الليل إلى الشروق نعتبره ضمن الليل
      // نحدد نقطة البداية للّيل: الغروب السابق
      const start = (now < sunrise) ? (() => {
        const prevSunset = new Date(sunset);
        prevSunset.setDate(prevSunset.getDate()-1);
        return prevSunset;
      })() : sunset;

      const span = ns - start;
      const done = now - start;
      const pctNight = span > 0 ? done / span : 0;

      // نرجّع من الشمس إلى القمر: 1 -> 0
      setPosition(1 - Math.max(0, Math.min(1, pctNight)));

      stateEl.textContent = "🌙 ليل";
      const leftMin = Math.max(0, Math.round((ns - now)/60000));
      hintEl.textContent = `متبقي على الشروق: ${leftMin} دقيقة`;
    }
  }

  // init
  loadSunTimes().then(() => {
    update();
    setInterval(update, 60 * 1000);         // تحديث الحركة كل دقيقة
  });

  // تحديث الشروق/الغروب مرة باليوم (عند منتصف الليل تقريباً)
  setInterval(loadSunTimes, 6 * 60 * 60 * 1000); // كل 6 ساعات كفاية وخفيف
})();
