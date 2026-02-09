/* =========================
   CONFIG.JS
   هذا الملف تعدّل بيه كلشي
========================= */

window.CONFIG = {
  /* ===== ملفات الموقع ===== */
  files: {
    bgVideo: "bg.mp4.mp4",      // ✅ فيديو الخلفية
    avatar: "avatar.jpg"        // ✅ صورتك
  },

  /* ===== معلوماتك ===== */
  profile: {
    name: "MUSAWI",
    subtitle: "طالب GEOLOGY — جامعة البصرة",
    badges: ["📚 تعلّم", "💻 خبرة بالحاسبات", "📍 البصرة"]
  },

  /* ===== روابط التواصل ===== */
  social: [
    { label: "Telegram",  url: "https://t.me/Mu29_iq",        icon: "telegram" },
    { label: "Instagram", url: "https://www.instagram.com/mu29__/", icon: "instagram" }
  ],

  /* ===== يوتيوب ===== */
  youtube: {
    title: "صورة موسيقى",
    embed: "https://www.youtube.com/embed/BXChU6bMEXU"
  },

  /* ===== النص اللي يجي من Google Sheet =====
     ملاحظة: ناخذ الخانة B1 (يعني العمود الثاني)
  */
  note: {
    title: "كلمة",
    sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXkdu2p1KVIjDPGdb97HfmkKa2WuvKN349Z5qdZOd_RTCyT__xNLL44swa0EUAnq614hxS9p52NSlL/pub?gid=0&single=true&output=csv"
  },

  /* ===== الصوت ===== */
  audio: {
    // ✅ المقاطع العادية (3 خيارات)
    // خليها مطابقة للأسماء اللي عندك بالريبو
    tracks: [
      { id: "t1", title: "Track 1", file: "audio.mp3.mp3.mp3" },
      { id: "t2", title: "Track 2", file: "audio1.mp3.mp3" },
      { id: "t3", title: "Track 3", file: "eleven.mp3.mp3" }
    ],

    // ✅ مقطع خاص للـ 11:11 (منفصل عن قائمة الاستماع حتى ما يخربط)
    special: {
      enabled: true,
      times: ["11:11", "23:11"],     // ✅ 11:11 صباحاً + 23:11 ليلاً
      durationMs: 60000,             // ✅ دقيقة كاملة
      track: { title: "11:11 Special", file: "eleven.mp3.mp3" }
    },

    // ✅ إعدادات افتراضية
    defaults: {
      startIndex: 0,   // أي مقطع يبدأ أول ما تفتح الصفحة (0 = الأول)
      volume: 70,      // 0..100
      loop: true       // تكرار المقطع أثناء الاستماع
    }
  },

  /* ===== الفوتر ===== */
  footer: {
    ayah: "إِنَّ مَعَ الْعُسْرِ يُسْرًا"
  },

  /* ===== طقس البصرة (إحداثيات) ===== */
  basra: { lat: 30.5085, lon: 47.7804 }
};