/* =========================
   config.js — مركز التحكم (موحّد)
   ========================= */

window.APP_CONFIG = {
  // خلفية الفيديو
  backgroundVideo: {
    enabled: true,
    file: "bg.mp4.mp4",
    muted: true,
    loop: true,
    autoplay: true,
    playbackRate: 1.0,
  },

  // صورة
  avatar: { file: "avatar.jpg" },

  // روابط
  social: {
    telegram: "https://t.me/Mu29_iq",
    instagram: "https://www.instagram.com/mu29__/",
  },

  // يوتيوب
  youtube: {
    embedUrl: "https://www.youtube.com/embed/BXChU6bMEXU",
    title: "YouTube video",
  },

  // ملاحظة من الشيت
  noteFromSheet: {
    enabled: true,
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXkdu2p1KVIjDPGdb97HfmkKa2WuvKN349Z5qdZOd_RTCyT__xNLL44swa0EUAnq614hxS9p52NSlL/pub?gid=0&single=true&output=csv",
    fallbackText: "…",
  },

  // موسيقى الألبوم (حسب أسماء ملفاتك بالصورة)
  musicPlayer: {
    enabled: true,
    tracks: [
      { title: "Track 1", file: "audio.mp3.mp3.mp3" }, // ✅ مثل الصورة
      { title: "Track 2", file: "audio1.mp3.mp3" },    // ✅ مثل الصورة
    ],
    startVolume: 0.7,
    loop: true,
  },

  // حدث 11:11 (صوت منفصل)
  event1111: {
    enabled: true,
    times: [
      { h: 11, m: 11 },
      { h: 23, m: 11 },
    ],
    durationSeconds: 60,
    eventAudioFile: "eleven.mp3.mp3", // ✅ مثل الصورة
    romanticLines: [
      "جاي يفكر بيج…",
      "11:11… لحظة تذكّر حلوة.",
      "إذا تحسين بشي… يمكن هو نفس الشعور.",
      "مو صدفة… 11:11.",
    ],
  },

  performance: {
    pauseVideoWhenHidden: true,
    pauseVisualizerWhenPaused: true,
  },
};
