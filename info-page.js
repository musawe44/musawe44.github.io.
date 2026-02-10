// info-page.js — صفحة المعلومات (طقس أسبوع + لون حسب الحرارة + شروق/غروب + صلاة جعفري + حدث اليوم + دعاء اليوم)
// مصادر: Open-Meteo :contentReference[oaicite:3]{index=3}, Wikimedia On this day :contentReference[oaicite:4]{index=4}, AlAdhan (Jafari method=0) :contentReference[oaicite:5]{index=5}

(() => {
  const TZ = "Asia/Baghdad";
  const CITY = "البصرة";
  const LAT = 30.5085, LON = 47.7804;

  // ===== Theme =====
  const toggleTheme = document.getElementById("toggleTheme");
  const savedTheme = localStorage.getItem("themeMode");
  if (savedTheme === "light") document.body.classList.add("light");
  toggleTheme.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.toggle("light");
    localStorage.setItem("themeMode", document.body.classList.contains("light") ? "light" : "dark");
  });

  // ===== Ping (اختبار بسيط) =====
  const pingTxt = document.getElementById("pingTxt");
  (async () => {
    const t0 = performance.now();
    try {
      await fetch("https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0", { cache: "no-store" });
      const ms = Math.round(performance.now() - t0);
      pingTxt.textContent = `Ping: ${ms}ms`;
    } catch {
      pingTxt.textContent = `Ping: -`;
    }
  })();

  // ===== Helpers =====
  const pad2 = (n) => String(n).padStart(2, "0");

  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

  function baghdadMD() {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, month:"2-digit", day:"2-digit" }).formatToParts(new Date());
    const m = parts.find(p=>p.type==="month")?.value;
    const d = parts.find(p=>p.type==="day")?.value;
    return { m, d };
  }

  function formatDayName(isoDate){
    const d = new Date(isoDate + "T12:00:00");
    return new Intl.DateTimeFormat("ar-IQ", { timeZone: TZ, weekday:"long" }).format(d);
  }

  // 12h AM/PM
  function to12h(hhmm){
    // hhmm "05:12"
    const [hS, mS] = hhmm.split(":");
    let h = Number(hS);
    const m = mS;
    const am = h < 12;
    h = h % 12; if (h === 0) h = 12;
    return `${h}:${m} ${am ? "AM" : "PM"}`;
  }

  // لون حسب درجة الحرارة (تدرج بسيط)
  function tempColor(temp){
    // 0..45
    const t = clamp((temp - 0) / 45, 0, 1);
    // نرجع rgba أبيض لكن بشدة مختلفة حتى يبقى متناسق مع الثيم
    // كلما حر أعلى يصير أوضح
    const a = 0.20 + t * 0.35;
    return `rgba(255,255,255,${a.toFixed(3)})`;
  }

  // ===== 1) طقس الأسبوع (Open-Meteo) =====
  const wxCard = document.getElementById("wxCard");
  const wxMeta = document.getElementById("wxMeta");
  const weekEl = document.getElementById("week");

  async function loadWeekWeather(){
    wxMeta.textContent = "تحميل...";
    weekEl.innerHTML = "";

    try{
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${LAT}&longitude=${LON}` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset` +
        `&timezone=${encodeURIComponent(TZ)}`;

      const res = await fetch(url, { cache:"no-store" });
      const data = await res.json();

      const times = data?.daily?.time || [];
      const tmax  = data?.daily?.temperature_2m_max || [];
      const tmin  = data?.daily?.temperature_2m_min || [];
      const sunrise = data?.daily?.sunrise?.[0];
      const sunset  = data?.daily?.sunset?.[0];

      wxMeta.textContent = `${CITY} • 7 أيام • شروق ${sunrise?.split("T")?.[1] || "--:--"} — غروب ${sunset?.split("T")?.[1] || "--:--"}`;

      // لوّن كرت الطقس حسب حرارة اليوم الأول (الجو العام)
      const todayMax = Number(tmax?.[0]);
      wxCard.style.background = `linear-gradient(180deg, ${tempColor(todayMax)}, rgba(255,255,255,.06))`;

      times.slice(0,7).forEach((iso, i) => {
        const name = formatDayName(iso);
        const max = Math.round(Number(tmax[i]));
        const min = Math.round(Number(tmin[i]));
        const pct = clamp((max - 0) / 45, 0, 1);
        const fillW = Math.round(pct * 100);

        const box = document.createElement("div");
        box.className = "day";
        box.style.background = `linear-gradient(180deg, ${tempColor(max)}, rgba(255,255,255,.06))`;

        box.innerHTML = `
          <p class="dName">${name}</p>
          <p class="dTemp">Max ${max}° • Min ${min}°</p>
          <div class="tempBar"><div class="tempFill" style="width:${fillW}%"></div></div>
        `;
        weekEl.appendChild(box);
      });

      // خزّن الشروق والغروب للاستعمال بالصلاة
      return { sunrise: data?.daily?.sunrise?.[0], sunset: data?.daily?.sunset?.[0] };
    }catch(e){
      wxMeta.textContent = "تعذر تحميل طقس الأسبوع";
      return { sunrise:null, sunset:null };
    }
  }

  // ===== 2) صلاة جعفري (AlAdhan) + 12 ساعة =====
  const sunMeta = document.getElementById("sunMeta");
  const prayersEl = document.getElementById("prayers");

  function makePrayer(name, time){
    const div = document.createElement("div");
    div.className = "pr";
    div.innerHTML = `<p class="prName">${name}</p><p class="prTime">${time || "--:--"}</p>`;
    return div;
  }

  async function loadPrayerTimes(){
    prayersEl.innerHTML = "";
    sunMeta.textContent = "تحميل...";

    try{
      // AlAdhan timings endpoint (lat/lon + method=0 Jafari) :contentReference[oaicite:6]{index=6}
      const today = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year:"numeric", month:"2-digit", day:"2-digit" }).format(new Date());
      const [Y,M,D] = today.split("-");

      const url =
        `https://api.aladhan.com/v1/timings/${D}-${M}-${Y}` +
        `?latitude=${LAT}&longitude=${LON}` +
        `&method=0&timezonestring=${encodeURIComponent(TZ)}`;

      const res = await fetch(url, { cache:"no-store" });
      const data = await res.json();
      const t = data?.data?.timings || {};

      // أوقات مهمة (شيعي): فجر، شروق، ظهر، عصر، مغرب، عشاء
      // (نستخدم التسميات الشائعة في الواجهة)
      const fajr = t.Fajr?.slice(0,5);
      const sunrise = t.Sunrise?.slice(0,5);
      const dhuhr = t.Dhuhr?.slice(0,5);
      const asr = t.Asr?.slice(0,5);
      const maghrib = t.Maghrib?.slice(0,5);
      const isha = t.Isha?.slice(0,5);
      const sunset = t.Sunset?.slice(0,5);

      sunMeta.textContent =
        `شروق ${to12h(sunrise || "--:--")} • غروب ${to12h(sunset || "--:--")} • صيغة 12 ساعة`;

      prayersEl.appendChild(makePrayer("الفجر", to12h(fajr || "--:--")));
      prayersEl.appendChild(makePrayer("الشروق", to12h(sunrise || "--:--")));
      prayersEl.appendChild(makePrayer("الظهر", to12h(dhuhr || "--:--")));
      prayersEl.appendChild(makePrayer("العصر", to12h(asr || "--:--")));
      prayersEl.appendChild(makePrayer("المغرب", to12h(maghrib || "--:--")));
      prayersEl.appendChild(makePrayer("العشاء", to12h(isha || "--:--")));
    }catch(e){
      sunMeta.textContent = "تعذر تحميل مواقيت الصلاة";
    }
  }

  // ===== 3) حدث حقيقي: في مثل هذا اليوم (Wikimedia) =====
  const otdTxt = document.getElementById("otdTxt");
  const otdMore = document.getElementById("otdMore");

  async function loadOnThisDay(){
    try{
      const { m, d } = baghdadMD();
      const url = `https://api.wikimedia.org/feed/v1/wikipedia/ar/onthisday/events/${m}/${d}`; // :contentReference[oaicite:7]{index=7}
      const res = await fetch(url, { cache:"no-store" });
      const data = await res.json();
      const arr = Array.isArray(data?.events) ? data.events : [];
      if (!arr.length) throw new Error("no events");

      const pick = arr[Math.floor(Math.random() * arr.length)];
      const year = pick.year ? `(${pick.year}) ` : "";
      const text = (pick.text || "").replace(/\s+/g," ").trim();

      otdTxt.textContent = `${year}${text}`.slice(0, 220) + (text.length > 220 ? "…" : "");
      otdMore.href = "https://ar.wikipedia.org/wiki/" + encodeURIComponent("ويكيبيديا:في_مثل_هذا_اليوم");
    }catch(e){
      otdTxt.textContent = "تعذر تحميل حدث اليوم";
      otdMore.href = "https://ar.wikipedia.org/";
    }
  }

  // ===== 4) دعاء اليوم (شيعي) — نص قصير + رابط قراءة كاملة =====
  const duaTxt = document.getElementById("duaTxt");
  const duaMore = document.getElementById("duaMore");

  // نعرض “مقتطف قصير” فقط حتى يبقى خفيف وما يصير ثقل/أخطاء
  // مصادر موثوقة: al-islam / duas.org :contentReference[oaicite:8]{index=8}
  const DUAS = {
    // 0=Sunday ... 6=Saturday (حسب JS)
    0: {
      title: "دعاء يوم الأحد",
      excerpt: "بِسْمِ اللهِ الَّذِي لَا أَرْجُو إِلَّا فَضْلَهُ…",
      link: "https://supplications.al-islam.org/sahifa-sajjadiya/55-supplication-of-sunday.php"
    },
    1: {
      title: "دعاء يوم الاثنين",
      excerpt: "اللَّهُمَّ اجْعَلْ أَوَّلَ يَوْمِي هَذَا صَلَاحاً…",
      link: "https://www.islam4u.com/ar/adiieh/%D8%AF%D8%B9%D8%A7%D8%A1-%D9%8A%D9%88%D9%85-%D8%A7%D9%84%D8%A7%D8%AB%D9%86%D9%8A%D9%86"
    },
    2: { title: "دعاء يوم الثلاثاء", excerpt: "اللَّهُمَّ اجْعَلْنِي أَخْشَاكَ كَأَنِّي أَرَاكَ…", link: "https://www.islam4u.com/ar/adiieh" },
    3: { title: "دعاء يوم الأربعاء", excerpt: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي…", link: "https://www.islam4u.com/ar/adiieh" },
    4: { title: "دعاء يوم الخميس", excerpt: "اللَّهُمَّ اجْعَلْنِي أَوْفَرَ عِبَادِكَ نَصِيباً…", link: "https://www.islam4u.com/ar/adiieh" },
    5: { title: "دعاء يوم الجمعة", excerpt: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّد…", link: "https://www.islam4u.com/ar/adiieh" },
    6: { title: "دعاء يوم السبت", excerpt: "اللَّهُمَّ اجْعَلْنِي مِنْ أَفْضَلِ عَبِيدِكَ نَصِيباً…", link: "https://www.islam4u.com/ar/adiieh" }
  };

  function loadDuaOfDay(){
    const day = Number(new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday:"short" })
      .formatToParts(new Date()).length); // ما نستخدمها
    // نحسب اليوم بدقة:
    const jsDay = Number(new Intl.DateTimeFormat("en-CA", { timeZone: TZ, weekday:"short" })
      .format(new Date())
      .replace(/.*/,"")); // غير موثوق، لذلك نستخدم طريقة ثانية:

    // الأسلم: نجيب التاريخ بغداد كـ ISO ونرجع Date محلي
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year:"numeric", month:"2-digit", day:"2-digit" }).format(new Date());
    const [Y,M,D] = parts.split("-").map(Number);
    const baghdadDate = new Date(Y, M-1, D, 12, 0, 0);
    const wd = baghdadDate.getDay(); // 0..6 (Sunday..Saturday)

    const item = DUAS[wd] || DUAS[0];
    duaTxt.textContent = `${item.title}\n${item.excerpt}`;
    duaMore.href = item.link;
  }

  // ===== Run all =====
  (async () => {
    await loadWeekWeather();
    await loadPrayerTimes();
    await loadOnThisDay();
    loadDuaOfDay();
  })();
})();
