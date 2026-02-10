// event1111.js — Romantic 11:11 (فخم) — ملف واحد
(() => {
  const audioEl = document.getElementById("bgAudio");
  const titleEl = document.getElementById("trackTitle");
  const btnPlay = document.getElementById("audioBtn");
  const bgVideo = document.getElementById("bgVideo") || document.querySelector(".bgVideo");

  if (!audioEl || !titleEl || !btnPlay) return;

  // ===== إعدادات =====
  const EVENT_FILE = "eleven.mp3.mp3";   // غيّر الاسم إذا مختلف
  const DURATION_MS = 60 * 1000;         // دقيقة
  const TIMES = [{ h: 11, m: 11 }, { h: 23, m: 11 }];
  const FADE_MS = 900;

  const romanticLines = [
    "يمكن بهاللحظة… هو يتمناك بصمت 🤍",
    "11:11… مو صدفة، هذا خاطر حب 🤍",
    "إذا قلبچ دكّ فجأة… يمكن هو السبب 🤍",
    "بهذه الدقيقة… اسمچ مرّ بباله بدون سبب 🤍",
    "تمنّي… يمكن أمنيتچ توصل له 🤍",
    "بعيد… بس قريب جدًا بالفكرة 🤍",
    "11:11… لحظة تخص قلبين يعرفون بعض 🤍",
  ];

  // ===== منع تكرار نفس الدقيقة =====
  let lastKey = null;

  // ===== حفظ الحالة =====
  let saved = null;
  let timer = null;

  // ===== Overlay UI =====
  function ensureOverlay(){
    let overlay = document.getElementById("romOverlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "romOverlay";
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      display:none; align-items:center; justify-content:center;
      padding:22px;
      background: rgba(0,0,0,.38);
      backdrop-filter: blur(2px);
    `;

    const box = document.createElement("div");
    box.style.cssText = `
      width:min(720px, 100%);
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.08);
      backdrop-filter: blur(14px);
      box-shadow: 0 28px 90px rgba(0,0,0,.45);
      padding: 18px 16px;
      text-align:center;
      color: rgba(255,255,255,.95);
      font-family: Cairo, system-ui, Arial;
      animation: pop 800ms cubic-bezier(.2,.9,.2,1) both;
    `;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes pop{
        from{ transform: translateY(14px) scale(.985); opacity:.65; filter: blur(6px); }
        to{ transform: translateY(0) scale(1); opacity:1; filter: blur(0); }
      }
      @keyframes glow{
        0%,100%{ box-shadow: 0 28px 90px rgba(0,0,0,.45), 0 0 0 rgba(255,255,255,0); }
        50%{ box-shadow: 0 28px 90px rgba(0,0,0,.45), 0 0 70px rgba(255,255,255,.20); }
      }
      @keyframes line{
        0%{ transform: translateX(-60%) scaleX(.6); opacity:.55; }
        50%{ transform: translateX(0%) scaleX(1); opacity:1; }
        100%{ transform: translateX(60%) scaleX(.6); opacity:.55; }
      }
      #romOverlay.show{ display:flex; animation: fadeIn 350ms ease both; }
      @keyframes fadeIn{ from{opacity:0} to{opacity:1} }
    `;
    document.head.appendChild(style);

    const h = document.createElement("div");
    h.id = "romH";
    h.style.cssText = `
      font-weight: 900;
      font-size: 44px;
      letter-spacing: .5px;
      margin-bottom: 10px;
      text-shadow: 0 8px 22px rgba(0,0,0,.35);
    `;
    h.textContent = "11:11";

    const p = document.createElement("div");
    p.id = "romP";
    p.style.cssText = `
      font-weight: 900;
      font-size: 22px;
      line-height: 2.0;
      opacity: .96;
      padding: 0 4px;
    `;
    p.textContent = "…";

    const hint = document.createElement("div");
    hint.style.cssText = `
      margin-top: 10px;
      font-size: 12px;
      font-weight: 900;
      opacity: .72;
    `;
    hint.textContent = "ستعود الصفحة لوضعها الطبيعي بعد دقيقة";

    const bar = document.createElement("div");
    bar.style.cssText = `
      margin: 12px auto 0;
      height: 6px;
      width: min(360px, 100%);
      border-radius: 999px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.70), transparent);
      animation: line 2.8s ease-in-out infinite;
      opacity: .85;
    `;

    box.appendChild(h);
    box.appendChild(p);
    box.appendChild(bar);
    box.appendChild(hint);

    overlay.appendChild(box);
    overlay.addEventListener("click", () => {}); // لا تغلق بالضغط
    document.body.appendChild(overlay);

    return overlay;
  }

  function setCinematicMode(on){
    // Blur خفيف للخلفية / الفيديو
    const target = bgVideo;
    if (target) {
      target.style.transition = "filter 500ms ease, transform 500ms ease, opacity 500ms ease";
      if (on) {
        target.style.filter = "blur(3px) saturate(1.15) contrast(1.08)";
        target.style.transform = "scale(1.06)";
        target.style.opacity = "0.92";
      } else {
        target.style.filter = "";
        target.style.transform = "";
        target.style.opacity = "";
      }
    }
  }

  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

  function fadeTo(target, ms = FADE_MS){
    const start = audioEl.volume;
    const t0 = performance.now();
    target = clamp(target, 0, 1);
    return new Promise(res => {
      function step(t){
        const p = Math.min(1, (t - t0) / ms);
        audioEl.volume = start + (target - start) * p;
        p < 1 ? requestAnimationFrame(step) : res();
      }
      requestAnimationFrame(step);
    });
  }

  function iraqHHMM(){
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Baghdad",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date());
  }

  function minuteKey(){
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Baghdad",
      year:"numeric", month:"2-digit", day:"2-digit",
      hour:"2-digit", minute:"2-digit", hour12:false
    }).format(new Date());
  }

  function matchesNow(hhmm){
    const [h,m] = hhmm.split(":").map(Number);
    return TIMES.some(t => t.h === h && t.m === m);
  }

  function pickLine(){
    return romanticLines[Math.floor(Math.random() * romanticLines.length)];
  }

  async function startEvent(label){
    if (saved) return;

    saved = {
      src: audioEl.src,
      time: audioEl.currentTime || 0,
      wasPlaying: !audioEl.paused,
      volume: audioEl.volume,
      title: titleEl.textContent
    };

    const overlay = ensureOverlay();
    const h = document.getElementById("romH");
    const p = document.getElementById("romP");

    overlay.classList.add("show");
    if (h) h.textContent = label;
    if (p) p.textContent = pickLine();

    setCinematicMode(true);

    try{
      // خفّض الصوت تدريجيًا
      if (saved.wasPlaying) {
        await fadeTo(Math.min(saved.volume, 0.18), FADE_MS);
        audioEl.pause();
      }

      // شغّل صوت الحدث
      audioEl.src = EVENT_FILE;
      audioEl.loop = false;
      audioEl.load();

      // صوت رومانسي منخفض
      audioEl.volume = Math.min(saved.volume || 0.7, 0.22);

      await audioEl.play();
      btnPlay.textContent = "إيقاف";
      titleEl.textContent = `✨ ${label} — ${p ? p.textContent : "11:11"}`;

      clearTimeout(timer);
      timer = setTimeout(endEvent, DURATION_MS);
    } catch {
      endEvent();
    }
  }

  async function endEvent(){
    if (!saved) return;

    clearTimeout(timer);
    timer = null;

    const overlay = document.getElementById("romOverlay");
    if (overlay) overlay.classList.remove("show");

    setCinematicMode(false);

    try{
      audioEl.pause();

      // رجع الحالة
      audioEl.src = saved.src;
      audioEl.load();
      audioEl.currentTime = saved.time || 0;

      audioEl.volume = saved.volume ?? audioEl.volume;
      titleEl.textContent = saved.title || titleEl.textContent;

      if (saved.wasPlaying) {
        await audioEl.play();
        btnPlay.textContent = "إيقاف";
        await fadeTo(saved.volume ?? 0.7, FADE_MS);
      } else {
        btnPlay.textContent = "تشغيل";
      }
    } finally {
      saved = null;
    }
  }

  function tick(){
    const t = iraqHHMM();
    if (!matchesNow(t)) return;

    const k = minuteKey();
    if (k === lastKey) return;
    lastKey = k;

    const [hh] = t.split(":").map(Number);
    const label = hh === 11 ? "11:11 AM" : "23:11 PM";
    startEvent(label);
  }

  setInterval(tick, 1000);

  // ✅ زر اختبار/أداة من أي مكان
  window.TEST_1111 = () => startEvent("11:11 TEST");
})();
