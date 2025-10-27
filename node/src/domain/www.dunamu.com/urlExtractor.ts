import type { JobUrlExtractor, JobUrl } from "../../shared/type.js";
import { BrowserUrlExtractor } from "../../shared/extractor.js";
import puppeteer from "puppeteer";
import { Page } from "puppeteer";

class DonamuJobUrlExtractor extends BrowserUrlExtractor {
  constructor() {
    super("www.donamu.com");
  }

  async extractJobUrlsWithPage(page: Page): Promise<JobUrl[]> {
    await page.goto("https://www.dunamu.com/careers/jobs?category=engineering", {
      waitUntil: "domcontentloaded",
    });

    const selector = "a[href^='/careers/jobs']";

    await page.waitForSelector(selector);

    const urls = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href^='/careers/jobs']")).map(
        (a) => (a as HTMLAnchorElement).href,
      ),
    );
    const results: JobUrl[] = urls.map((url: string) => ({
      url,
      createdAt: new Date().toISOString(),
    }));
    return results;
  }
}

const donamuJoBUrlExtractor = new DonamuJobUrlExtractor();
export default donamuJoBUrlExtractor;
