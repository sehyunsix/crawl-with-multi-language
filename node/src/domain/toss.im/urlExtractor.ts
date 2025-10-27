import { BrowserUrlExtractor } from "../../shared/extractor.js";
import type { JobUrlExtractor, JobUrl } from "../../shared/type.js";
import { Page } from "puppeteer";

class TossJobUrlExtractor extends BrowserUrlExtractor {
  constructor() {
    super("toss.im");
  }

  async extractJobUrlsWithPage(page: Page): Promise<JobUrl[]> {
    await page.goto("https://toss.im/career/jobs", { waitUntil: "domcontentloaded" });

    const selector = "a[href^='/career/job']";

    await page.waitForSelector(selector);

    const urls = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href^='/career/job']")).map(
        (a) => (a as HTMLAnchorElement).href,
      ),
    );

    const results: JobUrl[] = urls.map((url: string) => ({
      url,
    }));

    return results;
  }
}

const tossJoBUrlExtractor = new TossJobUrlExtractor();
export default tossJoBUrlExtractor;
