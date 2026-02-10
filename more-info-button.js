// more-info-button.js — زر “معلومات أكثر” بدون ما نلمس الواجهة
(() => {
  // إذا أنت أصلًا عندك زر بنفس الاسم لا نكرر
  if (document.getElementById("moreInfoBtn")) return;

  const style = document.createElement("style");
  style.textContent = `
    #moreInfoBtn{
      position: fixed;
      right: 12px;
      bottom: 12px;
      z-index: 9999;
      text-decoration: none;
      padding: 10px 12px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.10);
      color: rgba(255,255,255,.92);
      font-family: Cairo, system-ui, Arial;
      font-weight: 900;
      box-shadow: 0 10px 24px rgba(0,0,0,.14);
      backdrop-filter: blur(10px);
    }
    #moreInfoBtn:hover{ background: rgba(255,255,255,.14); }

    body.light #moreInfoBtn{
      border-color: rgba(0,0,0,.10);
      background: rgba(0,0,0,.04);
      color: rgba(10,16,28,.86);
    }
  `;
  document.head.appendChild(style);

  const a = document.createElement("a");
  a.id = "moreInfoBtn";
  a.href = "info.html";
  a.textContent = "معلومات أكثر";
  document.body.appendChild(a);
})();
