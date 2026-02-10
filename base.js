// base.js — Background loader (safe URL + fallback)
(() => {
  const CFG = window.APP_CONFIG || {};
  const video = document.getElementById("bgVideo");
  const status = document.getElementById("statusMsg");
  if (!video) return;

  const file = CFG.backgroundVideo?.file || "bg.mp4.mp4";
  const url = new URL(file, document.baseURI).href;

  function setStatus(msg) {
    if (status) status.textContent = msg || "";
  }

  // إعدادات فيديو
  if (CFG.backgroundVideo?.enabled === false) {
    setStatus("الخلفية مطفّية من الإعدادات");
    return;
  }

  video.muted = CFG.backgroundVideo?.muted !== false; // لازم muted حتى autoplay ينجح
  video.loop = CFG.backgroundVideo?.loop !== false;
  video.autoplay = true;
  video.playsInline = true;

  const rate = Number(CFG.backgroundVideo?.playbackRate ?? 1);
  if (!Number.isNaN(rate)) video.playbackRate = rate;

  // جرّب نتأكد الملف موجود قبل التشغيل (حتى ما تبقى شاشة سودة)
  fetch(url, { method: "HEAD", cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error("VIDEO_NOT_FOUND");
      video.src = url;
      return video.play();
    })
    .then(() => {
      video.style.opacity = "1";
      setStatus("");
    })
    .catch(() => {
      video.style.opacity = "0";
      setStatus("⚠️ الخلفية ما انوجدت (تأكد اسم/مكان bg.mp4.mp4 بالريبو)");
      console.error("Background video failed:", url);
    });

  if (CFG.performance?.pauseVideoWhenHidden) {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    });
  }
})();
