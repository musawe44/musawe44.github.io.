// audio.js — Playlist player (no 11:11 here)
(() => {
  const CFG = window.APP_CONFIG;
  if (!CFG?.musicPlayer?.enabled) return;

  const audioEl = document.getElementById("bgAudio");
  const btn = document.getElementById("audioBtn");
  const prevBtn = document.getElementById("prevTrack");
  const nextBtn = document.getElementById("nextTrack");
  const vol = document.getElementById("volume");
  const titleEl = document.getElementById("trackTitle");

  if (!audioEl || !btn || !prevBtn || !nextBtn || !vol || !titleEl) {
    console.error("Audio UI missing");
    return;
  }

  const tracks = Array.isArray(CFG.musicPlayer.tracks) ? CFG.musicPlayer.tracks : [];
  if (!tracks.length) {
    titleEl.textContent = "لا يوجد مقاطع";
    return;
  }

  const state = (window.APP_AUDIO_STATE = window.APP_AUDIO_STATE || {
    playing: false,
    index: 0
  });

  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

  function setTrack(i){
    state.index = (i + tracks.length) % tracks.length;
    const t = tracks[state.index];

    const url = new URL(t.file, document.baseURI).href; // حل مسارات
    audioEl.src = url;
    audioEl.loop = !!CFG.musicPlayer.loop;
    audioEl.load();

    titleEl.textContent = `المقطع: ${state.index + 1} — ${t.title}`;
  }

  function setVol(){
    audioEl.volume = clamp((Number(vol.value) || 70) / 100, 0, 1);
  }

  async function play(){
    try{
      await audioEl.play();
      state.playing = true;
      btn.textContent = "إيقاف";
    } catch(e){
      console.error("Play failed:", e);
      btn.textContent = "اضغط مرة ثانية";
    }
  }

  function pause(){
    audioEl.pause();
    state.playing = false;
    btn.textContent = "تشغيل";
  }

  // init
  vol.value = String(Math.round((CFG.musicPlayer.startVolume ?? 0.7) * 100));
  setVol();
  vol.addEventListener("input", setVol);

  setTrack(0);

  btn.addEventListener("click", async () => {
    if (!state.playing) await play();
    else pause();
  });

  prevBtn.addEventListener("click", async () => {
    const was = state.playing;
    if (was) pause();
    setTrack(state.index - 1);
    if (was) await play();
  });

  nextBtn.addEventListener("click", async () => {
    const was = state.playing;
    if (was) pause();
    setTrack(state.index + 1);
    if (was) await play();
  });
})();
