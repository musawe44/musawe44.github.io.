// event1111.js — 11:11 Fullscreen Cinematic (Black + Heart + Glow Text + 60s Progress)
(() => {
  const AUDIO_FILE = "eleven.mp3.mp3";   // اسم صوت الحدث
  const DURATION_MS = 60 * 1000;         // ✅ 60 ثانية
  const MAX_VOL = 0.40;                  // أعلى صوت
  const FADE_IN_MS = 900;
  const FADE_OUT_MS = 800;

  const TIMES = [{ h: 11, m: 11 }, { h: 23, m: 11 }];
  let lastKey = null;
  let running = false;
  let tickTimer = null;

  const lines = [
    "11:11… مو صدفة.",
    "بهذه الدقيقة… اسمچ مرّ بباله.",
    "إذا تحسين بشي… يمكن هو نفس الشعور.",
    "هسه بالضبط… قلبه يذكرك.",
    "11:11… لحظة تخص قلبين."
  ];
  const pickLine = () => lines[Math.floor(Math.random() * lines.length)];
  const $ = (id) => document.getElementById(id);

  function iraqHHMM() {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Baghdad",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date());
  }

  function minuteKey() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Baghdad",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date());
  }

  function matchesNow(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return TIMES.some(t => t.h === h && t.m === m);
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function fadeVolume(audio, to, ms) {
    const from = audio.volume;
    const t0 = performance.now();
    to = clamp(to, 0, 1);
    return new Promise(res => {
      function step(t) {
        const p = Math.min(1, (t - t0) / ms);
        audio.volume = from + (to - from) * p;
        p < 1 ? requestAnimationFrame(step) : res();
      }
      requestAnimationFrame(step);
    });
  }

  function ensureUI() {
    let ov = $("hb1111");
    if (ov) return ov;

    const style = document.createElement("style");
    style.textContent = `
      #hb1111{
        position:fixed; inset:0; z-index:999999;
        display:none;
        background: rgba(0,0,0,.80);           /* ✅ غامق */
        backdrop-filter: blur(10px);
      }
      #hb1111.show{ display:block; }

      /* القلب بالخلف (أبيض) ينبض ببطء */
      #hbHeart{
        position:absolute;
        left:50%; top:50%;
        width:min(380px, 70vw);
        height:min(380px, 70vw);
        transform: translate(-50%, -55%) rotate(45deg);
        background: rgba(255,255,255,.12);
        border-radius: 26px;
        filter: blur(0px);
        opacity: .75;
        animation: hbSlow 1.9s ease-in-out infinite;
      }
      #hbHeart:before, #hbHeart:after{
        content:"";
        position:absolute;
        width:100%;
        height:100%;
        background: rgba(255,255,255,.12);
        border-radius: 50%;
      }
      #hbHeart:before{ left:-50%; top:0; }
      #hbHeart:after { left:0; top:-50%; }

      /* النص قدّام */
      #hbTextWrap{
        position:absolute;
        left:50%; top:50%;
        transform: translate(-50%, -55%);
        width:min(920px, 92vw);
        text-align:center;
        font-family: Cairo, system-ui, Arial;
        padding: 12px 10px;
      }

      #hbTitle{
        margin:0;
        font-weight: 900;
        font-size: 78px;
        letter-spacing: .7px;
        color: rgba(255,255,255,.98);
        /* توهج متغير حول النص */
        text-shadow:
          0 0 10px rgba(255,255,255,.20),
          0 0 26px rgba(255,255,255,.18),
          0 0 60px rgba(255,255,255,.08);
        animation: glowPulse 2.4s ease-in-out infinite;
      }

      #hbLine{
        margin-top: 10px;
        font-weight: 900;
        font-size: 22px;
        color: rgba(255,255,255,.92);
        text-shadow:
          0 0 8px rgba(255,255,255,.15),
          0 0 22px rgba(255,255,255,.12);
        opacity: .95;
      }

      /* عدّاد تنازلي */
      #hbCountdown{
        margin-top: 14px;
        font-weight: 900;
        font-size: 16px;
        color: rgba(255,255,255,.86);
        letter-spacing: .2px;
        opacity: .95;
      }

      /* شريط التقدم لمدة دقيقة */
      #hbBarWrap{
        position:absolute;
        left:50%;
        bottom: 36px;
        transform: translateX(-50%);
        width:min(820px, 92vw);
        height: 10px;
        border-radius: 999px;
        background: rgba(255,255,255,.10);
        border: 1px solid rgba(255,255,255,.12);
        overflow:hidden;
      }
      #hbBar{
        height: 100%;
        width: 0%;
        border-radius: 999px;
        background: linear-gradient(90deg,
          rgba(255,255,255,.10),
          rgba(255,255,255,.85),
          rgba(255,255,255,.10)
        );
        box-shadow: 0 0 30px rgba(255,255,255,.22);
      }

      /* حركة القلب بطيئة (نبض) */
      @keyframes hbSlow{
        0%   { transform: translate(-50%, -55%) rotate(45deg) scale(.92); opacity:.45; filter: blur(10px); }
        50%  { transform: translate(-50%, -55%) rotate(45deg) scale(1.02); opacity:.85; filter: blur(18px); }
        100% { transform: translate(-50%, -55%) rotate(45deg) scale(.92); opacity:.45; filter: blur(10px); }
      }

      /* توهج النص يتغير */
      @keyframes glowPulse{
        0%,100%{
          text-shadow:
            0 0 10px rgba(255,255,255,.18),
            0 0 26px rgba(255,255,255,.14),
            0 0 60px rgba(255,255,255,.08);
        }
        50%{
          text-shadow:
            0 0 14px rgba(255,255,255,.26),
            0 0 38px rgba(255,255,255,.20),
            0 0 90px rgba(255,255,255,.12);
        }
      }

      @media (max-width: 520px){
        #hbTitle{ font-size: 58px; }
        #hbLine{ font-size: 18px; }
        #hbBarWrap{ height: 9px; bottom: 26px; }
      }
    `;
    document.head.appendChild(style);

    ov = document.createElement("div");
    ov.id = "hb1111";
    ov.innerHTML = `
      <div id="hbHeart" aria-hidden="true"></div>

      <div id="hbTextWrap">
        <h1 id="hbTitle">11:11</h1>
        <div id="hbLine">...</div>
        <div id="hbCountdown">00:60</div>
      </div>

      <div id="hbBarWrap" aria-hidden="true">
        <div id="hbBar"></div>
      </div>
    `;
    document.body.appendChild(ov);
    return ov;
  }

  function fmtSecondsLeft(msLeft) {
    const s = Math.max(0, Math.ceil(msLeft / 1000));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  async function runIntro(label = "11:11") {
    if (running) return;
    running = true;

    const audio = $("bgAudio");
    if (!audio) { running = false; return; }

    const ui = ensureUI();
    const titleEl = $("hbTitle");
    const lineEl = $("hbLine");
    const cdEl = $("hbCountdown");
    const barEl = $("hbBar");

    if (titleEl) titleEl.textContent = label;
    if (lineEl) lineEl.textContent = pickLine();

    // خزّن حالة الصوت الحالي
    const saved = {
      src: audio.src,
      time: audio.currentTime || 0,
      paused: audio.paused,
      volume: audio.volume,
      loop: audio.loop
    };

    // اظهر الواجهة
    ui.classList.add("show");

    const startTime = performance.now();

    // تحديث العدّاد + شريط التقدم (دقيقة كاملة)
    clearInterval(tickTimer);
    tickTimer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const left = Math.max(0, DURATION_MS - elapsed);
      const pct = Math.min(100, (elapsed / DURATION_MS) * 100);

      if (barEl) barEl.style.width = pct.toFixed(2) + "%";
      if (cdEl) cdEl.textContent = fmtSecondsLeft(left);

      if (left <= 0) clearInterval(tickTimer);
    }, 100);

    try {
      // خفّض صوت الموسيقى الحالية شوي (إذا كانت شغالة)
      if (!saved.paused) await fadeVolume(audio, Math.min(saved.volume, 0.10), 650);

      // شغّل صوت الحدث فقط
      audio.pause();
      audio.src = AUDIO_FILE;
      audio.loop = false;
      audio.load();
      audio.volume = 0;

      await audio.play();
      await fadeVolume(audio, MAX_VOL, FADE_IN_MS);

      // نهاية الدقيقة
      setTimeout(async () => {
        try {
          await fadeVolume(audio, 0, FADE_OUT_MS);
          audio.pause();

          // رجوع الحالة مثل ما كانت
          audio.src = saved.src;
          audio.loop = saved.loop;
          audio.load();
          audio.currentTime = saved.time || 0;
          audio.volume = saved.volume;

          if (!saved.paused) await audio.play();
        } catch {
          // تجاهل
        } finally {
          clearInterval(tickTimer);
          tickTimer = null;

          // reset bar/counter
          if (barEl) barEl.style.width = "0%";
          if (cdEl) cdEl.textContent = "00:00";

          ui.classList.remove("show");
          running = false;
        }
      }, DURATION_MS);

    } catch {
      clearInterval(tickTimer);
      tickTimer = null;
      ui.classList.remove("show");
      running = false;
    }
  }

  // ✅ زر الاختبار: نخليه يعرض 11:11 (مو TEST)
  window.TEST_1111 = () => runIntro("11:11");

  // ✅ تشغيل تلقائي بالوقت الحقيقي
  setInterval(() => {
    const t = iraqHHMM();
    if (!matchesNow(t)) return;

    const k = minuteKey();
    if (k === lastKey) return;
    lastKey = k;

    const [hh] = t.split(":").map(Number);
    runIntro(hh === 11 ? "11:11" : "23:11");
  }, 1000);
})();
window.start1111Preview = () => {
  // هنا نادِ دالة تشغيل الحدث عندك
  // مثال: startEvent();
  // أو أي اسم دالة عندك
};

