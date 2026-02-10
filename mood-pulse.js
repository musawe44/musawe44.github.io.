// mood-pulse.js — نبض المزاج (تجريبي) — ملف واحد
(() => {
  // ===== إعدادات بسيطة =====
  const TZ = "Asia/Baghdad";
  const SHOW_LABEL = true;       // إذا تريد كلمة صغيرة تحت النبض
  const POSITION = "right";      // "right" أو "left"
  const OFFSET_BOTTOM = 74;      // حتى ما يتعارض مع زر الثيم

  // ===== Helpers: وقت بغداد =====
  function baghdadParts() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(new Date());
    const get = (t) => parts.find(p => p.type === t)?.value;
    return { h: Number(get("hour")), m: Number(get("minute")) };
  }

  // نحدد “مزاج” بحسب الساعة (تجريبي)
  function moodFromHour(h) {
    // 0-5: ليل عميق / 6-11: صباح / 12-17: نهار / 18-23: مساء
    if (h <= 5)  return { name: "ليل",  bpm: 44, glow: 0.22 };
    if (h <= 11) return { name: "صباح", bpm: 58, glow: 0.18 };
    if (h <= 17) return { name: "نهار", bpm: 66, glow: 0.16 };
    return          { name: "مساء", bpm: 52, glow: 0.20 };
  }

  // ===== UI =====
  const style = document.createElement("style");
  style.textContent = `
    #moodPulseWrap{
      position: fixed;
      ${POSITION}: 12px;
      bottom: ${OFFSET_BOTTOM}px;
      z-index: 9999;
      pointer-events: none;
      user-select: none;
      font-family: Cairo, system-ui, Arial;
    }

    #moodPulseChip{
      pointer-events: none;
      display:flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 10px 12px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(0,0,0,.18);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 28px rgba(0,0,0,.18);
      min-width: 70px;
    }
    body.light #moodPulseChip{
      border-color: rgba(0,0,0,.10);
      background: rgba(255,255,255,.65);
      box-shadow: 0 10px 28px rgba(0,0,0,.10);
    }

    /* النبض */
    #moodDot{
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: rgba(255,255,255,.92);
      box-shadow: 0 0 0 rgba(255,255,255,.0);
      transform: scale(.92);
    }
    body.light #moodDot{
      background: rgba(10,16,28,.85);
    }

    
    /* نستخدم CSS Variables للتحكم */
    #moodPulseWrap{
      --beat: 1.2s;      /* مدة النبضة */
      --glow: 1.18;      /* قوة التوهج */
    }

    .beatAnim{
      animation: beat var(--beat) ease-in-out infinite;
    }

    @keyframes beat{
      0%,100%{
        transform: scale(.92);
        filter: brightness(1);
        box-shadow: 0 0 0 0 rgba(255,255,255,0);
      }
      50%{
        transform: scale(1.14);
        filter: brightness(1.08);
        box-shadow: 0 0 24px 4px rgba(255,255,255,var(--glow));
      }
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.id = "moodPulseWrap";
  wrap.innerHTML = `
    <div id="moodPulseChip">
      <div id="moodDot" class="beatAnim"></div>
      ${SHOW_LABEL ? `<div id="moodLabel">...</div>` : ``}
    </div>
  `;
  document.body.appendChild(wrap);

  const dot = document.getElementById("moodDot");
  const label = document.getElementById("moodLabel");

  // ===== Update =====
  function setMood() {
    const { h } = baghdadParts();
    const mood = moodFromHour(h);

    // bpm -> seconds per beat
    const beatSeconds = 60 / mood.bpm;

    wrap.style.setProperty("--beat", `${beatSeconds.toFixed(2)}s`);
    wrap.style.setProperty("--glow", `${mood.glow}`);

    if (label) label.textContent = `مزاج: ${mood.name}`;
  }

  setMood();
  // كل دقيقة يكفي (خفيف)
  setInterval(setMood, 60 * 1000);
})();
