import types = require("puppeteer");

    async function autoScroll(page : types.Page , count : number =  10) {
   // [수정 1] evaluate에 전달되는 함수를 'async'로 만듭니다.
    await page.evaluate(async (scrollCount) => {
        const distance = 1000;

        // [수정 2] Promise를 반환하는 delay 헬퍼 함수를 만듭니다.
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 0; i < scrollCount; i++) {
            window.scrollBy(0, distance);

            await delay(200); 
        }
    }, count); 
    
    }


module.exports = autoScroll;