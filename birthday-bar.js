// birthday-bar.js — شريط يوضح كم باقي على عيد الميلاد + نسبة التقدم
(() => {
  // ===== عدّل هنا فقط =====
  const BDAY_DAY = 4;
  const BDAY_MONTH = 2; // 2 = فبراير (إذا تريد 2 أبريل خليها 4)

  // ===== Helpers =====
  const pad2 = (n) => String(n).padStart(2, "0");

  function getBaghdadNow() {
    // نستخدم وقت بغداد دائماً
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

    // نخليها كوقت "محلي" ثابت بدون اعتماد على TZ بالجهاز
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

  function diffParts(ms) {
    ms = Math.max(0, ms);
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const rem1 = totalSec % 86400;
    const hours = Math.floor(rem1 / 3600);
    const rem2 = rem1 % 3600;
    const minutes = Math.floor(rem2 / 60);
    const seconds = rem2 % 60;
    return { days, hours, minutes, seconds };
  }

  // ===== Inject UI =====
  const style = document.createElement("style");
  style.textContent = `
    #bdayBarWrap{
      position: fixed;
      top: 122px; /* تحت الـ HUD */
      left: 50%;
      transform: translateX(-50%);
      width: min(980px, calc(100% - 20px));
      z-index: 75;
      pointer-events: none;
    }
    @media (max-width: 560px){
      #bdayBarWrap{ top: 132px; }
    }

    #bdayCard{
      pointer-events: auto;
      padding: 10px 12px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(255,255,255,.08);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 24px rgba(0,0,0,.12);
      font-family: Cairo, system-ui, Arial;
    }
    body.light #bdayCard{
      border-color: rgba(0,0,0,.10);
      background: rgba(255,255,255,.65);
      box-shadow: 0 10px 24px rgba(0,0,0,.08);
    }

    #bdayTop{
      display:flex;
      justify-content:space-between;
      gap:10px;
      align-items:center;
      margin-bottom: 8px;
    }
    #bdayTitle{
      font-weight: 900;
      font-size: 13px;
      color: rgba(255,255,255,.92);
      margin:0;
      white-space:nowrap;
    }
    body.light #bdayTitle{ color: rgba(10,16,28,.86); }

    #bdayLeft{
      font-weight: 900;
      font-size: 13px;
      color: rgba(255,255,255,.85);
      margin:0;
      text-align:left;
      direction:ltr;
      white-space:nowrap;
    }
    body.light #bdayLeft{ color: rgba(10,16,28,.78); }

    #bdayTrack{
      height: 10px;
      border-radius: 999px;
      background: rgba(255,255,255,.12);
      overflow:hidden;
      border: 1px solid rgba(255,255,255,.12);
    }
    body.light #bdayTrack{
      background: rgba(0,0,0,.06);
      border-color: rgba(0,0,0,.08);
    }

    #bdayFill{
      height: 100%;
      width: 0%;
      border-radius: 999px;
      background: rgba(255,255,255,.72);
      transform-origin: right center;
      transition: width .4s ease;
    }
    body.light #bdayFill{
      background: rgba(10,16,28,.72);
    }

    #bdaySub{
      margin-top: 6px;
      font-weight: 900;
      font-size: 12px;
      color: rgba(255,255,255,.72);
    }
    body.light #bdaySub{ color: rgba(10,16,28,.68); }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.id = "bdayBarWrap";

  wrap.innerHTML = `
    <div id="bdayCard">
      <div id="bdayTop">
        <p id="bdayTitle">🎂 عيد ميلادي</p>
        <p id="bdayLeft">...</p>
      </div>
      <div id="bdayTrack"><div id="bdayFill"></div></div>
      <div id="bdaySub">...</div>
    </div>
  `;

  document.body.appendChild(wrap);

  const leftEl = document.getElementById("bdayLeft");
  const fillEl = document.getElementById("bdayFill");
  const subEl  = document.getElementById("bdaySub");

  // ===== Update loop =====
  function update() {
    const now = getBaghdadNow();
    const next = nextBirthday(now);
    const last = lastBirthday(now);

    const msLeft = next - now;
    const { days, hours, minutes, seconds } = diffParts(msLeft);

    // progress from last birthday to next birthday
    const span = next - last;           // total ms in this "birthday year"
    const done = now - last;
    const pct = span > 0 ? Math.max(0, Math.min(1, done / span)) : 0;

    fillEl.style.width = `${Math.round(pct * 1000) / 10}%`; // 1 decimal

    leftEl.textContent = `${days}d ${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;

    // نص تحت الشريط
    const nextDate = `${pad2(BDAY_DAY)}/${pad2(BDAY_MONTH)}/${next.getFullYear()}`;
    subEl.textContent = `المتبقي على ${nextDate} — التقدم: ${Math.round(pct * 100)}%`;
  }

  update();
  setInterval(update, 1000);
})();
