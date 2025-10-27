import { BrowserJobExtractor } from "../../shared/extractor.js";
import type { JobExtractor, Job, JobUrl, JobPropertyExtractor } from "../../shared/type.js";
import {
  safeGetText,
  getContentBetweenTitles,
  rawJobTypeTextToEnum,
  rawRequireExperienceTextToEnum,
  extractTeamEntities,
  getContentByText,
  getTextsFromTitledBox,
} from "../../shared/utils/browser-util.js";
import { Page } from "puppeteer";

class TossJobExtractor extends BrowserJobExtractor {
  constructor() {
    super("toss.im");
  }
  async extractJobDetailWithPage(url: JobUrl, page: Page): Promise<Job[]> {
    await page.waitForSelector("span[class^='css-nkt64x']", { timeout: 2000 });

    const job = await page.evaluate(() => {
      const win = window as any;
      const title = win.safeGetText("span[class^='css-nkt64x']");
      const rawJobsText = win
        .safeGetText("div[class^='css-1urdq9i']")
        .replace(/\n{2,}/g, "\n")
        .trim();
      const departmentDescription = win.getContentByTitle(
        "p[class^='css-92x98k']",
        "합류하게 될 팀에 대해 알려드려요",
      );
      const department = win.extractTeamEntities(departmentDescription)[0] || null;
      const checkBeforeApply = win.getContentByTitle(
        "p[class^='css-92x98k']",
        "지원 전 꼭 확인해주세요!",
      );
      const jobDescription =
        win.getContentByTitle("p[class^='css-92x98k']", "합류하면 함께 할 업무에요") +
        departmentDescription;
      const requirements = win.getContentByTitle(
        "p[class^='css-92x98k']",
        "이런 분과 함께하고 싶어요",
      );
      const texts = win.safeGetChildsText("div[class^='css-1kbe2mo eh5ls9o0']");
      const company = texts[0];
      const jobType = win.rawJobTypeTextToEnum(texts[1]);
      const requireExperience = win.rawRequireExperienceTextToEnum(checkBeforeApply);

      // --- 최종 반환 객체 ---
      return {
        id: "0",
        title: company + " " + title,
        rawJobsText: rawJobsText,
        company: company,
        requireExperience: requireExperience,
        jobType: jobType,
        regionText: null,
        requirements: requirements,
        department: department,
        jobDescription: jobDescription,
        idealCandidate: null,
        preferredQualifications: null,
        applyStartDate: null,
        applyEndDate: null,
        url: window.location.href,
        favicon: null,
      };
    });

    return [job];
  }
}

const tossJobExtractor = new TossJobExtractor();
export default tossJobExtractor;
