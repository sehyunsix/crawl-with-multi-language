import types = require("puppeteer");

async function autoScroll(page : types.Page) {
    await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            let totalHeight = 0;
            const distance = 200; // 한 번에 스크롤할 거리
            let lastHeight = -1; // 이전 스크롤 높이를 저장

            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                // 이전 높이와 현재 높이가 같으면 (즉, 스크롤이 끝에 도달했으면)
                if (lastHeight === scrollHeight) {
                    clearInterval(timer);
                    resolve();
                } else {
                    lastHeight = scrollHeight;
                    window.scrollBy(0, distance); // 'distance' 만큼 아래로 스크롤
                    totalHeight += distance;
                }
            }, 200); // 0.2초마다 스크롤 시도 (사이트 로딩 속도에 따라 조절)
        });
    });
}


module.exports = autoScroll;