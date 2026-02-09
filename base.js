// base.js — تشغيل الأساس (خلفية + تخفيف)
(() => {
  const CFG = window.APP_CONFIG;
  if (!CFG) return console.error("APP_CONFIG not found");

  const video = document.getElementById("bgVideo");
  if (video && (CFG.backgroundVideo?.enabled !== false)) {
    const file = CFG.backgroundVideo?.file;
    if (file) {
      video.src = file;
      video.muted = CFG.backgroundVideo?.muted !== false;
      video.loop = CFG.backgroundVideo?.loop !== false;
      video.autoplay = CFG.backgroundVideo?.autoplay !== false;
      video.playsInline = true;

      const rate = Number(CFG.backgroundVideo?.playbackRate ?? 1);
      if (!Number.isNaN(rate)) video.playbackRate = rate;

      video.play().catch(() => {});
    }
  }

  // تخفيف: وقف الفيديو إذا التبويب مخفي
  if (CFG.performance?.pauseVideoWhenHidden) {
    document.addEventListener("visibilitychange", () => {
      if (!video) return;
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    });
  }
})();
