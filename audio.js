(() => {
  const CFG = window.APP_CONFIG;
  if (!CFG?.musicPlayer?.enabled) return;

  const audioEl  = document.getElementById("bgAudio");
  const btn      = document.getElementById("audioBtn");
  const vol      = document.getElementById("volume");
  const titleEl  = document.getElementById("trackTitle");
  const prevBtn  = document.getElementById("prevTrack");
  const nextBtn  = document.getElementById("nextTrack");
  const canvas   = document.getElementById("viz");

  if (!audioEl || !btn || !vol || !titleEl || !prevBtn || !nextBtn || !canvas) return;

  const ctx2d = canvas.getContext("2d");
  const tracks = Array.isArray(CFG.musicPlayer.tracks) ? CFG.musicPlayer.tracks : [];
  const LOOP = !!CFG.musicPlayer.loop;

  const state = (window.APP_AUDIO_STATE = window.APP_AUDIO_STATE || {
    playing: false,
    index: 0,
    audioCtx: null,
    analyser: null,
    srcNode: null,
    freqData: null,
    rafId: null,
  });

  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

  function resizeCanvas(){
    const dpr = window.devicePixelRatio || 1;
    const r = canvas.getBoundingClientRect();
    canvas.width  = Math.floor(r.width * dpr);
    canvas.height = Math.floor(r.height * dpr);
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawIdle(){
    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;
    ctx2d.clearRect(0, 0, w, h);
    ctx2d.fillStyle = "rgba(255,255,255,0.03)";
    ctx2d.fillRect(0, 0, w, h);
    ctx2d.strokeStyle = "rgba(255,255,255,0.35)";
    ctx2d.lineWidth = 2;
    ctx2d.beginPath();
    ctx2d.moveTo(10, h/2);
    ctx2d.lineTo(w-10, h/2);
    ctx2d.stroke();
  }

  function ensureAudioGraph(){
    if (state.audioCtx) return;
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    state.analyser = state.audioCtx.createAnalyser();
    state.analyser.fftSize = 2048;
    state.analyser.smoothingTimeConstant = 0.82;
    state.freqData = new Uint8Array(state.analyser.frequencyBinCount);
    state.srcNode = state.audioCtx.createMediaElementSource(audioEl);
    state.srcNode.connect(state.analyser);
    state.analyser.connect(state.audioCtx.destination);
  }

  function stopViz(){
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = null;
    drawIdle();
  }

  function drawBars(){
    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;

    ctx2d.clearRect(0, 0, w, h);
    ctx2d.fillStyle = "rgba(255,255,255,0.03)";
    ctx2d.fillRect(0, 0, w, h);

    if (!state.analyser || !state.freqData) {
      state.rafId = requestAnimationFrame(drawBars);
      return;
    }

    state.analyser.getByteFrequencyData(state.freqData);

    const bars = 64;
    const step = Math.max(1, Math.floor(state.freqData.length / bars));
    const barW = w / bars;

    for (let i = 0; i < bars; i++) {
      const v = state.freqData[i * step] / 255;
      const barH = Math.max(6, v * (h - 12));
      const x = i * barW;
      const y = h - barH;
      ctx2d.fillStyle = "rgba(255,255,255,0.80)";
      ctx2d.fillRect(x + barW * 0.18, y, barW * 0.64, barH);
    }

    state.rafId = requestAnimationFrame(drawBars);
  }

  function setVolumeFromSlider(){
    const v = clamp(Number(vol.value) || 0, 0, 100) / 100;
    audioEl.volume = v;
  }

  function setTrack(i){
    if (!tracks.length) {
      titleEl.textContent = "لا يوجد مقاطع";
      audioEl.removeAttribute("src");
      return;
    }
    state.index = (i + tracks.length) % tracks.length;
    const t = tracks[state.index];
    audioEl.src = new URL(t.file, document.baseURI).href;
    audioEl.loop = LOOP;
    audioEl.load();
    titleEl.textContent = `المقطع: ${state.index + 1} — ${t.title}`;
  }

  async function play(){
    ensureAudioGraph();
    if (state.audioCtx.state === "suspended") await state.audioCtx.resume();
    await audioEl.play();
    state.playing = true;
    btn.textContent = "إيقاف";
    drawBars();
  }

  function pause(){
    audioEl.pause();
    state.playing = false;
    btn.textContent = "تشغيل";
    if (CFG.performance?.pauseVisualizerWhenPaused !== false) stopViz();
  }

  // Init
  resizeCanvas();
  window.addEventListener("resize", () => {
    resizeCanvas();
    if (!state.playing) drawIdle();
  });

  vol.value = String(Math.round((CFG.musicPlayer.startVolume ?? 0.7) * 100));
  setVolumeFromSlider();
  vol.addEventListener("input", setVolumeFromSlider);

  setTrack(0);
  drawIdle();

  btn.addEventListener("click", async () => {
    try{
      if (!state.playing) await play();
      else pause();
    }catch{
      btn.textContent = "اضغط مرة ثانية";
    }
  });

  prevBtn.addEventListener("click", async () => {
    const wasPlaying = state.playing;
    if (wasPlaying) pause();
    setTrack(state.index - 1);
    if (wasPlaying) await play();
  });

  nextBtn.addEventListener("click", async () => {
    const wasPlaying = state.playing;
    if (wasPlaying) pause();
    setTrack(state.index + 1);
    if (wasPlaying) await play();
  });

  audioEl.addEventListener("pause", () => {
    state.playing = false;
    btn.textContent = "تشغيل";
    if (CFG.performance?.pauseVisualizerWhenPaused !== false) stopViz();
  });
})();
