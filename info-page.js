<script>
(() => {
  const errBox = document.getElementById("errBox");
  function showErr(msg){
    if(!errBox) return;
    errBox.style.display = "block";
    errBox.textContent = "⚠️ " + msg;
  }

  // Theme toggle (مثل نظامك)
  const savedTheme = localStorage.getItem("themeMode");
  if(savedTheme === "light") document.body.classList.add("light");
  const toggle = document.getElementById("toggleTheme");
  if(toggle){
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("light");
      localStorage.setItem("themeMode", document.body.classList.contains("light") ? "light" : "dark");
    });
  }

  // Basra
  const CITY = "البصرة";
  const LAT = 30.5085, LON = 47.7804;
  const TZ = "Asia/Baghdad";

  const pad2 = n => String(n).padStart(2,"0");

  function fmt12(hhmm){
    const [hh, mm] = hhmm.split(":").map(Number);
    const am = hh < 12;
    const h12 = ((hh + 11) % 12) + 1;
    return `${h12}:${pad2(mm)} ${am ? "ص" : "م"}`;
  }

  function weatherLabel(code){
    if (code === 0) return ["صحو","☀️"];
    if ([1,2].includes(code)) return ["غائم جزئياً","🌤️"];
    if (code === 3) return ["غائم","☁️"];
    if ([45,48].includes(code)) return ["ضباب","🌫️"];
    if ([51,53,55].includes(code)) return ["رذاذ","🌦️"];
    if ([61,63,65].includes(code)) return ["مطر","🌧️"];
    if ([71,73,75,77].includes(code)) return ["ثلج","🌨️"];
    if ([80,81,82].includes(code)) return ["زخات","🌧️"];
    if ([95,96,99].includes(code)) return ["عاصفة","⛈️"];
    return ["متغير","⛅"];
  }

  function setText(id, txt){
    const el = document.getElementById(id);
    if(el) el.textContent = txt;
  }

  async function loadWeather(){
    try{
      const daysBox = document.getElementById("daysBox");
      const wxStatus = document.getElementById("wxStatus");
      if(daysBox) daysBox.innerHTML = `<div class="loading">جاري تحميل التوقع...</div>`;

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

      if(!res.ok){
        const body = await res.text().catch(()=> "");
        throw new Error(`Open-Meteo HTTP ${res.status} — ${body.slice(0,120)}`);
      }

      const data = await res.json();

      const curT = Math.round(data.current.temperature_2m);
      const code = data.current.weather_code;
      const [desc, ico] = weatherLabel(code);

      setText("cwTemp", `${curT}°`);
      setText("cwDesc", `${CITY} — ${desc} ${ico}`);

      // sunrise/sunset
      const sunriseISO = data.daily.sunrise?.[0];
      const sunsetISO  = data.daily.sunset?.[0];
      if(sunriseISO) setText("sunriseTxt", new Date(sunriseISO).toLocaleTimeString("ar-IQ",{hour:"numeric",minute:"2-digit"}));
      if(sunsetISO)  setText("sunsetTxt",  new Date(sunsetISO).toLocaleTimeString("ar-IQ",{hour:"numeric",minute:"2-digit"}));

      // 7-day cards (بسيطة)
      const times = data.daily.time || [];
      const wx = data.daily.weather_code || [];
      const tmax = data.daily.temperature_2m_max || [];
      const tmin = data.daily.temperature_2m_min || [];

      if(daysBox){
        daysBox.innerHTML = "";
        for(let i=0;i<Math.min(7,times.length);i++){
          const d = new Date(times[i] + "T12:00:00");
          const name = new Intl.DateTimeFormat("ar-IQ",{weekday:"long"}).format(d);
          const hi = Math.round(tmax[i]);
          const lo = Math.round(tmin[i]);
          const [dDesc, dIco] = weatherLabel(wx[i]);

          const el = document.createElement("div");
          el.className = "day";
          el.innerHTML = `
            <div class="dTop">
              <div class="dName">${name}</div>
              <div class="dIco" aria-hidden="true">${dIco}</div>
            </div>
            <div class="dTemp">
              <div class="hi">${hi}°</div>
              <div class="lo">${lo}°</div>
            </div>
            <div class="dDesc">${dDesc}</div>
          `;
          daysBox.appendChild(el);
        }
      }

      if(wxStatus){
        wxStatus.innerHTML = `
          <span>Open-Meteo</span>
          <span>Ping: ${ms}ms</span>
          <span>آخر تحديث: ${new Date().toLocaleTimeString("ar-IQ")}</span>
        `;
      }

    }catch(e){
      showErr("فشل تحميل الطقس: " + (e?.message || e));
      const daysBox = document.getElementById("daysBox");
      if(daysBox) daysBox.innerHTML = `<div class="loading">تعذر تحميل الطقس.</div>`;
    }
  }

  async function loadPrayerTimes(){
    try{
      const box = document.getElementById("prayerBox");
      const st  = document.getElementById("prayerStatus");
      if(box) box.innerHTML = `<div class="loading">جاري تحميل المواقيت...</div>`;

      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      // method=0 (Jafari)
      const url =
        `https://api.aladhan.com/v1/timings/${pad2(day)}-${pad2(month)}-${year}` +
        `?latitude=${LAT}&longitude=${LON}&method=0&timezonestring=${encodeURIComponent(TZ)}`;

      const t0 = performance.now();
      const res = await fetch(url, { cache: "no-store" });
      const ms = Math.round(performance.now() - t0);

      if(!res.ok){
        const body = await res.text().catch(()=> "");
        throw new Error(`AlAdhan HTTP ${res.status} — ${body.slice(0,120)}`);
      }

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

      if(box){
        box.innerHTML = "";
        for(const [name, val] of items){
          const clean = String(val).slice(0,5);
          const el = document.createElement("div");
          el.className = "pt";
          el.innerHTML = `<div class="ptName">${name}</div><div class="ptTime">${fmt12(clean)}</div>`;
          box.appendChild(el);
        }
      }

      if(st){
        st.innerHTML = `
          <span>AlAdhan</span>
          <span>Ping: ${ms}ms</span>
          <span>آخر تحديث: ${new Date().toLocaleTimeString("ar-IQ")}</span>
        `;
      }

    }catch(e){
      showErr("فشل تحميل مواقيت الصلاة: " + (e?.message || e));
      const box = document.getElementById("prayerBox");
      if(box) box.innerHTML = `<div class="loading">تعذر تحميل المواقيت.</div>`;
    }
  }

  // تشغيل
  loadWeather();
  loadPrayerTimes();

  // تحديثات خفيفة
  setInterval(loadWeather, 15 * 60 * 1000);
  setInterval(loadPrayerTimes, 60 * 60 * 1000);

})();
</script>
