window.APP_CONFIG = {
  backgroundVideo: {
    enabled: true,
    file: "bg.mp4.mp4",     // عدل الاسم هنا فقط لو مختلف
    muted: true,
    loop: true,
    autoplay: true,
    playbackRate: 1.0,
  },

  noteFromSheet: {
    enabled: true,
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXkdu2p1KVIjDPGdb97HfmkKa2WuvKN349Z5qdZOd_RTCyT__xNLL44swa0EUAnq614hxS9p52NSlL/pub?gid=0&single=true&output=csv",
    fallbackText: "…",
  },

  clock: { timezone: "Asia/Baghdad", locale: "ar-IQ" },

  weather: {
    enabled: true,
    cityName: "البصرة",
    lat: 30.5085,
    lon: 47.7804,
    refreshMinutes: 10,
  },

  musicPlayer: {
    enabled: true,
    tracks: [
      { title: "المقطع 1", file: "audio.mp3.mp3.mp3" },
      { title: "المقطع 2", file: "audio1.mp3.mp3" },
    ],
    startVolume: 0.70,
    loop: true,
  },

  performance: {
    pauseVideoWhenHidden: true,
    pauseVisualizerWhenPaused: true,
  },
};
