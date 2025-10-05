const puppeteer = require("puppeteer");

(async () => {
  // 1️⃣ 브라우저 실행 (headless: false -> 브라우저 창 표시)
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // 2️⃣ naver.com 접속
  await page.goto("https://www.naver.com", { waitUntil: "networkidle2" });

  // 3️⃣ 클릭 전 HTML 가져오기
  const htmlBefore = await page.content();
  console.log("클릭 전 HTML 길이:", htmlBefore.length);

  // 4️⃣ 모든 버튼 클릭
  await page.evaluate(() => {
    Array.from(document.querySelectorAll("button")).forEach(b => b.click());
  });

  // 5️⃣ 클릭 후 잠시 대기
  await page.waitForTimeout(2000);

  // 6️⃣ 클릭 후 HTML 가져오기
  const htmlAfter = await page.content();
  console.log("클릭 후 HTML 길이:", htmlAfter.length);

  // 7️⃣ 버튼 텍스트 가져오기
  const buttonTexts = await page.evaluate(() =>
    Array.from(document.querySelectorAll("button")).map(b => b.textContent)
  );

  // 특정 키워드 포함 버튼 필터링
  const keyword = "확인";
  const matchedButtons = buttonTexts.filter(text => text && text.includes(keyword));

  console.log("찾은 버튼들:", matchedButtons);

  await browser.close();
})();
