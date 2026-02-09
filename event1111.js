// event1111.js — 11:11 فقط (مقطع منفصل)
(() => {
  window.APP = window.APP || {};
  const state = window.APP.audioState;
  const audioCFG = window.APP.audioCFG;

  const EVT = {
    enabled:true,
    times:["11:11","23:11"],
    durationMs:60000,
    track:{ title:"11:11 Special", file:"eleven.mp3.mp3" }
  };

  const audioEl=document.getElementById("bgAudio");
  const vol=document.getElementById("volume");
  const titleEl=document.getElementById("trackTitle");
  const btn=document.getElementById("audioBtn");
  if(!EVT.enabled || !audioEl || !vol || !titleEl || !btn || !state || !audioCFG) return;

  let lastKey=null;
  let saved=null;

  function iraqHHMM(){
    return new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Baghdad",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date());
  }

  function fadeTo(target, ms=700){
    const start=audioEl.volume, t0=performance.now();
    return new Promise(res=>{
      function step(t){
        const p=Math.min(1,(t-t0)/ms);
        audioEl.volume = start + (target-start)*p;
        p<1 ? requestAnimationFrame(step) : res();
      }
      requestAnimationFrame(step);
    });
  }

  async function startEvent(){
    if(state.inEvent) return;
    state.inEvent=true;

    saved = {
      src: audioEl.src,
      time: audioEl.currentTime||0,
      was: state.playing,
      vol: (Number(vol.value)||70)/100,
      idx: state.idx
    };

    try{
      if(saved.was){
        await fadeTo(Math.min(saved.vol, 0.18), 700);
        audioEl.pause();
        state.playing=false;
        btn.textContent="تشغيل";
      }

      audioEl.src = EVT.track.file;
      audioEl.loop = false;
      audioEl.load();
      titleEl.textContent = `✨ 11:11 — ${EVT.track.title}`;

      if(saved.was){
        if(state.ctx && state.ctx.state==="suspended") await state.ctx.resume();
        await audioEl.play();
        state.playing=true;
        btn.textContent="إيقاف";
      }

      setTimeout(endEvent, EVT.durationMs);
    }catch{
      endEvent();
    }
  }

  async function endEvent(){
    if(!state.inEvent) return;
    try{
      if(state.playing){
        audioEl.pause();
        state.playing=false;
        btn.textContent="تشغيل";
      }
      state.inEvent=false;

      // رجّع للألبوم
      audioEl.src = saved.src;
      audioEl.load();
      audioEl.currentTime = saved.time || 0;

      vol.value = String(Math.round(saved.vol*100));
      audioEl.volume = saved.vol;

      // رجع العنوان
      const t = audioCFG.album[saved.idx];
      if(t) titleEl.textContent = `المقطع: ${saved.idx+1} — ${t.title}`;

      if(saved.was){
        if(state.ctx && state.ctx.state==="suspended") await state.ctx.resume();
        await audioEl.play();
        state.playing=true;
        btn.textContent="إيقاف";
        await fadeTo(saved.vol, 900);
      }
    } finally {
      saved=null;
    }
  }

  function tick(){
    const t = iraqHHMM();
    if(!EVT.times.includes(t)) return;

    const key = new Intl.DateTimeFormat("en-CA",{
      timeZone:"Asia/Baghdad",year:"numeric",month:"2-digit",day:"2-digit",
      hour:"2-digit",minute:"2-digit",hour12:false
    }).format(new Date());

    if(lastKey===key) return;
    lastKey=key;
    startEvent();
  }

  setInterval(tick, 1000);
})();
