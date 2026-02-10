// birthday-line.js — خط رفيع + (الأيام المتبقية) — 2/4 (April 2)
(() => {
  // ===== عدّل هنا فقط =====
  const BDAY_DAY = 2;
  const BDAY_MONTH = 4; // 4 = April

  // ===== Helpers =====
  const pad2 = (n) => String(n).padStart(2, "0");

  function getBaghdadNow() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Baghdad",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).formatToParts(new Date());

    const get = (t) => parts.find(p => p.type === t)?.value;
    const y = Number(get("year"));
    const m = Number(get("month"));
    const d = Number(get("day"));
    const hh = Number(get("hour"));
    const mm = Number(get("minute"));
    const ss = Number(get("second"));
    return new Date(y, m - 1, d, hh, mm, ss);
  }

  function nextBirthday(fromDate) {
    const y = fromDate.getFullYear();
    const thisYear = new Date(y, BDAY_MONTH - 1, BDAY_DAY, 0, 0, 0);
    if (fromDate < thisYear) return thisYear;
    return new Date(y + 1, BDAY_MONTH - 1, BDAY_DAY, 0, 0, 0);
  }

  function lastBirthday(fromDate) {
    const y = fromDate.getFullYear();
    const thisYear = new Date(y, BDAY_MONTH - 1, BDAY_DAY, 0, 0, 0);
    if (fromDate >= thisYear) return thisYear;
    return new Date(y - 1, BDAY_MONTH - 1, BDAY_DAY, 0, 0, 0);
  }

  function daysLeft(ms) {
    // نخليها "أيام كاملة متبقية" (ceiling)
    return Math.max(0, Math.ceil(ms / 86400000));
  }

  // ===== UI =====
  const style = document.createElement("style");
  style.textContent = `
    #bdayLineWrap{
      position: fixed;
      top: 118px; /* تحت HUD */
      left: 50%;
      transform: translateX(-50%);
      width: min(980px, calc(100% - 20px));
      z-index: 75;
      pointer-events: none;
    }
    @media (max-width: 560px){
      #bdayLineWrap{ top: 128px; }
    }

    #bdayLineCard{
      pointer-events: none;
      padding: 8px 10px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.06);
      backdrop-filter: blur(10px);
    }
    body.light #bdayLineCard{
      border-color: rgba(0,0,0,.10);
      background: rgba(255,255,255,.60);
    }

    #bdayLineTrack{
      height: 4px;                  /* خط رفيع */
      border-radius: 999px;
      background: rgba(255,255,255,.12);
      overflow:hidden;
    }
    body.light #bdayLineTrack{ background: rgba(0,0,0,.06); }

    #bdayLineFill{
      height: 100%;
      width: 0%;
      border-radius: 999px;
      background: rgba(255,255,255,.78);
      transition: width .35s ease;
    }
    body.light #bdayLineFill{ background: rgba(10,16,28,.70); }

    #bdayDaysTxt{
      margin-top: 6px;
      font-family: Cairo, system-ui, Arial;
      font-weight: 900;
      font-size: 12px;              /* صغير */
      color: rgba(255,255,255,.80);
      text-align: right;
      line-height: 1.2;
    }
    body.light #bdayDaysTxt{ color: rgba(10,16,28,.75); }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.id = "bdayLineWrap";
  wrap.innerHTML = `
    <div id="bdayLineCard">
      <div id="bdayLineTrack"><div id="bdayLineFill"></div></div>
      <div id="bdayDaysTxt">...</div>
    </div>
  `;
  document.body.appendChild(wrap);

  const fillEl = document.getElementById("bdayLineFill");
  const txtEl  = document.getElementById("bdayDaysTxt");

  function update() {
    const now = getBaghdadNow();
    const next = nextBirthday(now);
    const last = lastBirthday(now);

    const msLeft = next - now;
    const dLeft = daysLeft(msLeft);

    const span = next - last;
    const done = now - last;
    const pct = span > 0 ? Math.max(0, Math.min(1, done / span)) : 0;

    fillEl.style.width = `${Math.round(pct * 1000) / 10}%`; // 1 decimal

    const dateTxt = `${pad2(BDAY_DAY)}/${pad2(BDAY_MONTH)}/${next.getFullYear()}`;
    txtEl.textContent = `متبقي ${dLeft} يوم على ${dateTxt}`;
  }

  update();
  setInterval(update, 1000 * 30); // كل 30 ثانية (خفيف)
})();