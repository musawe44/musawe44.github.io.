// event1111.js — 11:11 / 23:11 (ملف منفصل تماماً)
(() => {
  const audioEl = document.getElementById("bgAudio");
  const titleEl = document.getElementById("trackTitle");
  const btnPlay = document.getElementById("audioBtn");

  if (!audioEl || !titleEl || !btnPlay) return;

  const EVENT_FILE = "eleven.mp3.mp3"; // عدّل الاسم إذا مختلف
  const EVENT_DURATION = 60 * 1000; // دقيقة
  const TIMES = [
    { h: 11, m: 11 },
    { h: 23, m: 11 }
  ];

  const romanticLines = [
    "11:11… يمكن هو جاي يفكّر بيج 🤍",
    "بهذه الدقيقة… اسمچ مرّ بباله 🤍",
    "11:11… مو صدفة أبداً 🤍",
    "يمكن قلبه هسه ناداج 🤍",
    "بهذه اللحظة… تفكير صامت 🤍"
  ];

  let lastKey = null;
  let saved = null;

  function iraqTime() {
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

  function matchesTime(h, m) {
    return TIMES.some(t => t.h === h && t.m === m);
  }

  function pickLine() {
    return romanticLines[Math.floor(Math.random() * romanticLines.length)];
  }

  async function startEvent(label) {
    if (saved) return;

    saved = {
      src: audioEl.src,
      time: audioEl.currentTime || 0,
      wasPlaying: !audioEl.paused,
      title: titleEl.textContent,
      volume: audioEl.volume
    };

    try {
      if (saved.wasPlaying) audioEl.pause();

      audioEl.src = EVENT_FILE;
      audioEl.loop = false;
      audioEl.volume = Math.min(saved.volume, 0.25);
      titleEl.textContent = `✨ ${label} — ${pickLine()}`;

      await audioEl.play();
      btnPlay.textContent = "إيقاف";

      setTimeout(endEvent, EVENT_DURATION);
    } catch {
      endEvent();
    }
  }

  async function endEvent() {
    if (!saved) return;

    try {
      audioEl.pause();
      audioEl.src = saved.src;
      audioEl.currentTime = saved.time || 0;
      audioEl.volume = saved.volume;
      titleEl.textContent = saved.title;

      if (saved.wasPlaying) {
        await audioEl.play();
        btnPlay.textContent = "إيقاف";
      } else {
        btnPlay.textContent = "تشغيل";
      }
    } finally {
      saved = null;
    }
  }

  function tick() {
    const t = iraqTime();
    const [hh, mm] = t.split(":").map(Number);

    if (!matchesTime(hh, mm)) return;

    const key = minuteKey();
    if (key === lastKey) return;
    lastKey = key;

    const label = hh === 11 ? "11:11 AM" : "23:11 PM";
    startEvent(label);
  }

  setInterval(tick, 1000);

  // 🔧 اختبار يدوي (اختياري)
  window.TEST_1111 = () => startEvent("11:11 TEST");
})();
