import type { Page } from "puppeteer";
import { BrowserUrlExtractor } from "../../shared/extractor.js";
import type { JobUrlExtractor, JobUrl } from "../../shared/type.js";
import { autoScroll } from "../../shared/utils/page.js";

class LineJobUrlExtractor extends BrowserUrlExtractor {
  constructor() {
    super("careers.linecorp.com");
  }

  async extractJobUrlsWithPage(page: Page): Promise<JobUrl[]> {
    await page.goto("https://careers.linecorp.com/jobs", { waitUntil: "domcontentloaded" });

    await autoScroll(page, 10);

    const selector = "a[href^='/jobs/']";

    await page.waitForSelector(selector);

    const urls = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href^='/jobs/']")).map(
        (a) => (a as HTMLAnchorElement).href,
      ),
    );

    const results: JobUrl[] = urls.map((url: string) => ({
      url,
    }));
    return results;
  }
}

const lineJoBUrlExtractor = new LineJobUrlExtractor();
export default lineJoBUrlExtractor;
