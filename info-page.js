<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>معلومات أكثر — MUSAWI</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800;900&display=swap" rel="stylesheet">

  <style>
    :root{
      --bg:#0b1220;
      --card: rgba(255,255,255,.10);
      --border: rgba(255,255,255,.18);
      --text: #eef2ff;
      --muted:#cbd5e1;
      --shadow: 0 18px 40px rgba(0,0,0,.38);
      --glass: rgba(255,255,255,.07);
      --glass2: rgba(255,255,255,.05);

      --ok: rgba(34,197,94,.95);
      --cold: rgba(59,130,246,.95);
      --hot: rgba(244,63,94,.95);
    }

    body.light{
      --bg:#f4f6ff;
      --card: rgba(0,0,0,.06);
      --border: rgba(0,0,0,.12);
      --text:#0b1220;
      --muted:#334155;
      --shadow: 0 18px 40px rgba(0,0,0,.12);
      --glass: rgba(255,255,255,.70);
      --glass2: rgba(255,255,255,.55);
    }

    *{ box-sizing:border-box; }
    html,body{ height:100%; }
    body{
      margin:0;
      font-family:"Cairo", system-ui, Arial;
      background: var(--bg);
      color: var(--text);
      padding: 16px;
      overflow-x:hidden;
    }

    .wrap{
      width: min(980px, 100%);
      margin: 0 auto;
      display: grid;
      gap: 14px;
    }

    .topbar{
      position: sticky;
      top: 10px;
      z-index: 50;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      padding: 12px 12px;
      border-radius: 16px;
      border: 1px solid var(--border);
      background: var(--glass);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 24px rgba(0,0,0,.14);
    }

    .title{
      display:flex;
      align-items:center;
      gap:10px;
      font-weight: 900;
      font-size: 15px;
      white-space:nowrap;
    }

    .btn{
      appearance:none;
      border: 1px solid var(--border);
      background: rgba(255,255,255,.10);
      color: var(--text);
      padding: 10px 12px;
      border-radius: 14px;
      cursor:pointer;
      font-family: inherit;
      font-weight: 900;
      text-decoration:none;
      line-height:1;
      white-space:nowrap;
    }
    .btn:hover{ background: rgba(255,255,255,.14); }
    body.light .btn{ background: rgba(0,0,0,.04); }

    .grid2{
      display:grid;
      grid-template-columns: 1.1fr .9fr;
      gap: 14px;
      align-items: start;
    }
    @media (max-width: 920px){
      .grid2{ grid-template-columns: 1fr; }
    }

    .card{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 16px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(10px);
      overflow:hidden;
    }

    .sectionTitle{
      margin: 0 0 10px;
      font-weight: 900;
      font-size: 16px;
      color: rgba(255,255,255,.92);
    }
    body.light .sectionTitle{ color: rgba(10,16,28,.86); }

    /* ===== Current Weather (احترافي) ===== */
    .current{
      display:flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }
    .cwLeft{
      display:flex;
      gap: 12px;
      align-items:center;
      min-width: 0;
    }
    .iconBox{
      width: 56px; height:56px;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.08);
      display:grid;
      place-items:center;
      flex: 0 0 auto;
    }
    body.light .iconBox{ border-color: rgba(0,0,0,.10); background: rgba(0,0,0,.03); }

    .temp{
      font-size: 44px;
      font-weight: 900;
      letter-spacing: .2px;
      line-height: 1;
    }
    .meta{
      margin-top: 6px;
      font-weight: 900;
      color: var(--muted);
      font-size: 13px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      max-width: 100%;
    }

    .pill{
      display:flex;
      align-items:center;
      gap:8px;
      padding: 10px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.06);
      font-weight: 900;
      font-size: 13px;
      white-space:nowrap;
    }
    body.light .pill{ border-color: rgba(0,0,0,.10); background: rgba(0,0,0,.03); }

    .dot{
      width: 10px; height:10px;
      border-radius: 999px;
      background: var(--ok);
      box-shadow: 0 0 14px rgba(34,197,94,.22);
      flex:0 0 auto;
    }

    /* ===== Sunrise/Sunset line ===== */
    .sunline{
      margin-top: 14px;
      padding: 12px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.16);
      background: var(--glass2);
    }
    body.light .sunline{ border-color: rgba(0,0,0,.10); }

    .sunRow{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap: 10px;
      font-weight: 900;
      color: var(--muted);
      font-size: 13px;
      margin-bottom: 10px;
    }

    .track{
      position: relative;
      height: 10px;
      border-radius: 999px;
      background: rgba(255,255,255,.10);
      overflow:hidden;
      border: 1px solid rgba(255,255,255,.14);
    }
    body.light .track{ background: rgba(0,0,0,.04); border-color: rgba(0,0,0,.10); }

    .trackFill{
      position:absolute;
      inset:0 auto 0 0;
      width: 50%;
      background: linear-gradient(90deg, rgba(59,130,246,.75), rgba(34,197,94,.70), rgba(245,158,11,.75));
      border-radius: 999px;
      filter: saturate(1.1);
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
    }

    /* ===== 7-day Forecast ===== */
    .days{
      display:grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 10px;
    }
    @media (max-width: 920px){
      .days{ grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 520px){
      .days{ grid-template-columns: repeat(2, 1fr); }
    }

    .day{
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(255,255,255,.06);
      border-radius: 16px;
      padding: 10px 10px;
      display:flex;
      flex-direction: column;
      gap: 8px;
      min-height: 130px;
    }
    body.light .day{ border-color: rgba(0,0,0,.10); background: rgba(0,0,0,.03); }

    .dTop{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap: 8px;
    }
    .dName{
      font-weight: 900;
      font-size: 13px;
      color: rgba(255,255,255,.92);
    }
    body.light .dName{ color: rgba(10,16,28,.86); }

    .dIco{
      width: 30px; height:30px;
      display:grid;
      place-items:center;
      opacity:.95;
    }

    .dTemp{
      display:flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      font-weight: 900;
    }
    .hi{ font-size: 18px; }
    .lo{ font-size: 13px; color: var(--muted); }

    .dDesc{
      font-size: 12px;
      font-weight: 900;
      color: var(--muted);
      line-height: 1.4;
      margin-top: auto;
    }

    /* ===== Prayer times ===== */
    .prayerGrid{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 10px;
    }
    @media (max-width: 520px){
      .prayerGrid{ grid-template-columns: 1fr; }
    }
    .pt{
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(255,255,255,.06);
      border-radius: 16px;
      padding: 10px 12px;
      display:flex;
      justify-content: space-between;
      align-items:center;
      gap: 10px;
      font-weight: 900;
    }
    body.light .pt{ border-color: rgba(0,0,0,.10); background: rgba(0,0,0,.03); }

    .ptName{ color: rgba(255,255,255,.92); }
    body.light .ptName{ color: rgba(10,16,28,.86); }
    .ptTime{ color: var(--muted); }

    .hint{
      margin-top: 10px;
      font-size: 12px;
      font-weight: 900;
      color: var(--muted);
      line-height: 1.6;
    }

    /* ===== status bar ===== */
    .status{
      display:flex;
      justify-content:space-between;
      gap:10px;
      flex-wrap:wrap;
      margin-top: 10px;
      font-weight: 900;
      font-size: 12px;
      color: var(--muted);
    }

    /* small loading */
    .loading{
      opacity: .85;
      font-weight: 900;
      color: var(--muted);
      font-size: 13px;
    }
  </style>
</head>

<body>
  <div class="wrap">

    <div class="topbar">
      <div class="title">🌦️ معلومات أكثر — البصرة</div>
      <div style="display:flex; gap:8px; align-items:center;">
        <a class="btn" href="index.html">رجوع</a>
        <button class="btn" id="toggleTheme">ليل/نهار</button>
      </div>
    </div>

    <div class="grid2">
      <!-- Weather -->
      <section class="card" id="weatherCard">
        <h2 class="sectionTitle">الطقس الآن + الأسبوع</h2>

        <div class="current">
          <div class="cwLeft">
            <div class="iconBox" id="cwIcon" aria-hidden="true"></div>
            <div style="min-width:0">
              <div class="temp" id="cwTemp">--°</div>
              <div class="meta" id="cwDesc">...</div>
            </div>
          </div>

          <div class="pill" title="تقييم سريع">
            <span class="dot" id="feelDot"></span>
            <span id="feelTxt">...</span>
          </div>
        </div>

        <div class="sunline">
          <div class="sunRow">
            <span>🌅 شروق: <span id="sunriseTxt">--</span></span>
            <span>🌇 غروب: <span id="sunsetTxt">--</span></span>
          </div>

          <div class="track" aria-label="خط الشروق والغروب">
            <div class="trackFill" id="dayFill"></div>
            <div class="walker" id="walker" title="موقع الشمس">☀</div>
          </div>

          <div class="hint" id="sunHint">...</div>
        </div>

        <div style="margin-top:14px">
          <h2 class="sectionTitle" style="margin-bottom:12px">توقع 7 أيام</h2>
          <div class="days" id="daysBox">
            <div class="loading">جاري تحميل التوقع...</div>
          </div>
        </div>

        <div class="status" id="wxStatus"></div>
      </section>

      <!-- Prayer times -->
      <section class="card">
        <h2 class="sectionTitle">مواقيت الصلاة (شيعي/جعفري)</h2>

        <div class="hint">
          الحساب من AlAdhan بطريقة <b>Jafari / Shia Ithna-Ashari</b>. :contentReference[oaicite:1]{index=1}
          <br>العرض هنا بنظام 12 ساعة (ص/م) مثل ما طلبت.
        </div>

        <div class="prayerGrid" id="prayerBox">
          <div class="loading">جاري تحميل المواقيت...</div>
        </div>

        <div class="status" id="prayerStatus"></div>
      </section>
    </div>
  </div>

  <script>
    // ===== Theme toggle (يحافظ على نفس نظامك) =====
    const savedTheme = localStorage.getItem("themeMode");
    if(savedTheme === "light") document.body.classList.add("light");
    document.getElementById("toggleTheme").addEventListener("click", () => {
      document.body.classList.toggle("light");
      localStorage.setItem("themeMode", document.body.classList.contains("light") ? "light" : "dark");
    });

    // ===== Settings (البصرة) =====
    const CITY = "البصرة";
    const LAT = 30.5085, LON = 47.7804;
    const TZ = "Asia/Baghdad";

    // ===== Helpers =====
    const pad2 = n => String(n).padStart(2,"0");
    function fmt12(t24){
      // "HH:MM" -> "h:MM ص/م"
      const [hh, mm] = t24.split(":").map(Number);
      const am = hh < 12;
      const h12 = ((hh + 11) % 12) + 1;
      return `${h12}:${pad2(mm)} ${am ? "ص" : "م"}`;
    }
    function fmtTimeISO(iso){
      // "2026-02-11T06:23" -> "6:23 ص"
      const d = new Date(iso);
      const hh = d.getHours(), mm = d.getMinutes();
      const am = hh < 12;
      const h12 = ((hh + 11) % 12) + 1;
      return `${h12}:${pad2(mm)} ${am ? "ص" : "م"}`;
    }

    function weatherLabel(code){
      // مختصر عربي (WMO codes يستخدمها Open-Meteo) :contentReference[oaicite:2]{index=2}
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

    function svgIcon(kind, size=26){
      const s = size;
      // SVGs بسيطة وخفيفة (بدون صور)
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
          <g opacity=".9" fill="currentColor">
            <circle cx="9" cy="9" r="3.2"/>
          </g>
          <path d="M8.2 19h8.2a3.8 3.8 0 0 0 .3-7.6A4.8 4.8 0 0 0 7 12.6a3.2 3.2 0 0 0 1.2 6.4Z"
                fill="currentColor" opacity=".72"/>
        </svg>`;
      if(kind==="rain") return `
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
      if(kind==="showers") return svgIcon("rain", size);
      if(kind==="drizzle") return svgIcon("rain", size);
      return svgIcon("partly", size);
    }

    function feelFromTemp(t){
      if (t <= 10) return ["بارد", "cold"];
      if (t >= 32) return ["حار", "hot"];
      return ["معتدل", "ok"];
    }

    function setDot(mode){
      const dot = document.getElementById("feelDot");
      if(mode==="cold"){
        dot.style.background = "var(--cold)";
        dot.style.boxShadow = "0 0 14px rgba(59,130,246,.25)";
      } else if(mode==="hot"){
        dot.style.background = "var(--hot)";
        dot.style.boxShadow = "0 0 14px rgba(244,63,94,.22)";
      } else {
        dot.style.background = "var(--ok)";
        dot.style.boxShadow = "0 0 14px rgba(34,197,94,.22)";
      }
    }

    // ===== Weather (Open-Meteo) =====
    async function loadWeather(){
      const daysBox = document.getElementById("daysBox");
      const wxStatus = document.getElementById("wxStatus");
      try{
        // daily sunrise/sunset + weather_code + temps (Open-Meteo docs) 
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${LAT}&longitude=${LON}` +
          `&current=temperature_2m,weather_code` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
          `&forecast_days=7` +
          `&timezone=${encodeURIComponent(TZ)}`;

        const t0 = performance.now();
        const res = await fetch(url, { cache: "no-store" });
        const ms = Math.round(performance.now() - t0);
        const data = await res.json();

        const curT = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const [desc, kind] = weatherLabel(code);

        document.getElementById("cwTemp").textContent = `${curT}°`;
        document.getElementById("cwDesc").textContent = `${CITY} — ${desc}`;
        document.getElementById("cwIcon").innerHTML = svgIcon(kind, 30);

        const [feelTxt, feelMode] = feelFromTemp(curT);
        document.getElementById("feelTxt").textContent = feelTxt;
        setDot(feelMode);

        // sunrise/sunset today
        const sunriseISO = data.daily.sunrise?.[0];
        const sunsetISO  = data.daily.sunset?.[0];
        document.getElementById("sunriseTxt").textContent = sunriseISO ? fmtTimeISO(sunriseISO) : "--";
        document.getElementById("sunsetTxt").textContent  = sunsetISO  ? fmtTimeISO(sunsetISO)  : "--";

        // day progress line
        if(sunriseISO && sunsetISO){
          const now = new Date();
          const sr = new Date(sunriseISO);
          const ss = new Date(sunsetISO);

          const total = Math.max(1, ss - sr);
          const done = Math.min(total, Math.max(0, now - sr));
          const pct = Math.round((done / total) * 100);

          document.getElementById("dayFill").style.width = `${pct}%`;
          document.getElementById("walker").style.left = `${pct}%`;

          const leftMs = Math.max(0, ss - now);
          const leftH = Math.floor(leftMs / 3600000);
          const leftM = Math.floor((leftMs % 3600000) / 60000);
          document.getElementById("sunHint").textContent =
            (now < sr) ? "🌙 قبل الشروق…" :
            (now > ss) ? "🌙 بعد الغروب…" :
            `☀️ باقي على الغروب: ${leftH}س ${leftM}د — تقدّم النهار: ${pct}%`;
        } else {
          document.getElementById("sunHint").textContent = "تعذر قراءة الشروق/الغروب.";
        }

        // 7-day cards
        const times = data.daily.time || [];
        const wx = data.daily.weather_code || [];
        const tmax = data.daily.temperature_2m_max || [];
        const tmin = data.daily.temperature_2m_min || [];

        daysBox.innerHTML = "";
        for(let i=0;i<Math.min(7, times.length);i++){
          const d = new Date(times[i] + "T12:00:00");
          const name = new Intl.DateTimeFormat("ar-IQ", { weekday:"long" }).format(d);
          const hi = Math.round(tmax[i]);
          const lo = Math.round(tmin[i]);
          const [dDesc, dKind] = weatherLabel(wx[i]);

          const el = document.createElement("div");
          el.className = "day";
          el.innerHTML = `
            <div class="dTop">
              <div class="dName">${name}</div>
              <div class="dIco" title="${dDesc}" style="color: rgba(255,255,255,.92)">${svgIcon(dKind, 26)}</div>
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
        document.getElementById("daysBox").innerHTML = `<div class="loading">تعذر تحميل الطقس.</div>`;
        document.getElementById("wxStatus").textContent = "";
      }
    }

    // ===== Prayer times (AlAdhan - method 0 Shia) =====
    async function loadPrayerTimes(){
      const box = document.getElementById("prayerBox");
      const st = document.getElementById("prayerStatus");
      try{
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // method=0 => Jafari / Shia Ithna-Ashari 
        const url =
          `https://api.aladhan.com/v1/timings/${pad2(day)}-${pad2(month)}-${year}` +
          `?latitude=${LAT}&longitude=${LON}&method=0&timezonestring=${encodeURIComponent(TZ)}`;

        const t0 = performance.now();
        const res = await fetch(url, { cache: "no-store" });
        const ms = Math.round(performance.now() - t0);
        const data = await res.json();

        const T = data?.data?.timings || {};
        // نعرض أهم المواقيت (جعفري)
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
          // val مثل "05:12" أو "05:12 (GMT+3)" — نخلي فقط HH:MM
          const clean = String(val).slice(0,5);
          const el = document.createElement("div");
          el.className = "pt";
          el.innerHTML = `
            <div class="ptName">${name}</div>
            <div class="ptTime">${fmt12(clean)}</div>
          `;
          box.appendChild(el);
        }

        st.innerHTML = `
          <span>API: AlAdhan</span>
          <span>Ping: ${ms}ms</span>
          <span>آخر تحديث: ${new Date().toLocaleTimeString("ar-IQ")}</span>
        `;
      }catch(e){
        box.innerHTML = `<div class="loading">تعذر تحميل المواقيت.</div>`;
        st.textContent = "";
      }
    }

    // ===== Init =====
    loadWeather();
    loadPrayerTimes();

    // تحديث بسيط (خفيف)
    setInterval(loadWeather, 15 * 60 * 1000);
    setInterval(loadPrayerTimes, 60 * 60 * 1000);
  </script>
</body>
</html>
