// base.js — كل الثابتات (غير الصوت و 11:11)
(() => {
  const CFG = {
    files: { bgVideo: "bg.mp4.mp4", avatar: "avatar.jpg" },
    profile: { name: "MUSAWI", subtitle: "طالب GEOLOGY — جامعة البصرة", noteTitle: "كلمة" },
    social: [
      { label:"Telegram", url:"https://t.me/Mu29_iq", icon:"telegram" },
      { label:"Instagram", url:"https://www.instagram.com/mu29__/", icon:"instagram" }
    ],
    youtube: { title:"صورة موسيقى", embed:"https://www.youtube.com/embed/BXChU6bMEXU" },
    note: { sheetCsvUrl:"https://docs.google.com/spreadsheets/d/e/2PACX-1vSXkdu2p1KVIjDPGdb97HfmkKa2WuvKN349Z5qdZOd_RTCyT__xNLL44swa0EUAnq614hxS9p52NSlL/pub?gid=0&single=true&output=csv" },
    footerAyah: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    basra: { lat: 30.5085, lon: 47.7804 }
  };

  // expose for other files
  window.APP = window.APP || {};
  window.APP.base = CFG;

  // BG
  const bgSource = document.getElementById("bgSource");
  const bgVideo  = document.getElementById("bgVideo");
  if(bgSource && bgVideo){
    bgSource.src = CFG.files.bgVideo;
    bgVideo.load();
  }

  // Profile
  const avatar=document.getElementById("avatar");
  const nameEl=document.getElementById("name");
  const subtitle=document.getElementById("subtitle");
  const noteTitle=document.getElementById("noteTitle");
  const footerAyah=document.getElementById("footerAyah");
  if(avatar) avatar.src = CFG.files.avatar;
  if(nameEl) nameEl.textContent = CFG.profile.name;
  if(subtitle) subtitle.textContent = CFG.profile.subtitle;
  if(noteTitle) noteTitle.textContent = CFG.profile.noteTitle;
  if(footerAyah) footerAyah.textContent = CFG.footerAyah;

  // YouTube
  const ytTitle=document.getElementById("ytTitle");
  const ytFrame=document.getElementById("ytFrame");
  if(ytTitle) ytTitle.textContent = CFG.youtube.title;
  if(ytFrame) ytFrame.src = CFG.youtube.embed;

  // Social
  const socialRow=document.getElementById("socialRow");
  const ICON = {
    telegram:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.8 4.3c.3-1.2-.9-2-2-1.6L3.7 8.9c-1.1.4-1.1 2 .1 2.3l4.1 1.2 1.6 5c.3 1 1.6 1.3 2.4.6l2.3-2.1 4 3c.9.7 2.2.2 2.5-.9L21.8 4.3Z" fill="currentColor" opacity=".95"/></svg>`,
    instagram:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Z" stroke="currentColor" stroke-width="2" opacity=".95"/><path d="M12 16.1A4.1 4.1 0 1 0 12 8a4.1 4.1 0 0 0 0 8.1Z" stroke="currentColor" stroke-width="2"/></svg>`
  };
  if(socialRow){
    socialRow.innerHTML="";
    CFG.social.forEach(s=>{
      const a=document.createElement("a");
      a.className="socLink";
      a.href=s.url; a.target="_blank"; a.rel="noopener";
      a.innerHTML=`<span class="socLeft"><span class="socIco">${ICON[s.icon]||""}</span>${s.label}</span><span>↗</span>`;
      socialRow.appendChild(a);
    });
  }

  // Note from Sheet (B1)
  const quoteEl=document.getElementById("mainQuote");
  if(quoteEl && CFG.note.sheetCsvUrl){
    fetch(CFG.note.sheetCsvUrl,{cache:"no-store"})
      .then(r=>r.text())
      .then(t=>{
        t=t.replace(/^\uFEFF/,"");
        const i=t.indexOf(",");
        if(i===-1) return;
        const v=t.slice(i+1).trim().replace(/^"|"$/g,"");
        if(v) quoteEl.textContent=v;
      })
      .catch(()=>{});
  }

  // Theme
  const themeBtn=document.getElementById("toggleTheme");
  const saved = localStorage.getItem("themeMode");
  if(saved==="light") document.body.classList.add("light");
  if(themeBtn){
    themeBtn.addEventListener("click", ()=>{
      document.body.classList.toggle("light");
      localStorage.setItem("themeMode", document.body.classList.contains("light") ? "light" : "dark");
    });
  }

  // Clock & Date
  const timeNow=document.getElementById("timeNow");
  const dateTxt=document.getElementById("dateTxt");
  function iraqHHMM(){
    return new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Baghdad",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date());
  }
  function iraqDate(){
    return new Intl.DateTimeFormat("ar-IQ",{timeZone:"Asia/Baghdad",weekday:"long",day:"2-digit",month:"long",year:"numeric"}).format(new Date());
  }
  function tick(){
    if(timeNow) timeNow.textContent = iraqHHMM();
    if(dateTxt) dateTxt.textContent = iraqDate();
  }
  tick();
  setInterval(tick, 1000);

  // Weather Basra
  const wxTxt=document.getElementById("wxTxt");
  async function fetchWeather(){
    if(!wxTxt) return;
    try{
      const {lat,lon}=CFG.basra;
      const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=Asia%2FBaghdad`;
      const r=await fetch(url,{cache:"no-store"});
      const d=await r.json();
      wxTxt.textContent=`البصرة: ${Math.round(d.current.temperature_2m)}°`;
    }catch{
      wxTxt.textContent="طقس البصرة غير متاح";
    }
  }
  fetchWeather();
  setInterval(fetchWeather, 10*60*1000);

  // Footer Year
  const y=document.getElementById("y");
  if(y) y.textContent = new Date().getFullYear();
})();
