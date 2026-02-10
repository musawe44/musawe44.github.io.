window.APP_CONFIG = {
  backgroundVideo: {
    enabled: true,
    file: "bg.mp4.mp4",       // ✅ اسم الفيديو عندك
    muted: true,
    loop: true,
    autoplay: true,
    playbackRate: 1.0
  },

  musicPlayer: {
    enabled: true,
    tracks: [
      { title: "Track 1", file: "audio.mp3.mp3.mp3" }, // ✅ حسب ملفاتك
      { title: "Track 2", file: "audio1.mp3.mp3" }     // ✅ حسب ملفاتك
    ],
    startVolume: 0.70,
    loop: true
  },

  performance: {
    pauseVideoWhenHidden: true
  }
};
