import type { Job, JobExtractor, JobUrl, JobUrlExtractor } from "./type.js";
import puppeteer, { Page, TimeoutError } from "puppeteer";
import path from "path";

export abstract class BrowserJobExtractor implements JobExtractor {
  async extractJobDetail(url: JobUrl): Promise<Job[]> {
    const browser = await puppeteer.launch({
      headless: true,
      userDataDir: "/Users/yuksehyun/Library/Application Support/Google/Chrome for Testing",
      args: [
        "--lang=ko-KR", // 브라우저 기본 로케
      ],
    });
    const page = await browser.newPage();

    page.setExtraHTTPHeaders({
      "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "sec-ch-ua": '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      cookie:
        "_ga=GA1.1.1079233133.1761109746; XSRF-TOKEN=3a1bd3ac-4756-4e81-9c5a-d64839db1d9e; NGRT-TID8=0C33ABD9F34C5F39584F3BB1F1F77218; NGRT-TID2=823F8067D3F40EFE193C31FC1D41D8DE; NGRT-TID1=67DB1E9D6F9119FED29C471CC70C429C; NGRT-TID4=4918A619236C4B8D55BF3D793DCBD2F0; NGRT-TID6=FD8FA5273B14B9205F2378CD55CF09F3; NGRT-TID7=0EDC44CEF5FFD51D538CAC154DD656ED; egovLatestServerTime=1761287940697; egovExpireSessionTime=1761323940697; _ga_V80K13HMHF=GS2.1.s1761286841$o3$g1$t1761287940$j60$l0$h0; _ga_ZCRKYPWLZM=GS2.1.s1761286842$o3$g1$t1761287941$j59$l0$h0",
    });

    await page.goto(url.url, { waitUntil: "domcontentloaded" });

    await page.addScriptTag({ path: path.resolve("./src/shared/utils/script.js") });

    let jobs: Job[] = [];
    try {
      jobs = await this.extractJobDetailWithPage(url, page);
    } catch (error) {
      if (error instanceof TimeoutError) {
        console.error(
          `TimeoutError: Failed to extract job detail from ${url} within the specified time.`,
        );
      } else {
        if (error instanceof Error)
          console.error(`Error extracting job detail from ${url}:`, error.message);
      }
    } finally {
      await page.close();
      await browser.close();
    }
    const favicon = await this.extractJobFavicon();
    jobs.forEach((job) => {
      job.favicon = favicon;
    });
    return jobs;
  }

  protected abstract extractJobDetailWithPage(url: JobUrl, page: Page): Promise<Job[]>;

  async extractJobFavicon(): Promise<string | null> {
    return null;
  }
}

export abstract class BrowserUrlExtractor implements JobUrlExtractor {
  private domain: string = "";

  constructor(domain: string) {
    this.domain = domain;
  }

  getDomain(): string {
    return this.domain;
  }
  async extractJobUrls(): Promise<JobUrl[]> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let jobUrls: JobUrl[] = [];
    try {
      jobUrls = await this.extractJobUrlsWithPage(page);
    } catch (error) {
      if (error instanceof TimeoutError) {
        console.error(`TimeoutError: Failed to extract job URLs within the specified time.`);
      } else {
        console.error(`Error extracting job URLs:`, error);
      }
    } finally {
      await page.close();
      await browser.close();
    }
    return jobUrls;
  }
  protected abstract extractJobUrlsWithPage(page: Page): Promise<JobUrl[]>;
}

export abstract class ApiUrlExtractor implements JobUrlExtractor {
  private domain: string = "";

  constructor(domain: string) {
    this.domain = domain;
  }

  getDomain(): string {
    return this.domain;
  }
  async extractJobUrls(): Promise<JobUrl[]> {
    const jobUrls = await this.extractJobUrlsFromApi();
    console.log(`Extracted ${jobUrls.length} job URLs from ${this.domain}`);
    return jobUrls;
  }
  protected abstract extractJobUrlsFromApi(): Promise<JobUrl[]>;
}
