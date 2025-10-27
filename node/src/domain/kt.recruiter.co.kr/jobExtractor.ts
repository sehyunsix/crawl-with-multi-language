import { BaseJobPropertyExtractor, BrowserJobExtractor } from "../../shared/extractor.js";
import type {
  Job,
  JobUrl,
  JobPropertyExtractor,
  JobType,
  RequireExperience,
} from "../../shared/type.js";
import { rawJobTypeTextToEnum } from "../../shared/utils/browser-util.js";
import { Page } from "puppeteer";
import { JSDOM } from "jsdom";
import jQuery from "jquery";

class KtJobExtractor extends BrowserJobExtractor {
  constructor() {
    super("kt.recruiter.co.kr");
  }
  protected async extractJobDetailWithPage(url: JobUrl, page: Page): Promise<Job[]> {
    const jobIdMatch = url.url.match(/jobs\/([A-Za-z0-9-]+)/);

    if (!jobIdMatch) {
      throw new Error(`Invalid job URL format: ${url.url}`);
    }
    await page.goto(url.url, { waitUntil: "networkidle2", timeout: 2000 });

    const data = await page.evaluate(async (jobId: string | undefined) => {
      const apiUrl = "https://api-recruiter.recruiter.co.kr/position/v2/jobflex/" + jobId;
      return await fetch(apiUrl, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          prefix: "kt.recruiter.co.kr",
          priority: "u=1, i",
          "sec-ch-ua": '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        referrer: "https://kt.recruiter.co.kr/",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`request failed with status ${response.status}`);
        }
        return response.json();
      });
    }, jobIdMatch[1]);

    if (!data) {
      throw new Error(`Job data not found for URL: ${url.url}`);
    }

    const html = data.jobDescription as string;
    const dom = new JSDOM(html);
    const $ = jQuery(dom.window) as unknown as JQueryStatic;
    class kakaoJobPropertyExtractor extends BaseJobPropertyExtractor {
      getTitle(): string {
        if (data.title === undefined || data.title === null) {
          throw new Error(`Job title not found for URL: ${url.url}`);
        }
        return data.title;
      }
      getCompanyName(): string {
        return "kt";
      }
      getRawJobsText(): string {
        const titleRegex = /담당 업무/;
        const rawText = $("section[data-section-name='자격 요건 및 기타'] ")
          .filter(function (this: HTMLElement) {
            return titleRegex.test($(this).text().trim());
          })
          .text()
          .trim();
        return rawText;
      }

      getJobDescription(): string {
        const titleRegex = /담당 업무/;
        const jobDescription = $("section[data-section-name='자격 요건 및 기타'] > div")
          .filter(function (this: HTMLElement) {
            return titleRegex.test($(this).text().trim());
          })
          .text()
          .replace("담당 업무", "")
          .trim();

        const imgUrls = $("img")
          .map(function (this: HTMLElement) {
            return $(this).attr("src");
          })
          .get();

        const imgUrl = imgUrls.at(-1);
        return jobDescription || imgUrl || "없음";
      }

      getRequirements(): string | null {
        const titleRegex = /필수요건/;
        const qualification = $("section[data-section-name='자격 요건 및 기타'] > div")
          .filter(function (this: HTMLElement) {
            return titleRegex.test($(this).text().trim());
          })
          .text()
          .replace("필수요건", "")
          .trim();
        return qualification || null;
      }

      getPreferredQualifications(): string | null {
        const titleRegex = /우대사항/;
        const preferredQualifications = $("section[data-section-name='자격 요건 및 기타'] > div")
          .filter(function (this: HTMLElement) {
            return titleRegex.test($(this).text().trim());
          })
          .text()
          .replace("우대사항", "")
          .trim();
        return preferredQualifications || null;
      }

      getApplyStartDate(): string | null {
        return data.startDateTime.split("T")[0] || null;
      }

      getApplyEndDate(): string | null {
        return data.endDateTime.split("T")[0] || null;
      }

      getJobType(): JobType {
        return "정규직";
      }

      getRequireExperience(): RequireExperience {
        if (data.classficationCode === "신입") {
          return "신입";
        } else {
          return "경력";
        }
      }
    }
    const extractor = new kakaoJobPropertyExtractor();
    const job = {
      id: "0",
      title: extractor.getTitle(),
      rawJobsText: extractor.getRawJobsText(),
      company: extractor.getCompanyName(),
      requireExperience: extractor.getRequireExperience(),
      jobType: extractor.getJobType(),
      regionText: extractor.getRegionText(),
      requirements: extractor.getRequirements(),
      department: extractor.getDepartment(),
      jobDescription: extractor.getJobDescription(),
      preferredQualifications: extractor.getPreferredQualifications(),
      applyStartDate: extractor.getApplyStartDate(),
      applyEndDate: extractor.getApplyEndDate(),
      idealCandidate: null,
      favicon: null,
      url: url.url,
    };
    console.log(job);
    return [job];
  }
}

const ktJobExtractor = new KtJobExtractor();
export default ktJobExtractor;
