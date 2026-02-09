// audio.js — الألبوم + الموجات (بدون 11:11)
(() => {
  window.APP = window.APP || {};
  const state = window.APP.audioState = window.APP.audioState || {
    ctx:null, analyser:null, srcNode:null, data:null, raf:null,
    playing:false, inEvent:false, idx:0
  };

  const CFG = {
    album: [
      { title:"Track 1", file:"audio.mp3.mp3.mp3" },
      { title:"Track 2", file:"audio1.mp3.mp3" }
    ],
    defaults: { startIndex:0, volume:70, loop:true }
  };

  window.APP.audioCFG = CFG;

  const audioEl=document.getElementById("bgAudio");
  const btn=document.getElementById("audioBtn");
  const vol=document.getElementById("volume");
  const titleEl=document.getElementById("trackTitle");
  const prev=document.getElementById("prevTrack");
  const next=document.getElementById("nextTrack");
  const canvas=document.getElementById("viz");
  if(!audioEl||!btn||!vol||!titleEl||!prev||!next||!canvas) return;
  const ctx=canvas.getContext("2d");

  function setTrack(i){
    const tracks=CFG.album;
    if(!tracks.length){ titleEl.textContent="لا يوجد مقاطع"; return; }
    state.idx=(i+tracks.length)%tracks.length;
    const t=tracks[state.idx];
    audioEl.src=t.file;
    audioEl.loop=!!CFG.defaults.loop;
    titleEl.textContent=`المقطع: ${state.idx+1} — ${t.title}`;
    audioEl.load();
  }

  // volume
  vol.value=String(CFG.defaults.volume ?? 70);
  audioEl.volume=(Number(vol.value)||70)/100;
  vol.addEventListener("input", ()=> audioEl.volume=(Number(vol.value)||0)/100);

  function resize(){
    const dpr=window.devicePixelRatio||1;
    const r=canvas.getBoundingClientRect();
    canvas.width=Math.floor(r.width*dpr);
    canvas.height=Math.floor(r.height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener("resize", resize);
  resize();

  function ensureGraph(){
    if(state.ctx) return;
    state.ctx=new (window.AudioContext||window.webkitAudioContext)();
    state.analyser=state.ctx.createAnalyser();
    state.analyser.fftSize=2048;
    state.analyser.smoothingTimeConstant=0.82;
    state.data=new Uint8Array(state.analyser.frequencyBinCount);
    state.srcNode=state.ctx.createMediaElementSource(audioEl);
    state.srcNode.connect(state.analyser);
    state.analyser.connect(state.ctx.destination);
  }

  function stopViz(){
    if(state.raf) cancelAnimationFrame(state.raf);
    state.raf=null;
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

    state.analyser.getByteFrequencyData(state.data);
    const bars=64, step=Math.floor(state.data.length/bars), barW=w/bars;
    for(let i=0;i<bars;i++){
      const v=state.data[i*step]/255;
      const barH=Math.max(6, v*(h-12));
      ctx.fillStyle="rgba(255,255,255,0.80)";
      ctx.fillRect(i*barW+barW*0.18, h-barH, barW*0.64, barH);
    }
    state.raf=requestAnimationFrame(drawBars);
  }

  async function play(){
    ensureGraph();
    if(state.ctx.state==="suspended") await state.ctx.resume();
    await audioEl.play();
    state.playing=true;
    btn.textContent="إيقاف";
    drawBars();
  }

  function pause(){
    audioEl.pause();
    state.playing=false;
    btn.textContent="تشغيل";
    stopViz();
  }

  btn.addEventListener("click", async()=>{
    try{
      if(!state.playing) await play();
      else pause();
    }catch{
      btn.textContent="اضغط مرة ثانية";
    }
  });

  prev.addEventListener("click", async()=>{
    if(state.inEvent) return;
    const was=state.playing; if(was) pause();
    setTrack(state.idx-1);
    if(was) await play();
  });

  next.addEventListener("click", async()=>{
    if(state.inEvent) return;
    const was=state.playing; if(was) pause();
    setTrack(state.idx+1);
    if(was) await play();
  });

  // init
  setTrack(CFG.defaults.startIndex || 0);
  stopViz();
})();
