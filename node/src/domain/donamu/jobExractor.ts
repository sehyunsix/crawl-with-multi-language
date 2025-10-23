import type { JobExtractor, Job, JobUrl } from "../../shared/base.js";
import {
  safeGetText,
  getContentAfterTitle,
  rawJobTypeTextToEnum,
  rawRequireExperienceTextToEnum,
  extractTeamEntities,
  getContentByText,
} from "../../shared/utils/browser-util.js";
import { fileURLToPath } from "url";
import path from "path";
import puppeteer, { TimeoutError } from "puppeteer";

class DunamuJobExtractor implements JobExtractor {
  async extractJobDetail(source: JobUrl): Promise<Job[] | null> {
    const url = source.url;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.addScriptTag({ path: path.resolve("./src/shared/utils/script.js") });
      await page.waitForSelector(".board_tit > p", { timeout: 2000 });
      const job = await page.evaluate((): Job => {
        const title = safeGetText(".board_tit > p");
        const rawJobsText = safeGetText(".board_txt")
          .replace(/\n{2,}/g, "\n")
          .trim();
        const departmentDescription = getContentAfterTitle(".article.top", "조직 소개");
        const department = extractTeamEntities(departmentDescription)[0] || null;
        const jobDescription = getContentAfterTitle(".article.top", "주요업무");
        const requirements = getContentAfterTitle(".article.top", "자격요건");
        const preferredQualifications = getContentAfterTitle(".article.top", "우대사항");
        const company = "두나무";
        const regionText = getContentByText("li", "근무지역").split(":")[1];
        const jobType = rawJobTypeTextToEnum(getContentByText("li", "고용형태"));
        const requireExperience = rawRequireExperienceTextToEnum(
          getContentByText("li", "채용유형"),
        );
        return {
          id: "0",
          title: company + " " + title,
          rawJobsText: rawJobsText,
          company: company,
          requireExperience: requireExperience,
          jobType: jobType,
          regionText: regionText || null,
          requirements: requirements,
          department: department || null,
          jobDescription: jobDescription,
          favicon: null,
          idealCandidate: null,
          preferredQualifications: preferredQualifications,
          applyStartDate: null,
          applyEndDate: null,
          url: window.location.href,
        };
      });
      return [job];
    } catch (error) {
      if (error instanceof TimeoutError) {
        console.error(`TimeoutError: Failed to extract job details from ${url}`);
      } else {
        console.error(`Error: Failed to extract job details from ${url}:`, error);
      }
      return [];
    } finally {
      await page.close();
      await browser.close();
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.argv[1] === __filename) {
  (async () => {
    const extractor = new DunamuJobExtractor();
    const testUrl: JobUrl = {
      url: "https://www.dunamu.com/careers/jobs/1521",
    };
    const jobs = await extractor.extractJobDetail(testUrl);
    console.log(jobs);
  })();
}

export default new DunamuJobExtractor();
