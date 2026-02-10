<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MUSAWI — معلومات</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800;900&display=swap" rel="stylesheet">

  <style>
    :root{
      --bg:#0b1220;
      --card: rgba(255,255,255,.10);
      --border: rgba(255,255,255,.18);
      --text: #eef2ff;
      --muted:#d1d5db;
      --shadow: 0 18px 40px rgba(0,0,0,.38);
      --glass: rgba(255,255,255,.07);
    }
    body.light{
      --bg:#f4f6ff;
      --card: rgba(0,0,0,.06);
      --border: rgba(0,0,0,.12);
      --text:#0b1220;
      --muted:#334155;
      --shadow: 0 18px 40px rgba(0,0,0,.12);
      --glass: rgba(255,255,255,.62);
    }
    *{ box-sizing:border-box; }
    body{
      margin:0;
      font-family:"Cairo", system-ui, Arial;
      background: var(--bg);
      color: var(--text);
      padding: 16px 14px 22px;
    }
    .wrap{ width:min(980px,100%); margin:0 auto; }
    .topbar{
      display:flex; align-items:center; justify-content:space-between; gap:10px;
      padding: 12px 14px;
      border-radius: 18px;
      border: 1px solid var(--border);
      background: var(--glass);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 24px rgba(0,0,0,.14);
      margin-bottom: 14px;
    }
    .title{ margin:0; font-weight:900; font-size:18px; }
    .btn{
      text-decoration:none;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.10);
      color: rgba(255,255,255,.92);
      padding: 10px 12px;
      border-radius: 14px;
      font-weight: 900;
      white-space:nowrap;
    }
    body.light .btn{
      border-color: rgba(0,0,0,.10);
      background: rgba(0,0,0,.04);
      color: rgba(10,16,28,.86);
    }
    .grid{ display:grid; gap:14px; }
    .card{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 16px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(10px);
    }
    .muted{ color: var(--muted); font-weight:900; font-size:13px; }
  </style>
</head>

<body>
  <div class="wrap">
    <div class="topbar">
      <h1 class="title">معلومات أكثر</h1>
      <a class="btn" href="index.html">رجوع</a>
    </div>

    <div class="grid">
      <section class="card">
        <h2 style="margin:0 0 8px;font-weight:900;font-size:16px;">طقس الأسبوع</h2>
        <p class="muted" id="wxWeek">... تحميل</p>
      </section>

      <section class="card">
        <h2 style="margin:0 0 8px;font-weight:900;font-size:16px;">الشروق والغروب + الصلاة (جعفري)</h2>
        <p class="muted" id="pray">... تحميل</p>
      </section>

      <section class="card">
        <h2 style="margin:0 0 8px;font-weight:900;font-size:16px;">في مثل هذا اليوم</h2>
        <p class="muted" id="otd">... تحميل</p>
      </section>

      <section class="card">
        <h2 style="margin:0 0 8px;font-weight:900;font-size:16px;">دعاء اليوم</h2>
        <p class="muted" id="dua">... تحميل</p>
      </section>

      <a class="btn" id="toggleTheme" href="#" style="text-align:center">تشغيل/إطفاء الوضع</a>
    </div>
  </div>

  <script src="info-page.js"></script>
</body>
</html>
// tools.js (disabled)
// هذا الملف تم تعطيله لأن admin-tools.js صار المسؤول عن الأزرار واللوحة
