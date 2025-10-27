import { BrowserJobExtractor } from "../../shared/extractor.js";
import type { Job, JobUrl, JobPropertyExtractor } from "../../shared/type.js";
import {
  safeGetText,
  rawJobTypeTextToEnum,
  rawRequireExperienceTextToEnum,
  extractTeamEntities,
  getTextsFromTitledBox,
  splitAndFormatDateRange,
  getContentAfterTitleAtMarkdownStyle,
} from "../../shared/utils/browser-util.js";
import { Page } from "puppeteer";
class LineJobExtractor extends BrowserJobExtractor {
  constructor() {
    super("line.plus");
  }
  async extractJobDetailWithPage(url: JobUrl, page: Page): Promise<Job[]> {
    await page.waitForSelector("h3", { timeout: 2000 });

    let job = await page.evaluate((): Job => {
      const extractor: JobPropertyExtractor = {
        getTitle(): string {
          return safeGetText("h3.title");
        },

        getCompanyName(): string {
          const rawText = getTextsFromTitledBox(".box-detail-item", ".label", /(회사)/);
          return rawText || "Line Plus";
        },

        getRawJobsText(): string {
          return safeGetText(".content_inner")
            .replace(/\n{2,}/g, "\n")
            .trim();
        },
        getDepartment() {
          const departmentDescription = getTextsFromTitledBox(
            ".detail-content-box",
            ".item-label",
            /(수행직무)/,
          );

          return extractTeamEntities(departmentDescription || " ")[0] || null;
        },

        getJobDescription() {
          const description = getContentAfterTitleAtMarkdownStyle("h3", /(담당업무)/);
          if (!description) {
            throw new Error("Description format missing");
          }
          return description;
        },

        getRequirements() {
          const requirements = getContentAfterTitleAtMarkdownStyle("h3", /(자격요건)/);
          if (!requirements) {
            throw new Error("Requirements format missing");
          }
          return requirements;
        },

        getPreferredQualifications() {
          const preferredQualifications = getContentAfterTitleAtMarkdownStyle("h3", /(우대사항)/);
          if (!preferredQualifications) {
            throw new Error("PreferredQualifications format missing");
          }
          return preferredQualifications;
        },

        getJobType() {
          return rawJobTypeTextToEnum("");
        },

        getRequireExperience() {
          return rawRequireExperienceTextToEnum("");
        },

        getRegionText() {
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
const lineJobExtractor = new LineJobExtractor();
export default lineJobExtractor;
