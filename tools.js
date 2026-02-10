function test1111Now() {
  const t0 = Date.now();

  (function waitForTest(){
    if (typeof window.TEST_1111 === "function") {
      window.TEST_1111();
      return;
    }
    if (Date.now() - t0 > 2500) {
      alert("ملف 11:11 غير مربوط أو ماكو TEST_1111.\nتأكد تضيف event1111.js بالـ index.html");
      return;
    }
    setTimeout(waitForTest, 80);
  })();
}
