// event1111.js — 11:11 Luxury (Black Cinematic + Heartbeat Rays from Text)
(() => {
  const AUDIO_FILE = "eleven.mp3.mp3";
  const INTRO_MS   = 9000;
  const MAX_VOL    = 0.40;

  const TIMES = [{ h: 11, m: 11 }, { h: 23, m: 11 }];
  let lastKey = null;
  let running = false;

  const lines = [
    "مو صدفة…",
    "يمكن هسه يفكّر بيج",
    "لحظة تخص قلبين",
    "اسمج مرّ بباله"
  ];
  const pickLine = () => lines[Math.floor(Math.random()*lines.length)];
  const $ = (id) => document.getElementById(id);

  function iraqHHMM(){
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Baghdad", hour: "2-digit", minute: "2-digit", hour12:false
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
  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

  function fadeVolume(audio, to, ms){
    const from = audio.volume;
    const t0 = performance.now();
    to = clamp(to, 0, 1);
    return new Promise(res => {
      function step(t){
        const p = Math.min(1, (t - t0) / ms);
        audio.volume = from + (to - from) * p;
        p < 1 ? requestAnimationFrame(step) : res();
      }
      requestAnimationFrame(step);
    });
  }

  function ensureUI(){
    let ov = $("hb1111");
    if (ov) return ov;

    const style = document.createElement("style");
    style.textContent = `
      #hb1111{
        position:fixed; inset:0; z-index:999999;
        display:none; align-items:center; justify-content:center;
        padding: 22px;
        background: rgba(0,0,0,.62);     /* ✅ الشاشة السوداء */
        backdrop-filter: blur(8px);      /* ✅ فخامة */
      }
      #hb1111.show{ display:flex; }

      #hbCore{
        position:relative;
        width:min(760px, 92vw);
        text-align:center;
        font-family: Cairo, system-ui, Arial;
      }

      /* النص ينبض */
      #hbTitle{
        font-weight: 900;
        font-size: 66px;
        letter-spacing: .6px;
        color: rgba(255,255,255,.96);
        text-shadow: 0 14px 44px rgba(0,0,0,.55);
        animation: textBeat 1.25s ease-in-out infinite;
        position:relative;
        z-index:3;
      }
      #hbLine{
        margin-top: 10px;
        font-weight: 900;
        font-size: 20px;
        color: rgba(255,255,255,.92);
        text-shadow: 0 12px 40px rgba(0,0,0,.55);
        opacity: .92;
        animation: textBeat2 1.25s ease-in-out infinite;
        position:relative;
        z-index:3;
      }

      /* شعاع مشع من النص */
      #hbRays{
        position:absolute;
        left:50%; top:50%;
        transform: translate(-50%, -55%);
        width: 780px; height: 520px;
        opacity: .9;
        background:
          radial-gradient(circle at center, rgba(255,255,255,.25), transparent 58%),
          conic-gradient(from 0deg,
            rgba(255,255,255,.00),
            rgba(255,255,255,.16),
            rgba(255,255,255,.00),
            rgba(255,255,255,.14),
            rgba(255,255,255,.00)
          );
        filter: blur(16px);
        mask-image: radial-gradient(circle at center, rgba(0,0,0,1), transparent 66%);
        -webkit-mask-image: radial-gradient(circle at center, rgba(0,0,0,1), transparent 66%);
        animation: rayBeat 1.25s ease-in-out infinite;
        z-index:1;
      }

      /* قلب مضيء (شكل قلب) */
      .hbHeart{
        position:absolute;
        left:50%; top:50%;
        width: 190px; height: 190px;
        transform: translate(-50%, -58%) rotate(45deg);
        background: rgba(255,255,255,.18);
        border-radius: 24px;
        filter: blur(22px);
        opacity:0;
        animation: heartBeat 1.25s ease-in-out infinite;
        z-index:2;
      }
      .hbHeart:before, .hbHeart:after{
        content:"";
        position:absolute;
        width: 190px; height: 190px;
        background: rgba(255,255,255,.18);
        border-radius: 50%;
      }
      .hbHeart:before{ left:-95px; top:0; }
      .hbHeart:after { left:0; top:-95px; }

      /* نبضة قلب (دقتين) */
      @keyframes heartBeat{
        0%   { opacity:0; transform: translate(-50%, -58%) rotate(45deg) scale(.70); }
        14%  { opacity:.85; transform: translate(-50%, -58%) rotate(45deg) scale(1.05); }
        24%  { opacity:.25; transform: translate(-50%, -58%) rotate(45deg) scale(.90); }
        40%  { opacity:.95; transform: translate(-50%, -58%) rotate(45deg) scale(1.12); }
        56%  { opacity:.30; transform: translate(-50%, -58%) rotate(45deg) scale(.92); }
        100% { opacity:0; transform: translate(-50%, -58%) rotate(45deg) scale(.70); }
      }
      @keyframes rayBeat{
        0%   { transform: translate(-50%, -55%) scale(.92); opacity:.22; }
        14%  { transform: translate(-50%, -55%) scale(1.06); opacity:.70; }
        24%  { transform: translate(-50%, -55%) scale(.98); opacity:.28; }
        40%  { transform: translate(-50%, -55%) scale(1.08); opacity:.78; }
        56%  { transform: translate(-50%, -55%) scale(1.00); opacity:.34; }
        100% { transform: translate(-50%, -55%) scale(.92); opacity:.22; }
      }
      @keyframes textBeat{
        0%   { transform: scale(1); }
        14%  { transform: scale(1.05); }
        24%  { transform: scale(.99); }
        40%  { transform: scale(1.06); }
        56%  { transform: scale(1.00); }
        100% { transform: scale(1); }
      }
      @keyframes textBeat2{
        0%   { transform: translateY(0px); opacity:.85; }
        14%  { transform: translateY(-1px); opacity:1; }
        24%  { transform: translateY(0px); opacity:.88; }
        40%  { transform: translateY(-1px); opacity:1; }
        56%  { transform: translateY(0px); opacity:.90; }
        100% { transform: translateY(0px); opacity:.85; }
      }
      @media (max-width: 520px){
        #hbTitle{ font-size: 52px; }
        #hbRays{ width: 560px; height: 380px; }
      }
    `;
    document.head.appendChild(style);

    ov = document.createElement("div");
    ov.id = "hb1111";
    ov.innerHTML = `
      <div id="hbCore">
        <div id="hbRays"></div>
        <div class="hbHeart"></div>
        <div id="hbTitle">11:11</div>
        <div id="hbLine">...</div>
      </div>
    `;
    document.body.appendChild(ov);
    return ov;
  }

  async function runIntro(label="11:11"){
    if (running) return;
    running = true;

    const audioMain = $("bgAudio");
    if (!audioMain) { running = false; return; }

    const ui = ensureUI();
    const title = $("hbTitle");
    const line  = $("hbLine");
    if (title) title.textContent = label;
    if (line)  line.textContent  = pickLine();

    // خزّن حالة الصوت
    const saved = {
      src: audioMain.src,
      time: audioMain.currentTime || 0,
      paused: audioMain.paused,
      volume: audioMain.volume,
      loop: audioMain.loop
    };

    ui.classList.add("show");

    try{
      if (!saved.paused) await fadeVolume(audioMain, Math.min(saved.volume, 0.12), 600);

      audioMain.pause();
      audioMain.src = AUDIO_FILE;
      audioMain.loop = false;
      audioMain.load();
      audioMain.volume = 0;

      await audioMain.play();
      await fadeVolume(audioMain, MAX_VOL, 900);

      setTimeout(async () => {
        try{
          await fadeVolume(audioMain, 0, 650);
          audioMain.pause();

          audioMain.src = saved.src;
          audioMain.loop = saved.loop;
          audioMain.load();
          audioMain.currentTime = saved.time || 0;
          audioMain.volume = saved.volume;

          if (!saved.paused) await audioMain.play();
        } finally {
          ui.classList.remove("show");
          running = false;
        }
      }, INTRO_MS);

    } catch {
      ui.classList.remove("show");
      running = false;
    }
  }

  // زر الاختبار
  window.TEST_1111 = () => runIntro("11:11 TEST");

  // تشغيل تلقائي
  function tick(){
    const t = iraqHHMM();
    if (!matchesNow(t)) return;

    const k = minuteKey();
    if (k === lastKey) return;
    lastKey = k;

    const [hh] = t.split(":").map(Number);
    runIntro(hh === 11 ? "11:11 AM" : "23:11 PM");
  }
  setInterval(tick, 1000);
})();
