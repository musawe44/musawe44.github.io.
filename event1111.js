// event1111.js — Romantic 11:11 (فخم لكن خفيف) — يعمل مع زر TEST_1111
(() => {
  const EVENT_FILE = "eleven.mp3.mp3";  // اسم صوت الحدث
  const DURATION_MS = 60 * 1000;        // ⏱️ خليها 15000 يعني 15 ثانية إذا تريد
  const FADE_MS = 900;

  const romanticLines = [
    "11:11… يمكن هو جاي يفكّر بيج 🤍",
    "بهذه الدقيقة… اسمچ مرّ بباله 🤍",
    "مو صدفة… هذا خاطر حب 🤍",
    "إذا تحسين بدفء… يمكن هو السبب 🤍",
    "11:11… لحظة تخص قلبين 🤍"
  ];

  let running = false;
  let saved = null;
  let timer = null;

  function $(id){ return document.getElementById(id); }
  function pickLine(){ return romanticLines[Math.floor(Math.random() * romanticLines.length)]; }
  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

  function fadeTo(audioEl, target, ms = FADE_MS){
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

  function ensureOverlay(){
    let ov = $("romOverlay");
    if (ov) return ov;

    ov = document.createElement("div");
    ov.id = "romOverlay";
    ov.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      display:none; align-items:center; justify-content:center;
      padding:22px;
      background: rgba(0,0,0,.40);
      backdrop-filter: blur(2px);
    `;

    const box = document.createElement("div");
    box.style.cssText = `
      width:min(720px, 100%);
      border-radius: 22px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.09);
      backdrop-filter: blur(14px);
      box-shadow: 0 28px 90px rgba(0,0,0,.45);
      padding: 18px 16px;
      text-align:center;
      color: rgba(255,255,255,.95);
      font-family: Cairo, system-ui, Arial;
      transform: translateY(14px) scale(.985);
      opacity: .0;
      transition: transform 650ms ease, opacity 650ms ease;
    `;

    const h = document.createElement("div");
    h.id = "romH";
    h.textContent = "11:11";
    h.style.cssText = `
      font-weight: 900;
      font-size: 44px;
      letter-spacing: .5px;
      margin-bottom: 10px;
      text-shadow: 0 8px 22px rgba(0,0,0,.35);
    `;

    const p = document.createElement("div");
    p.id = "romP";
    p.textContent = "…";
    p.style.cssText = `
      font-weight: 900;
      font-size: 22px;
      line-height: 2.0;
      opacity: .96;
    `;

    const bar = document.createElement("div");
    bar.style.cssText = `
      margin: 14px auto 0;
      height: 6px;
      width: min(360px, 100%);
      border-radius: 999px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.70), transparent);
      opacity: .85;
      animation: line 2.8s ease-in-out infinite;
    `;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes line{
        0%{ transform: translateX(-60%) scaleX(.6); opacity:.55; }
        50%{ transform: translateX(0%) scaleX(1); opacity:1; }
        100%{ transform: translateX(60%) scaleX(.6); opacity:.55; }
      }
      #romOverlay.show{ display:flex; }
    `;
    document.head.appendChild(style);

    box.appendChild(h);
    box.appendChild(p);
    box.appendChild(bar);
    ov.appendChild(box);
    document.body.appendChild(ov);
    return ov;
  }

  function setZoom(on){
    const bg = $("bgVideo") || document.querySelector(".bgVideo");
    if (!bg) return;
    bg.style.transition = "transform 800ms ease, filter 800ms ease, opacity 800ms ease";
    if (on){
      bg.style.transform = "scale(1.08)";
      bg.style.filter = "blur(3px) saturate(1.18) contrast(1.08)";
      bg.style.opacity = "0.92";
    } else {
      bg.style.transform = "";
      bg.style.filter = "";
      bg.style.opacity = "";
    }
  }

  async function startEvent(label){
    if (running) return;

    const audioEl = $("bgAudio");
    const titleEl = $("trackTitle");
    const btnPlay = $("audioBtn");
    if (!audioEl || !titleEl || !btnPlay) return;

    running = true;

    saved = {
      src: audioEl.src,
      time: audioEl.currentTime || 0,
      wasPlaying: !audioEl.paused,
      volume: audioEl.volume,
      title: titleEl.textContent,
      btnText: btnPlay.textContent
    };

    const ov = ensureOverlay();
    const box = ov.firstElementChild;
    const h = $("romH");
    const p = $("romP");

    ov.classList.add("show");
    if (h) h.textContent = label;
    if (p) p.textContent = pickLine();

    // دخول ناعم
    requestAnimationFrame(() => {
      if (box){
        box.style.opacity = "1";
        box.style.transform = "translateY(0) scale(1)";
      }
    });

    setZoom(true);

    try{
      // إذا كان شغّال، نخفّضه
      if (saved.wasPlaying){
        await fadeTo(audioEl, Math.min(saved.volume, 0.18), FADE_MS);
        audioEl.pause();
      }

      // شغّل صوت الحدث
      audioEl.src = EVENT_FILE;
      audioEl.loop = false;
      audioEl.load();
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
    if (!running) return;

    const audioEl = $("bgAudio");
    const titleEl = $("trackTitle");
    const btnPlay = $("audioBtn");

    clearTimeout(timer);
    timer = null;

    // خروج ناعم
    const ov = $("romOverlay");
    const box = ov?.firstElementChild;
    if (box){
      box.style.opacity = "0";
      box.style.transform = "translateY(14px) scale(.985)";
    }

    setZoom(false);

    try{
      if (audioEl) audioEl.pause();

      if (audioEl && saved){
        audioEl.src = saved.src;
        audioEl.load();
        audioEl.currentTime = saved.time || 0;
        audioEl.volume = saved.volume ?? audioEl.volume;
      }

      if (titleEl && saved?.title) titleEl.textContent = saved.title;

      if (audioEl && saved?.wasPlaying){
        await audioEl.play();
        if (btnPlay) btnPlay.textContent = "إيقاف";
        await fadeTo(audioEl, saved.volume ?? 0.7, FADE_MS);
      } else {
        if (btnPlay) btnPlay.textContent = saved?.btnText || "تشغيل";
      }
    } finally {
      // اخفاء overlay بعد الانتقال
      setTimeout(() => {
        if (ov) ov.classList.remove("show");
      }, 650);

      saved = null;
      running = false;
    }
  }

  // ✅ زر الاختبار (يخدم زر tools.js)
  window.TEST_1111 = () => startEvent("11:11 TEST");

  // (اختياري) تشغيل تلقائي عند الوقت الحقيقي — إذا تريد فعّله قلّي
  // setInterval(() => { ... }, 1000);
})();
