// event1111.js — 11:11 Luxury Intro (Glow Heartbeat) — لا يلمس باقي الموقع
(() => {
  const AUDIO_FILE = "eleven.mp3.mp3"; // ✅ غيّر الاسم إذا مختلف
  const INTRO_MS   = 9000;             // مدة المقدمة (9 ثواني)
  const MAX_VOL    = 0.40;             // أعلى صوت

  const TIMES = [{ h: 11, m: 11 }, { h: 23, m: 11 }];
  let lastKey = null;
  let running = false;

  const lines = [
    "11:11",
    "مو صدفة…",
    "يمكن هسه يتذكّرج",
    "لحظة تخص قلبين"
  ];

  function $(id){ return document.getElementById(id); }
  function pickLine(){ return lines[Math.floor(Math.random()*lines.length)]; }

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

  function ensureIntroUI(){
    let ov = $("intro1111");
    if (ov) return ov;

    const style = document.createElement("style");
    style.textContent = `
      #intro1111{
        position:fixed; inset:0; z-index:999999;
        display:none; align-items:center; justify-content:center;
        background: rgba(0,0,0,.55);
        backdrop-filter: blur(10px);
      }
      #intro1111.show{ display:flex; }

      #introBox{
        position:relative;
        width:min(760px, 92vw);
        padding: 28px 22px;
        border-radius: 26px;
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.16);
        box-shadow: 0 30px 120px rgba(0,0,0,.60);
        backdrop-filter: blur(18px);
        overflow:hidden;
        transform: translateY(14px) scale(.985);
        opacity:0;
        transition: transform 900ms cubic-bezier(.2,.9,.2,1), opacity 900ms ease;
      }
      #intro1111.show #introBox{
        transform: translateY(0) scale(1);
        opacity:1;
      }

      /* النص بالوسط */
      #introText{
        position:relative;
        text-align:center;
        font-family: Cairo, system-ui, Arial;
        font-weight: 900;
        letter-spacing: .5px;
        color: rgba(255,255,255,.95);
        text-shadow: 0 10px 30px rgba(0,0,0,.35);
        line-height: 1.2;
        padding: 18px 10px;
        z-index: 3;
      }
      #introText .t1{
        font-size: 58px;
        margin-bottom: 10px;
      }
      #introText .t2{
        font-size: 22px;
        opacity: .92;
      }

      /* نبضات ضوء "شكل قلب" مشع من النص */
      .heartGlow{
        position:absolute;
        left:50%;
        top:50%;
        width: 180px;
        height: 180px;
        transform: translate(-50%, -55%) rotate(45deg) scale(0.7);
        background: rgba(255,255,255,.12);
        filter: blur(0px);
        border-radius: 22px;
        z-index: 2;
        opacity: 0;
        box-shadow:
          0 0 0 rgba(255,255,255,0),
          0 0 0 rgba(255,255,255,0);
        animation: heartBeatGlow 1.25s ease-in-out infinite;
      }
      .heartGlow:before,
      .heartGlow:after{
        content:"";
        position:absolute;
        width: 180px;
        height: 180px;
        background: rgba(255,255,255,.12);
        border-radius: 50%;
      }
      .heartGlow:before{ left:-90px; top:0; }
      .heartGlow:after{ left:0; top:-90px; }

      @keyframes heartBeatGlow{
        0%   { opacity:0; transform: translate(-50%, -55%) rotate(45deg) scale(.65); filter: blur(10px); }
        18%  { opacity:.55; transform: translate(-50%, -55%) rotate(45deg) scale(.92); filter: blur(18px); }
        30%  { opacity:.25; transform: translate(-50%, -55%) rotate(45deg) scale(.80); filter: blur(14px); }
        48%  { opacity:.70; transform: translate(-50%, -55%) rotate(45deg) scale(1.02); filter: blur(22px); }
        62%  { opacity:.30; transform: translate(-50%, -55%) rotate(45deg) scale(.86); filter: blur(16px); }
        100% { opacity:0; transform: translate(-50%, -55%) rotate(45deg) scale(.65); filter: blur(10px); }
      }

      /* توهج ناعم عام من النص */
      .softBloom{
        position:absolute;
        left:50%;
        top:50%;
        width: 520px;
        height: 320px;
        transform: translate(-50%, -55%);
        background: radial-gradient(circle at center,
          rgba(255,255,255,.22),
          rgba(255,255,255,.08) 30%,
          transparent 70%);
        filter: blur(18px);
        opacity:.75;
        z-index:1;
      }

      /* شرطة ضوء صغيرة */
      .lightLine{
        position:absolute;
        left:50%;
        bottom: 22px;
        width: min(420px, 70%);
        height: 6px;
        transform: translateX(-50%);
        border-radius: 999px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,.70), transparent);
        opacity: .85;
        animation: lineMove 2.8s ease-in-out infinite;
      }
      @keyframes lineMove{
        0%{ transform: translateX(-50%) scaleX(.65); opacity:.55; }
        50%{ transform: translateX(-50%) scaleX(1); opacity:1; }
        100%{ transform: translateX(-50%) scaleX(.65); opacity:.55; }
      }
    `;
    document.head.appendChild(style);

    ov = document.createElement("div");
    ov.id = "intro1111";
    ov.innerHTML = `
      <div id="introBox">
        <div class="softBloom"></div>
        <div class="heartGlow"></div>

        <div id="introText">
          <div class="t1">11:11</div>
          <div class="t2" id="introLine">...</div>
        </div>

        <div class="lightLine"></div>
      </div>
    `;
    document.body.appendChild(ov);
    return ov;
  }

  async function runIntro(label = "11:11"){
    if (running) return;
    running = true;

    const audioMain = $("bgAudio"); // نستخدم نفس عنصر الصوت بدون ما نلمس حالته
    if (!audioMain) { running = false; return; }

    const ov = ensureIntroUI();
    const lineEl = $("introLine");
    const t1 = ov.querySelector(".t1");
    if (t1) t1.textContent = label;
    if (lineEl) lineEl.textContent = pickLine();

    // خزّن الحالة بدون ما نخرب شي
    const saved = {
      src: audioMain.src,
      time: audioMain.currentTime || 0,
      paused: audioMain.paused,
      volume: audioMain.volume,
      loop: audioMain.loop
    };

    // شغّل واجهة المقدمة
    ov.classList.add("show");

    try{
      // خفض بسيط للصوت الحالي إذا كان شغال
      if (!saved.paused) await fadeVolume(audioMain, Math.min(saved.volume, 0.12), 700);

      // شغّل صوت الحدث فقط
      audioMain.pause();
      audioMain.src = AUDIO_FILE;
      audioMain.loop = false;
      audioMain.load();
      audioMain.volume = 0;

      await audioMain.play();
      await fadeVolume(audioMain, MAX_VOL, 900);

      // بعد مدة المقدمة: رجّع كلشي
      setTimeout(async () => {
        try{
          await fadeVolume(audioMain, 0, 700);
          audioMain.pause();

          // رجوع الصوت السابق مثل ما كان
          audioMain.src = saved.src;
          audioMain.loop = saved.loop;
          audioMain.load();
          audioMain.currentTime = saved.time || 0;
          audioMain.volume = saved.volume;

          if (!saved.paused) {
            await audioMain.play();
          }

        } catch {
          // حتى لو فشل، نخفي الواجهة
        } finally {
          ov.classList.remove("show");
          running = false;
        }
      }, INTRO_MS);

    } catch {
      ov.classList.remove("show");
      running = false;
    }
  }

  // ✅ زر الاختبار (يخدم tools.js)
  window.TEST_1111 = () => runIntro("11:11 TEST");

  // ✅ تشغيل تلقائي عند الوقت الحقيقي
  function tick(){
    const t = iraqHHMM();
    if (!matchesNow(t)) return;

    const k = minuteKey();
    if (k === lastKey) return;
    lastKey = k;

    const [hh] = t.split(":").map(Number);
    const label = (hh === 11) ? "11:11 AM" : "23:11 PM";
    runIntro(label);
  }
  setInterval(tick, 1000);
})();
