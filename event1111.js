// event1111.js — Romantic 11:11 (نص + نبض + صوت)
(() => {
  console.log("Romantic 11:11 loaded ❤️");

  const AUDIO_FILE = "eleven.mp3.mp3"; // اسم ملف الصوت
  const DURATION = 8000; // مدة الحدث (مللي ثانية)
  const MAX_VOL = 0.35;

  const lines = [
    "11:11… يمكن هسه يفكّر بيج 🤍",
    "بهذه اللحظة… اسمچ مرّ بباله",
    "مو صدفة… هذا إحساس",
    "إذا حسّيتي بشي… يمكن هو نفس الشعور",
    "11:11… لحظة تخص قلبين"
  ];

  function $(id){ return document.getElementById(id); }

  async function run(){
    const audio = $("bgAudio");
    const video = $("bgVideo") || document.querySelector(".bgVideo");
    if(!audio) return;

    /* ===== عنصر النص ===== */
    let box = $("heartBox");
    if(!box){
      box = document.createElement("div");
      box.id = "heartBox";
      box.style.cssText = `
        position:fixed;
        inset:0;
        z-index:9999;
        display:flex;
        align-items:center;
        justify-content:center;
        pointer-events:none;
      `;
      box.innerHTML = `
        <div id="heartInner" style="
          padding:22px 26px;
          border-radius:24px;
          background: rgba(0,0,0,.35);
          backdrop-filter: blur(10px);
          color: white;
          text-align:center;
          font-family: Cairo, system-ui, Arial;
          font-weight:900;
          animation: heartbeat 1.8s infinite;
          box-shadow: 0 20px 60px rgba(0,0,0,.45);
        ">
          <div style="font-size:42px; margin-bottom:10px">11:11</div>
          <div style="font-size:22px; line-height:1.9">
            ${lines[Math.floor(Math.random()*lines.length)]}
          </div>
        </div>
      `;
      document.body.appendChild(box);

      const style = document.createElement("style");
      style.textContent = `
        @keyframes heartbeat{
          0%{ transform: scale(1); }
          25%{ transform: scale(1.05); }
          40%{ transform: scale(0.98); }
          60%{ transform: scale(1.06); }
          100%{ transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }

    /* ===== زوم الخلفية ===== */
    if(video){
      video.style.transition = "transform 3s ease, filter 3s ease";
      video.style.transform = "scale(1.06)";
      video.style.filter = "saturate(1.15)";
    }

    /* ===== الصوت ===== */
    audio.src = AUDIO_FILE;
    audio.volume = 0;
    await audio.play();

    // Fade in
    let v = 0;
    const fin = setInterval(() => {
      v += 0.02;
      audio.volume = Math.min(v, MAX_VOL);
      if(v >= MAX_VOL) clearInterval(fin);
    }, 80);

    /* ===== إنهاء ===== */
    setTimeout(() => {
      // Fade out
      const fout = setInterval(() => {
        v -= 0.02;
        audio.volume = Math.max(v, 0);
        if(v <= 0){
          clearInterval(fout);
          audio.pause();

          if(video){
            video.style.transform = "";
            video.style.filter = "";
          }

          const b = $("heartBox");
          if(b) b.remove();
        }
      }, 80);
    }, DURATION);
  }

  // زر الاختبار
  window.TEST_1111 = run;
})();
