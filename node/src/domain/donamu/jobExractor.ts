import type { Job, JobPropertyExtractor, JobUrl } from "../../shared/type.js";
import { BrowserJobExtractor } from "../../shared/extractor.js";
import {
  safeGetText,
  getContentAfterTitle,
  rawJobTypeTextToEnum,
  rawRequireExperienceTextToEnum,
  extractTeamEntities,
  getContentByText,
} from "../../shared/utils/browser-util.js";
import { Page, TimeoutError } from "puppeteer";

class DunamuJobExtractor extends BrowserJobExtractor {
  async extractJobDetailWithPage(url: JobUrl, page: Page): Promise<Job[]> {
    await page.waitForSelector(".board_tit > p", { timeout: 2000 });
    let job = await page.evaluate((): Job => {
      const extractor: JobPropertyExtractor = {
        getTitle(): string {
          return safeGetText(".board_tit > p");
        },

        getCompanyName(): string {
          return "두나무";
        },

        getRawJobsText(): string {
          return safeGetText(".board_txt")
            .replace(/\n{2,}/g, "\n")
            .trim();
        },
        getDepartment() {
          const departmentDescription = getContentAfterTitle(".article.top", "조직 소개");
          return extractTeamEntities(departmentDescription)[0] || null;
        },

        getJobDescription() {
          return getContentAfterTitle(".article.top", "주요업무");
        },

        getJobType() {
          return rawJobTypeTextToEnum(getContentByText("li", "고용형태"));
        },

        getRequireExperience() {
          return rawRequireExperienceTextToEnum(getContentByText("li", "채용유형"));
        },

        getRegionText() {
          const regionText = getContentByText("li", "근무지역").split(":")[1];
          return regionText || null;
        },

        getPreferredQualifications() {
          return getContentAfterTitle(".article.top", "우대사항");
        },

        getRequirements() {
          return null;
        },

        getApplyEndDate() {
          return null;
        },

        getApplyStartDate() {
          return null;
        },
      };

      return {
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
        url: window.location.href,
      };
    });
    return [job];
  }
}
export default new DunamuJobExtractor();
