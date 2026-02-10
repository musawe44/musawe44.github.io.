(() => {
  const CFG = window.APP_CONFIG || {};

  // ===== Elements =====
  const timeNow = document.getElementById("timeNow");
  const timeGhost = document.getElementById("timeGhost");
  const dateTxt = document.getElementById("dateTxt");
  const wxTxt = document.getElementById("wxTxt");
  const quoteEl = document.getElementById("mainQuote");
  const toggleTheme = document.getElementById("toggleTheme");

  const video = document.getElementById("bgVideo");
  const srcEl = document.getElementById("bgSource");

  // ===== Footer year =====
  const y = document.getElementById("y");
  if (y) y.textContent = String(new Date().getFullYear());

  // ===== Theme toggle =====
  if (toggleTheme) {
    const savedTheme = localStorage.getItem("themeMode");
    if (savedTheme === "light") document.body.classList.add("light");
    toggleTheme.addEventListener("click", () => {
      document.body.classList.toggle("light");
      localStorage.setItem(
        "themeMode",
        document.body.classList.contains("light") ? "light" : "dark"
      );
    });
  }

  // ===== Background video (safe URL) =====
  if (CFG.backgroundVideo?.enabled !== false && video) {
    const file = CFG.backgroundVideo?.file || "bg.mp4.mp4";
    const url = new URL(file, document.baseURI).href;

    if (srcEl) srcEl.src = url;
    else video.src = url;

    video.muted = CFG.backgroundVideo?.muted !== false;
    video.loop = CFG.backgroundVideo?.loop !== false;
    video.autoplay = true;
    video.playsInline = true;

    const rate = Number(CFG.backgroundVideo?.playbackRate ?? 1);
    if (!Number.isNaN(rate)) video.playbackRate = rate;

    // حاول تشغيله + محاولة ثانية عند أول تفاعل
    video.play().catch(() => {});
    document.addEventListener("click", () => video.play().catch(() => {}), { once: true });

    if (CFG.performance?.pauseVideoWhenHidden) {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) video.pause();
        else video.play().catch(() => {});
      });
    }
  }

  // ===== Google Sheet note =====
  async function loadQuote(){
    try{
      if (!CFG.noteFromSheet?.enabled || !quoteEl) return;
      const res = await fetch(CFG.noteFromSheet.csvUrl, { cache: "no-store" });
      let text = await res.text();
      text = text.replace(/^\uFEFF/, "");
      const commaIndex = text.indexOf(",");
      if (commaIndex === -1) return;
      let value = text.slice(commaIndex + 1).trim();
      value = value.replace(/^"|"$/g, "");
      quoteEl.textContent = value || CFG.noteFromSheet.fallbackText || "…";
    } catch {
      if (quoteEl) quoteEl.textContent = CFG.noteFromSheet?.fallbackText || "…";
    }
  }
  loadQuote();

  // ===== Time/date =====
  function formatIraqTime(){
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: CFG.clock?.timezone || "Asia/Baghdad",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date());
  }

  function formatIraqDate(){
    return new Intl.DateTimeFormat(CFG.clock?.locale || "ar-IQ", {
      timeZone: CFG.clock?.timezone || "Asia/Baghdad",
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date());
  }

  function tick(){
    const t = formatIraqTime();
    if (timeNow) timeNow.textContent = t;
    if (timeGhost) timeGhost.textContent = t;
    if (dateTxt) dateTxt.textContent = formatIraqDate();
  }
  tick();
  setInterval(tick, 1000);

  // ===== Weather (Open-Meteo) =====
  function codeToArabic(code){
    if (code === 0) return ["☀️","صحو"];
    if ([1,2].includes(code)) return ["🌤️","غائم جزئياً"];
    if (code === 3) return ["☁️","غائم"];
    if ([45,48].includes(code)) return ["🌫️","ضباب"];
    if ([51,53,55].includes(code)) return ["🌦️","رذاذ"];
    if ([61,63,65].includes(code)) return ["🌧️","مطر"];
    if ([71,73,75,77].includes(code)) return ["🌨️","ثلج"];
    if ([80,81,82].includes(code)) return ["🌧️","زخات"];
    if ([95,96,99].includes(code)) return ["⛈️","عاصفة"];
    return ["⛅","متغير"];
  }

  async function fetchWeather(){
    try{
      if (!CFG.weather?.enabled || !wxTxt) return;
      const lat = CFG.weather.lat, lon = CFG.weather.lon;
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,weather_code` +
        `&timezone=Asia%2FBaghdad`;

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      const temp = Math.round(data.current.temperature_2m);
      const code = data.current.weather_code;
      const [ico, desc] = codeToArabic(code);
      wxTxt.textContent = `${CFG.weather.cityName}: ${temp}° — ${desc} ${ico}`;
    }catch{
      if (wxTxt) wxTxt.textContent = "تعذر جلب الطقس";
    }
  }

  fetchWeather();
  const mins = Math.max(5, Number(CFG.weather?.refreshMinutes || 10));
  setInterval(fetchWeather, mins * 60 * 1000);
})();
