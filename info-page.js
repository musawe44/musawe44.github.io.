<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>معلومات أكثر — MUSAWI</title>
  <meta name="theme-color" content="#0b1220">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800;900&display=swap" rel="stylesheet">

  <style>
    :root{
      --bg:#0b1220;
      --card: rgba(255,255,255,.10);
      --border: rgba(255,255,255,.18);
      --text: #eef2ff;
      --muted:#d1d5db;
      --shadow: 0 18px 40px rgba(0,0,0,.38);
      --glass: rgba(255,255,255,.07);
      --glass2: rgba(255,255,255,.05);
      --accent: rgba(34,197,94,.95);
    }
    body.light{
      --bg:#f4f6ff;
      --card: rgba(0,0,0,.06);
      --border: rgba(0,0,0,.12);
      --text:#0b1220;
      --muted:#334155;
      --shadow: 0 18px 40px rgba(0,0,0,.12);
      --glass: rgba(255,255,255,.62);
      --glass2: rgba(255,255,255,.40);
    }

    *{ box-sizing:border-box; }
    html,body{ height:100%; }

    body{
      margin:0;
      font-family:"Cairo", system-ui, Arial;
      color:var(--text);
      background: var(--bg);
      overflow-x:hidden;
      padding: 14px;
    }

    /* ===== Same background as main ===== */
    .bgVideo{
      position:fixed; inset:0;
      width:100%; height:100%;
      object-fit:cover;
      z-index:-6;
      transform: scale(1.02);
      filter: saturate(1.08) contrast(1.05);
    }
    .overlay{
      position:fixed; inset:0;
      z-index:-5;
      background:
        radial-gradient(900px 520px at 80% 20%, rgba(34,197,94,.12), transparent 60%),
        radial-gradient(750px 450px at 20% 80%, rgba(59,130,246,.12), transparent 55%),
        linear-gradient(120deg, rgba(11,18,32,.30), rgba(11,18,32,.18));
      transition: opacity .25s ease;
    }
    body.light .overlay{
      background:
        radial-gradient(900px 520px at 80% 20%, rgba(34,197,94,.14), transparent 60%),
        radial-gradient(750px 450px at 20% 80%, rgba(59,130,246,.14), transparent 55%),
        linear-gradient(120deg, rgba(255,255,255,.28), rgba(255,255,255,.18));
    }

    /* ===== Layout ===== */
    .wrap{
      width:min(980px, 100%);
      margin: 0 auto;
      display:grid;
      gap: 14px;
      padding-top: 8px;
    }

    .topbar{
      position: sticky;
      top: 10px;
      z-index: 70;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.16);
      background: var(--glass);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 24px rgba(0,0,0,.14);
    }
    body.light .topbar{
      border-color: rgba(0,0,0,.10);
      box-shadow: 0 10px 24px rgba(0,0,0,.08);
    }

    .tbLeft{
      display:flex;
      align-items:center;
      gap: 10px;
      min-width:0;
    }
    .tbTitle{
      font-weight: 900;
      font-size: 14px;
      white-space:nowrap;
    }
    .tbSub{
      font-weight: 900;
      color: var(--muted);
      font-size: 12px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow: ellipsis;
      max-width: 54vw;
    }

    .tbBtns{ display:flex; gap:8px; align-items:center; }
    .btn{
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.10);
      color: rgba(255,255,255,.92);
      padding: 10px 12px;
      border-radius: 14px;
      cursor:pointer;
      font-family: inherit;
      font-weight: 900;
      text-decoration:none;
      white-space:nowrap;
    }
    .btn:hover{ background: rgba(255,255,255,.14); }
    body.light .btn{
      border-color: rgba(0,0,0,.10);
      background: rgba(0,0,0,.04);
      color: rgba(10,16,28,.86);
    }

    .grid{
      display:grid;
      grid-template-columns: 1.1fr .9fr;
      gap: 14px;
      align-items:start;
    }
    @media (max-width: 920px){
      .grid{ grid-template-columns: 1fr; }
    }

    .card{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 16px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(10px);
      overflow:hidden;
      animation: enter 520ms cubic-bezier(.2,.9,.2,1) both;
    }
    @keyframes enter{
      from{ opacity:0; transform: translateY(10px); filter: blur(6px); }
      to{ opacity:1; transform: translateY(0); filter: blur(0); }
    }

    .sectionTitle{
      margin:0 0 12px;
      font-size: 16px;
      font-weight: 900;
    }

    /* ===== Error box ===== */
    #errBox{
      display:none;
      padding: 12px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(244,63,94,.12);
      color: rgba(255,255,255,.92);
      font-weight: 900;
      line-height: 1.8;
    }
    body.light #errBox{
      border-color: rgba(0,0,0,.10);
      background: rgba(244,63,94,.10);
      color: rgba(10,16,28,.86);
    }

    /* ===== Current weather ===== */
    .current{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap: 12px;
    }
    .cwLeft{
      display:flex;
      align-items:center;
      gap: 12px;
      min-width:0;
    }
    .iconBox{
      width: 56px; height:56px;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.08);
      display:grid;
      place-items:center;
      flex:0 0 auto;
      color: rgba(255,255,255,.92);
    }
    body.light .iconBox{
      border-color: rgba(0,0,0,.10);
      background: rgba(0,0,0,.03);
      color: rgba(10,16,28,.86);
    }

    .temp{
      font-weight: 900;
      font-size: 44px;
      line-height:1;
      letter-spacing: .2px;
    }
    .desc{
      margin-top: 6px;
      font-weight: 900;
      font-size: 13px;
      color: var(--muted);
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      max-width: 56vw;
    }

    .pill{
      display:flex;
      align-items:center;
      gap:8px;
      padding: 10px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(255,255,255,.06);
      font-weight: 900;
      font-size: 13px;
      color: rgba(255,255,255,.92);
      white-space:nowrap;
    }
    body.light .pill{
      border-color: rgba(0,0,0,.10);
      background: rgba(0,0,0,.03);
      color: rgba(10,16,28,.86);
    }
    .dot{
      width:10px; height:10px;
      border-radius: 999px;
      background: var(--accent);
      box-shadow: 0 0 14px rgba(34,197,94,.20);
      flex:0 0 auto;
    }

    /* ===== Sunrise/sunset line ===== */
    .sunBox{
      margin-top: 14px;
      padding: 12px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.16);
      background: var(--glass2);
    }
    body.light .sunBox{ border-color: rgba(0,0,0,.10); }
    .sunRow{
      display:flex;
      justify-content:space-between;
      gap: 10px;
      font-weight: 900;
      color: var(--muted);
      font-size: 13px;
      margin-bottom: 10px;
      flex-wrap:wrap;
    }
    .track{
      position: relative;
      height: 10px;
      border-radius: 999px;
      background: rgba(255,255,255,.10);
      border: 1px solid rgba(255,255,255,.14);
      overflow:hidden;
    }
    body.light .track{ background: rgba(0,0,0,.04); border-color: rgba(0,0,0,.10); }

    .fill{
      position:absolute; inset:0 auto 0 0;
      width: 0%;
      background: linear-gradient(90deg, rgba(59,130,246,.75), rgba(34,197,94,.70), rgba(245,158,11,.75));
      border-radius: 999px;
      opacity:.85;
    }
    .walker{
      position:absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 22px; height:22px;
      border-radius: 999px;
      background: rgba(255,255,255,.92);
      color:#0b1220;
      display:grid;
      place-items:center;
      font-weight: 900;
      font-size: 12px;
      box-shadow: 0 0 22px rgba(255,255,255,.18);
      border: 1px solid rgba(255,255,255,.18);
      left: 0%;
    }

    .hint{
      margin-top: 10px;
      font-weight: 900;
      color: var(--muted);
      font-size: 12px;
      line-height:1.7;
    }

    /* ===== 7 days ===== */
    .days{
      margin-top: 14px;
      display:grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 10px;
    }
    @media (max-width: 920px){ .days{ grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 520px){ .days{ grid-template-columns: repeat(2, 1fr); } }

    .day{
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(255,255,255,.06);
      border-radius: 16px;
      padding: 10px;
      display:flex;
      flex-direction:column;
      gap: 8px;
      min-height: 130px;
    }
    body.light .day{ border-color: rgba(0,0,0,.10); background: rgba(0,0,0,.03); }

    .dTop{ display:flex; justify-content:space-between; align-items:center; gap: 8px; }
    .dName{ font-weight: 900; font-size: 13px; }
    .dIco{ width: 30px; height:30px; display:grid; place-items:center; opacity:.95; color: rgba(255,255,255,.92); }
    body.light .dIco{ color: rgba(10,16,28,.86); }

    .dTemp{ display:flex; justify-content:space-between; align-items:baseline; gap: 8px; font-weight:900; }
    .hi{ font-size: 18px; }
    .lo{ font-size: 13px; color: var(--muted); }
    .dDesc{ margin-top:auto; font-weight: 900; font-size: 12px; color: var(--muted); line-height:1.4; }

    /* ===== Prayer times ===== */
    .ptGrid{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    @media (max-width: 520px){ .ptGrid{ grid-template-columns: 1fr; } }

    .pt{
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(255,255,255,.06);
      border-radius: 16px;
      padding: 10px 12px;
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap: 10px;
      font-weight: 900;
    }
    body.light .pt{ border-color: rgba(0,0,0,.10); background: rgba(0,0,0,.03); }
    .ptName{ opacity:.95; }
    .ptTime{ color: var(--muted); }

    .status{
      margin-top: 12px;
      display:flex;
      justify-content:space-between;
      gap: 10px;
      flex-wrap:wrap;
      font-weight: 900;
      font-size: 12px;
      color: var(--muted);
    }

    .loading{
      font-weight: 900;
      color: var(--muted);
      font-size: 13px;
      opacity:.9;
    }
  </style>
</head>

<body>
  <!-- same background -->
  <video class="bgVideo" autoplay muted loop playsinline>
    <source src="bg.mp4.mp4" type="video/mp4">
  </video>
  <div class="overlay"></div>

  <div class="wrap">
    <div class="topbar">
      <div class="tbLeft">
        <div>
          <div class="tbTitle">معلومات أكثر</div>
          <div class="tbSub" id="subLine">البصرة — طقس + شروق/غروب + مواقيت</div>
        </div>
      </div>
      <div class="tbBtns">
        <a class="btn" href="index.html">رجوع</a>
        <button class="btn" id="toggleTheme">ليل/نهار</button>
      </div>
    </div>

    <div id="errBox"></div>

    <div class="grid">
      <!-- Weather card -->
      <section class="card">
        <h2 class="sectionTitle">الطقس الآن + الأسبوع</h2>

        <div class="current">
          <div class="cwLeft">
            <div class="iconBox" id="cwIcon" aria-hidden="true"></div>
            <div style="min-width:0">
              <div class="temp" id="cwTemp">--°</div>
              <div class="desc" id="cwDesc">تحميل...</div>
            </div>
          </div>

          <div class="pill">
            <span class="dot" id="feelDot"></span>
            <span id="feelTxt">...</span>
          </div>
        </div>

        <div class="sunBox">
          <div class="sunRow">
            <span>🌅 شروق: <span id="sunriseTxt">--</span></span>
            <span>🌇 غروب: <span id="sunsetTxt">--</span></span>
          </div>

          <div class="track" aria-label="خط الشروق والغروب">
            <div class="fill" id="dayFill"></div>
            <div class="walker" id="walker" title="موقع الشمس">☀</div>
          </div>

          <div class="hint" id="sunHint">تحميل...</div>
        </div>

        <div style="margin-top:14px">
          <h2 class="sectionTitle" style="margin-bottom:12px">توقع 7 أيام</h2>
          <div class="days" id="daysBox">
            <div class="loading">تحميل...</div>
          </div>
        </div>

        <div class="status" id="wxStatus"></div>
      </section>

      <!-- Prayer card -->
      <section class="card">
        <h2 class="sectionTitle">مواقيت الصلاة (جعفري)</h2>
        <div class="ptGrid" id="prayerBox">
          <div class="loading">تحميل...</div>
        </div>
        <div class="status" id="prayerStatus"></div>
      </section>
    </div>
  </div>

  <script>
  (() => {
    // ===== Theme same as main =====
    const savedTheme = localStorage.getItem("themeMode");
    if(savedTheme === "light") document.body.classList.add("light");
    const toggleTheme = document.getElementById("toggleTheme");
    toggleTheme.addEventListener("click", () => {
      document.body.classList.toggle("light");
      localStorage.setItem("themeMode", document.body.classList.contains("light") ? "light" : "dark");
    });

    // ===== error helper =====
    const errBox = document.getElementById("errBox");
    function showErr(msg){
      errBox.style.display = "block";
      errBox.textContent = "⚠️ " + msg;
    }
    function clearErr(){
      errBox.style.display = "none";
      errBox.textContent = "";
    }

    // ===== Basra settings =====
    const CITY = "البصرة";
    const LAT = 30.5085, LON = 47.7804;
    const TZ = "Asia/Baghdad";

    // ===== helpers =====
    const pad2 = n => String(n).padStart(2, "0");

    function fmt12(hhmm){
      const [hh, mm] = hhmm.split(":").map(Number);
      const am = hh < 12;
      const h12 = ((hh + 11) % 12) + 1;
      return `${h12}:${pad2(mm)} ${am ? "ص" : "م"}`;
    }

    function fmtTimeISO(iso){
      const d = new Date(iso);
      const hh = d.getHours(), mm = d.getMinutes();
      const am = hh < 12;
      const h12 = ((hh + 11) % 12) + 1;
      return `${h12}:${pad2(mm)} ${am ? "ص" : "م"}`;
    }

    function weatherLabel(code){
      if (code === 0) return ["صحو", "sun"];
      if ([1,2].includes(code)) return ["غائم جزئياً", "partly"];
      if (code === 3) return ["غائم", "cloud"];
      if ([45,48].includes(code)) return ["ضباب", "fog"];
      if ([51,53,55].includes(code)) return ["رذاذ", "drizzle"];
      if ([61,63,65].includes(code)) return ["مطر", "rain"];
      if ([71,73,75,77].includes(code)) return ["ثلج", "snow"];
      if ([80,81,82].includes(code)) return ["زخات", "showers"];
      if ([95,96,99].includes(code)) return ["عاصفة", "storm"];
      return ["متغير", "partly"];
    }

    function svgIcon(kind, size=28){
      const s = size;
      if(kind==="sun") return `
        <svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="currentColor" opacity=".92"/>
          <g stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".85">
            <path d="M12 2v3"/><path d="M12 19v3"/>
            <path d="M2 12h3"/><path d="M19 12h3"/>
            <path d="M4.2 4.2l2.1 2.1"/><path d="M17.7 17.7l2.1 2.1"/>
            <path d="M19.8 4.2l-2.1 2.1"/><path d="M6.3 17.7l-2.1 2.1"/>
          </g>
        </svg>`;
      if(kind==="cloud") return `
        <svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7.8 18.5h8.6a4.2 4.2 0 0 0 .3-8.4A5.6 5.6 0 0 0 6.2 12a3.7 3.7 0 0 0 1.6 6.5Z"
                fill="currentColor" opacity=".88"/>
        </svg>`;
      if(kind==="partly") return `
        <svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <g opacity=".9" fill="currentColor"><circle cx="9" cy="9" r="3.2"/></g>
          <path d="M8.2 19h8.2a3.8 3.8 0 0 0 .3-7.6A4.8 4.8 0 0 0 7 12.6a3.2 3.2 0 0 0 1.2 6.4Z"
                fill="currentColor" opacity=".72"/>
        </svg>`;
      if(kind==="rain" || kind==="showers" || kind==="drizzle") return `
        <svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7.8 15.5h8.6a4.2 4.2 0 0 0 .3-8.4A5.6 5.6 0 0 0 6.2 9a3.7 3.7 0 0 0 1.6 6.5Z"
                fill="currentColor" opacity=".82"/>
          <g stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".75">
            <path d="M9 18.5l-1 2"/><path d="M13 18.5l-1 2"/><path d="M17 18.5l-1 2"/>
          </g>
        </svg>`;
      if(kind==="storm") return `
        <svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7.6 14.8h8.8a4.2 4.2 0 0 0 .2-8.4A5.6 5.6 0 0 0 6.1 8.4a3.7 3.7 0 0 0 1.5 6.4Z"
                fill="currentColor" opacity=".78"/>
          <path d="M12.8 14.8l-2.3 4h2l-1.3 3.2 4.2-5.6h-2l1.2-1.6z"
                fill="currentColor" opacity=".92"/>
        </svg>`;
      if(kind==="fog") return `
        <svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7.8 12.8h8.6a4.2 4.2 0 0 0 .3-8.4A5.6 5.6 0 0 0 6.2 6.3a3.7 3.7 0 0 0 1.6 6.5Z"
                fill="currentColor" opacity=".65"/>
          <g stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".65">
            <path d="M6 16h12"/><path d="M7 19h10"/>
          </g>
        </svg>`;
      if(kind==="snow") return `
        <svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7.8 14.5h8.6a4.2 4.2 0 0 0 .3-8.4A5.6 5.6 0 0 0 6.2 8a3.7 3.7 0 0 0 1.6 6.5Z"
                fill="currentColor" opacity=".75"/>
          <g fill="currentColor" opacity=".9">
            <circle cx="9" cy="18.3" r="1.1"/><circle cx="13" cy="19.5" r="1.1"/><circle cx="17" cy="18.3" r="1.1"/>
          </g>
        </svg>`;
      return svgIcon("partly", size);
    }

    function feelFromTemp(t){
      if (t <= 10) return ["بارد", "cold"];
      if (t >= 32) return ["حار", "hot"];
      return ["معتدل", "ok"];
    }

    function setFeelDot(mode){
      const dot = document.getElementById("feelDot");
      if(mode === "cold"){
        dot.style.background = "rgba(59,130,246,.95)";
        dot.style.boxShadow = "0 0 14px rgba(59,130,246,.22)";
      }else if(mode === "hot"){
        dot.style.background = "rgba(244,63,94,.95)";
        dot.style.boxShadow = "0 0 14px rgba(244,63,94,.18)";
      }else{
        dot.style.background = "var(--accent)";
        dot.style.boxShadow = "0 0 14px rgba(34,197,94,.20)";
      }
    }

    async function loadWeather(){
      const daysBox = document.getElementById("daysBox");
      const wxStatus = document.getElementById("wxStatus");
      try{
        clearErr();
        daysBox.innerHTML = `<div class="loading">تحميل...</div>`;

        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${LAT}&longitude=${LON}` +
          `&current=temperature_2m,weather_code` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
          `&forecast_days=7` +
          `&timezone=${encodeURIComponent(TZ)}`;

        const t0 = performance.now();
        const res = await fetch(url, { cache:"no-store" });
        const ms = Math.round(performance.now() - t0);

        if(!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);

        const data = await res.json();

        const curT = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const [desc, kind] = weatherLabel(code);

        document.getElementById("cwTemp").textContent = `${curT}°`;
        document.getElementById("cwDesc").textContent = `${CITY} — ${desc}`;
        document.getElementById("cwIcon").innerHTML = svgIcon(kind, 30);

        const [feelTxt, feelMode] = feelFromTemp(curT);
        document.getElementById("feelTxt").textContent = feelTxt;
        setFeelDot(feelMode);

        // sunrise/sunset
        const sunriseISO = data.daily.sunrise?.[0];
        const sunsetISO  = data.daily.sunset?.[0];
        document.getElementById("sunriseTxt").textContent = sunriseISO ? fmtTimeISO(sunriseISO) : "--";
        document.getElementById("sunsetTxt").textContent  = sunsetISO  ? fmtTimeISO(sunsetISO)  : "--";

        // progress line
        const fill = document.getElementById("dayFill");
        const walker = document.getElementById("walker");
        const hint = document.getElementById("sunHint");

        if(sunriseISO && sunsetISO){
          const now = new Date();
          const sr = new Date(sunriseISO);
          const ss = new Date(sunsetISO);
          const total = Math.max(1, ss - sr);
          const done = Math.min(total, Math.max(0, now - sr));
          const pct = Math.round((done / total) * 100);

          fill.style.width = `${pct}%`;
          walker.style.left = `${pct}%`;

          const leftMs = Math.max(0, ss - now);
          const leftH = Math.floor(leftMs / 3600000);
          const leftM = Math.floor((leftMs % 3600000) / 60000);

          hint.textContent =
            (now < sr) ? "🌙 قبل الشروق…" :
            (now > ss) ? "🌙 بعد الغروب…" :
            `☀️ باقي على الغروب: ${leftH}س ${leftM}د — تقدّم النهار: ${pct}%`;
        }else{
          hint.textContent = "تعذر قراءة الشروق/الغروب.";
          fill.style.width = "0%";
          walker.style.left = "0%";
        }

        // 7 days
        const times = data.daily.time || [];
        const wx = data.daily.weather_code || [];
        const tmax = data.daily.temperature_2m_max || [];
        const tmin = data.daily.temperature_2m_min || [];

        daysBox.innerHTML = "";
        for(let i=0;i<Math.min(7, times.length);i++){
          const d = new Date(times[i] + "T12:00:00");
          const name = new Intl.DateTimeFormat("ar-IQ",{ weekday:"long" }).format(d);
          const hi = Math.round(tmax[i]);
          const lo = Math.round(tmin[i]);
          const [dDesc, dKind] = weatherLabel(wx[i]);

          const el = document.createElement("div");
          el.className = "day";
          el.innerHTML = `
            <div class="dTop">
              <div class="dName">${name}</div>
              <div class="dIco" title="${dDesc}">${svgIcon(dKind, 26)}</div>
            </div>
            <div class="dTemp">
              <div class="hi">${hi}°</div>
              <div class="lo">${lo}°</div>
            </div>
            <div class="dDesc">${dDesc}</div>
          `;
          daysBox.appendChild(el);
        }

        wxStatus.innerHTML = `
          <span>API: Open-Meteo</span>
          <span>Ping: ${ms}ms</span>
          <span>آخر تحديث: ${new Date().toLocaleTimeString("ar-IQ")}</span>
        `;
      }catch(e){
        showErr("فشل تحميل الطقس. إذا أنت فاتح الصفحة من GitHub Pages جرّب تحديث/إعادة فتح. (" + (e?.message||e) + ")");
        document.getElementById("cwDesc").textContent = "تعذر تحميل الطقس";
        document.getElementById("sunHint").textContent = "تعذر تحميل البيانات";
        document.getElementById("daysBox").innerHTML = `<div class="loading">تعذر تحميل الأسبوع.</div>`;
        document.getElementById("wxStatus").textContent = "";
      }
    }

    async function loadPrayerTimes(){
      const box = document.getElementById("prayerBox");
      const st = document.getElementById("prayerStatus");
      try{
        box.innerHTML = `<div class="loading">تحميل...</div>`;
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // method=0 (Jafari)
        const url =
          `https://api.aladhan.com/v1/timings/${pad2(day)}-${pad2(month)}-${year}` +
          `?latitude=${LAT}&longitude=${LON}&method=0&timezonestring=${encodeURIComponent(TZ)}`;

        const t0 = performance.now();
        const res = await fetch(url, { cache:"no-store" });
        const ms = Math.round(performance.now() - t0);

        if(!res.ok) throw new Error(`AlAdhan HTTP ${res.status}`);

        const data = await res.json();
        const T = data?.data?.timings || {};

        const items = [
          ["الفجر", T.Fajr],
          ["الشروق", T.Sunrise],
          ["الظهر", T.Dhuhr],
          ["العصر", T.Asr],
          ["المغرب", T.Maghrib],
          ["العشاء", T.Isha],
        ].filter(x => x[1]);

        box.innerHTML = "";
        for(const [name, val] of items){
          const clean = String(val).slice(0,5);
          const el = document.createElement("div");
          el.className = "pt";
          el.innerHTML = `<div class="ptName">${name}</div><div class="ptTime">${fmt12(clean)}</div>`;
          box.appendChild(el);
        }

        st.innerHTML = `
          <span>API: AlAdhan</span>
          <span>Ping: ${ms}ms</span>
          <span>آخر تحديث: ${new Date().toLocaleTimeString("ar-IQ")}</span>
        `;
      }catch(e){
        showErr("فشل تحميل مواقيت الصلاة. (" + (e?.message||e) + ")");
        box.innerHTML = `<div class="loading">تعذر تحميل المواقيت.</div>`;
        st.textContent = "";
      }
    }

    loadWeather();
    loadPrayerTimes();

    // تحديثات خفيفة
    setInterval(loadWeather, 15 * 60 * 1000);
    setInterval(loadPrayerTimes, 60 * 60 * 1000);
  })();
  </script>
</body>
</html>
