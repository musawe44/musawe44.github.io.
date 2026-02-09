// event1111.js — 11:11 Event (صوت منفصل) — يعمل مع audio.js
(() => {
  const CFG = window.APP_CONFIG;
  const state = window.APP_AUDIO_STATE;
  if (!CFG || !CFG.event1111 || !CFG.event1111.enabled) return;

  const audioEl = document.getElementById("bgAudio");
  const volEl   = document.getElementById("volume");
  const titleEl = document.getElementById("trackTitle");
  const btn     = document.getElementById("audioBtn");
  if (!audioEl || !volEl || !titleEl || !btn) return;

  const durationMs = Math.max(5000, (CFG.event1111.durationSeconds || 60) * 1000);
  const eventFile  = CFG.event1111.eventAudioFile;
  const lines      = Array.isArray(CFG.event1111.romanticLines) ? CFG.event1111.romanticLines : [];

  let lastKey = null;
  let saved = null;
  let eventTimer = null;

  const clamp = (n,a,b) => Math.max(a, Math.min(b,n));

  function iraqHHMM() {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Baghdad",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date());
  }

  function matchesTime(hhmm) {
    const [hStr, mStr] = hhmm.split(":");
    const h = Number(hStr), m = Number(mStr);
    return (CFG.event1111.times || []).some(t => t && t.h === h && t.m === m);
  }

  function pickLine() {
    return lines.length ? lines[Math.floor(Math.random() * lines.length)] : "✨ 11:11";
  }

  function fadeTo(target, ms = 700) {
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

  async function startEvent() {
    if (state?.inEvent) return;
    if (!eventFile) return;

    if (!window.APP_AUDIO_STATE) window.APP_AUDIO_STATE = { playing:false, inEvent:false };
    window.APP_AUDIO_STATE.inEvent = true;

    saved = {
      src: audioEl.src,
      time: audioEl.currentTime || 0,
      wasPlaying: !!window.APP_AUDIO_STATE.playing,
      vol: audioEl.volume,
      title: titleEl.textContent,
    };

    try {
      // إذا كان الألبوم شغال: هدوء ثم إيقاف
      if (saved.wasPlaying) {
        await fadeTo(Math.min(saved.vol, 0.18), 650);
        audioEl.pause();
        window.APP_AUDIO_STATE.playing = false;
        btn.textContent = "تشغيل";
      }

      audioEl.src = eventFile;
      audioEl.loop = false;
      audioEl.load();

      titleEl.textContent = `✨ 11:11 — ${pickLine()}`;

      // ✅ شغّل الحدث دائمًا
      try {
        if (state?.audioCtx && state.audioCtx.state === "suspended") await state.audioCtx.resume();
        await audioEl.play();
        window.APP_AUDIO_STATE.playing = true;
        btn.textContent = "إيقاف";
      } catch {}

      clearTimeout(eventTimer);
      eventTimer = setTimeout(endEvent, durationMs);
    } catch {
      endEvent();
    }
  }

  async function endEvent() {
    if (!window.APP_AUDIO_STATE?.inEvent) return;

    clearTimeout(eventTimer);
    eventTimer = null;

    try {
      if (window.APP_AUDIO_STATE.playing) {
        audioEl.pause();
        window.APP_AUDIO_STATE.playing = false;
        btn.textContent = "تشغيل";
      }

      window.APP_AUDIO_STATE.inEvent = false;

      if (saved && saved.src) {
        audioEl.src = saved.src;
        audioEl.load();
        audioEl.currentTime = saved.time || 0;

        audioEl.volume = saved.vol ?? audioEl.volume;
        volEl.value = String(Math.round((audioEl.volume || 0) * 100));
        if (saved.title) titleEl.textContent = saved.title;

        // رجّع الألبوم فقط إذا كان شغال قبل الحدث
        if (saved.wasPlaying) {
          if (state?.audioCtx && state.audioCtx.state === "suspended") await state.audioCtx.resume();
          await audioEl.play();
          window.APP_AUDIO_STATE.playing = true;
          btn.textContent = "إيقاف";
          await fadeTo(saved.vol ?? 0.7, 900);
        }
      }
    } finally {
      saved = null;
    }
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

  function tick() {
    const hhmm = iraqHHMM();
    if (!matchesTime(hhmm)) return;

    const k = minuteKey();
    if (lastKey === k) return;
    lastKey = k;

    startEvent();
  }

  setInterval(tick, 1000);
})();
