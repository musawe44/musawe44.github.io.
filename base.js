// base.js — background video loader (safe paths)
(() => {
  const CFG = window.APP_CONFIG || {};
  const v = document.getElementById("bgVideo");
  if (!v) return;

  // اسم ملف الفيديو من الكونفك (جرب أكثر من صيغة)
  const file =
    CFG.backgroundVideo?.file ||
    CFG.files?.bgVideo ||
    "bg.mp4.mp4";

  // يحل مشكلة المسار (Root/Subfolder) تلقائياً
  const url = new URL(file, document.baseURI).href;

  v.src = url;
  v.muted = CFG.backgroundVideo?.muted !== false; // خليها muted افتراضي
  v.loop = CFG.backgroundVideo?.loop !== false;
  v.autoplay = true;
  v.playsInline = true;

  const rate = Number(CFG.backgroundVideo?.playbackRate ?? 1);
  if (!Number.isNaN(rate)) v.playbackRate = rate;

  // شغّل بهدوء (حتى لو المتصفح يمنع autoplay)
  v.play().catch(() => {});

  // وقف/شغل عند تبديل التبويب
  if (CFG.performance?.pauseVideoWhenHidden) {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    });
  }
})();
