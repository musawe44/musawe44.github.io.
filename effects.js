(() => {
  const C = window.CONFIG;
  if(!C) return console.error("CONFIG missing");

  // DOM
  const bgSrc = document.getElementById("bgSrc");
  const avatar = document.getElementById("avatar");
  const nameEl = document.getElementById("name");
  const subEl = document.getElementById("subtitle");
  const badgesEl = document.getElementById("badges");
  const socialRow = document.getElementById("socialRow");
  const ytTitle = document.getElementById("ytTitle");
  const ytFrame = document.getElementById("ytFrame");
  const noteTitle = document.getElementById("noteTitle");
  const quoteEl = document.getElementById("mainQuote");
  const footerAyah = document.getElementById("footerAyah");
  const yEl = document.getElementById("y");

  const timeNow = document.getElementById("timeNow");
  const timeGhost = document.getElementById("timeGhost");
  const dateTxt = document.getElementById("dateTxt");
  const wxTxt = document.getElementById("wxTxt");

  const toggleTheme = document.getElementById("toggleTheme");

  const audioEl = document.getElementById("bgAudio");
  const btn = document.getElementById("audioBtn");
  const vol = document.getElementById("volume");
  const titleEl = document.getElementById("trackTitle");
  const prevBtn = document.getElementById("prevTrack");
  const nextBtn = document.getElementById("nextTrack");
  const msg = document.getElementById("audioMsg");
  const canvas = document.getElementById("viz");
  const ctx = canvas.getContext("2d");

  // ----- Helpers -----
  const ICON = {
    telegram:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.8 4.3c.3-1.2-.9-2-2-1.6L3.7 8.9c-1.1.4-1.1 2 .1 2.3l4.1 1.2 1.6 5c.3 1 1.6 1.3 2.4.6l2.3-2.1 4 3c.9.7 2.2.2 2.5-.9L21.8 4.3Z" fill="currentColor" opacity=".95"/></svg>`,
    instagram:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Z" stroke="currentColor" stroke-width="2" opacity=".95"/><path d="M12 16.1A4.1 4.1 0 1 0 12 8a4.1 4.1 0 0 0 0 8.1Z" stroke="currentColor" stroke-width="2"/></svg>`
  };
  function showMsg(s){
    msg.textContent=s;
    msg.classList.add("show");
    setTimeout(()=>msg.classList.remove("show"), 2800);
  }

  // ----- Apply CONFIG to UI -----
  bgSrc.src = C.files.bgVideo;
  avatar.src = C.files.avatar;

  nameEl.textContent = C.profile.name;
  subEl.textContent = C.profile.subtitle;

  badgesEl.innerHTML = "";
  (C.profile.badges || []).forEach(b=>{
    const s=document.createElement("span");
    s.className="badge";
    s.textContent=b;
    badgesEl.appendChild(s);
  });

  socialRow.innerHTML = "";
  (C.social || []).forEach(s=>{
    const a=document.createElement("a");
    a.className="socLink";
    a.href=s.url; a.target="_blank"; a.rel="noopener";
    a.innerHTML=`<span class="socLeft"><span class="socIco">${ICON[s.icon]||""}</span>${s.label}</span><span>↗</span>`;
    socialRow.appendChild(a);
  });

  ytTitle.textContent = C.youtube.title;
  ytFrame.src = C.youtube.embed;

  noteTitle.textContent = C.note.title || "كلمة";
  footerAyah.textContent = C.footer.ayah || "";
  yEl.textContent = new Date().getFullYear();

  // ----- Theme -----
  const saved = localStorage.getItem("themeMode");
  if(saved==="light") document.body.classList.add("light");
  toggleTheme.addEventListener("click", ()=>{
    document.body.classList.toggle("light");
    localStorage.setItem("themeMode", document.body.classList.contains("light") ? "light" : "dark");
  });

  // ----- Sheet note (B1) -----
  if(C.note.sheetCsvUrl){
    fetch(C.note.sheetCsvUrl,{cache:"no-store"})
      .then(r=>r.text())
      .then(t=>{
        t=t.replace(/^\uFEFF/,"");
        const i=t.indexOf(",");
        if(i===-1) return;
        const v=t.slice(i+1).trim().replace(/^"|"$/g,"");
        if(v) quoteEl.textContent=v;
      })
      .catch(()=>{});
  }

  // ----- Clock + Date (Iraq) -----
  function iraqHHMM(){
    return new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Baghdad",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date());
  }
  function iraqDate(){
    return new Intl.DateTimeFormat("ar-IQ",{timeZone:"Asia/Baghdad",weekday:"long",day:"2-digit",month:"long",year:"numeric"}).format(new Date());
  }

  // ----- Weather Basra -----
  async function fetchWeather(){
    try{
      const {lat, lon} = C.basra;
      const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=Asia%2FBaghdad`;
      const r=await fetch(url,{cache:"no-store"});
      const d=await r.json();
      wxTxt.textContent = `البصرة: ${Math.round(d.current.temperature_2m)}°`;
    }catch(e){
      wxTxt.textContent="طقس البصرة غير متاح";
    }
  }
  fetchWeather();
  setInterval(fetchWeather, 10*60*1000);

  // ----- Audio (Normal + Event) + Visualizer -----
  let idx=0, playing=false, inEvent=false, lastKey=null, eventTimer=null, savedState=null;
  let audioCtx=null, analyser=null, srcNode=null, freq=null, raf=null;

  function setSrc(file){ audioEl.src=file; audioEl.load(); }
  function applyVol(){ audioEl.volume=(Number(vol.value)||70)/100; }
  vol.addEventListener("input", applyVol); applyVol();

  function setTitle(){
    titleEl.textContent = inEvent
      ? `🎁 Event — ${C.audio.eventTrack.title}`
      : `المقطع: ${idx+1} — ${C.audio.tracks[idx].title}`;
  }

  function ensureGraph(){
    if(audioCtx) return;
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize=2048;
    analyser.smoothingTimeConstant=0.82;
    freq = new Uint8Array(analyser.frequencyBinCount);
    srcNode = audioCtx.createMediaElementSource(audioEl);
    srcNode.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  function resize(){
    const dpr=window.devicePixelRatio||1;
    const r=canvas.getBoundingClientRect();
    canvas.width=Math.floor(r.width*dpr);
    canvas.height=Math.floor(r.height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener("resize", resize);
  resize();

  function stopViz(){
    if(raf) cancelAnimationFrame(raf);
    raf=null;
    const w=canvas.getBoundingClientRect().width;
    const h=canvas.getBoundingClientRect().height;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle="rgba(255,255,255,0.03)";
    ctx.fillRect(0,0,w,h);
  }

  function drawBars(){
    const w=canvas.getBoundingClientRect().width;
    const h=canvas.getBoundingClientRect().height;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle="rgba(255,255,255,0.03)";
    ctx.fillRect(0,0,w,h);

    analyser.getByteFrequencyData(freq);
    const bars=64, step=Math.floor(freq.length/bars), barW=w/bars;
    for(let i=0;i<bars;i++){
      const v=freq[i*step]/255;
      const barH=Math.max(6, v*(h-12));
      ctx.fillStyle="rgba(255,255,255,0.78)";
      ctx.fillRect(i*barW+barW*0.18, h-barH, barW*0.64, barH);
    }
    raf=requestAnimationFrame(drawBars);
  }
  function startViz(){ if(raf) cancelAnimationFrame(raf); drawBars(); }

  function loadTrack(i){
    idx=(i + C.audio.tracks.length) % C.audio.tracks.length;
    if(!inEvent){
      setSrc(C.audio.tracks[idx].file);
      setTitle();
    }
  }
  loadTrack(0);

  async function play(){
    ensureGraph();
    if(audioCtx.state==="suspended") await audioCtx.resume();
    await audioEl.play();
    playing=true;
    btn.textContent="إيقاف";
    startViz();
  }
  function pause(){
    audioEl.pause();
    playing=false;
    btn.textContent="تشغيل";
    stopViz();
  }

  btn.addEventListener("click", async()=>{
    try{ if(!playing) await play(); else pause(); }
    catch(e){ showMsg("⚠️ اضغط مرة ثانية لتفعيل الصوت"); }
  });

  prevBtn.addEventListener("click", async()=>{
    if(inEvent) return;
    const was=playing; if(was) pause();
    loadTrack(idx-1);
    if(was) await play();
  });

  nextBtn.addEventListener("click", async()=>{
    if(inEvent) return;
    const was=playing; if(was) pause();
    loadTrack(idx+1);
    if(was) await play();
  });

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
    if(inEvent) return;
    inEvent=true;

    savedState = {
      idx, time: audioEl.currentTime||0,
      was: playing, vol: (Number(vol.value)||70)/100
    };

    try{
      if(savedState.was){
        await fadeTo(Math.min(savedState.vol, 0.20), 700);
        pause();
      }
      setSrc(C.audio.eventTrack.file);
      audioEl.loop=false;
      setTitle();
      if(savedState.was) await play();

      clearTimeout(eventTimer);
      eventTimer=setTimeout(endEvent, C.audio.eventDurationMs||60000);
    }catch(e){
      endEvent();
    }
  }

  async function endEvent(){
    if(!inEvent) return;
    clearTimeout(eventTimer);
    try{
      if(playing) pause();
      inEvent=false;

      loadTrack(savedState.idx);
      setSrc(C.audio.tracks[savedState.idx].file);
      audioEl.currentTime = savedState.time||0;

      vol.value = Math.round(savedState.vol*100);
      applyVol();
      setTitle();

      if(savedState.was){
        await play();
        await fadeTo(savedState.vol, 900);
      }
    } finally {
      savedState=null;
    }
  }

  function checkTimes(nowHHMM){
    if(!C.audio.specialTimes.includes(nowHHMM)) return;
    const key = new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Baghdad",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date());
    if(lastKey===key) return;
    lastKey=key;
    startEvent();
  }

  function tick(){
    const t = iraqHHMM();
    timeNow.textContent=t;
    timeGhost.textContent=t;
    dateTxt.textContent=iraqDate();
    checkTimes(t);
  }
  tick();
  setInterval(tick, 1000);
})();