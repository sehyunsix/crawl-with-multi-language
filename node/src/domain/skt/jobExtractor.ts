import { BrowserJobExtractor } from "../../shared/extractor.js";
import type { Job, JobUrl, JobPropertyExtractor } from "../../shared/type.js";
import {
  safeGetText,
  rawJobTypeTextToEnum,
  rawRequireExperienceTextToEnum,
  extractTeamEntities,
  getTextsFromTitledBox,
  splitAndFormatDateRange,
} from "../../shared/utils/browser-util.js";
import { Page } from "puppeteer";
class SktJobExtractor extends BrowserJobExtractor {
  async extractJobDetailWithPage(url: JobUrl, page: Page): Promise<Job[]> {
    await page.waitForSelector(".item-column", { timeout: 2000 });

    let job = await page.evaluate((): Job => {
      const extractor: JobPropertyExtractor = {
        getTitle(): string {
          return safeGetText(".box-title");
        },

        getCompanyName(): string {
          const rawText = getTextsFromTitledBox(".box-detail-item", ".label", /(회사)/);
          return rawText || "SKT";
        },

        getRawJobsText(): string {
          return safeGetText(".detail-content-wrapper")
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
          const departmentDescription = getTextsFromTitledBox(
            ".detail-content-box",
            ".item-label",
            /(조직 소개|조직소개|부서소개|부서 소개|Who We Are|조직)/,
          );

          const jobDescription = getTextsFromTitledBox(
            ".detail-content-box",
            ".item-label",
            /(수행직무)/,
          );
          return departmentDescription + "\n" + jobDescription;
        },

        getRequirements() {
          return getTextsFromTitledBox(
            ".detail-content-box",
            ".item-label",
            /(자격 요건|자격요건|Required Skills|필요역량 및 경험)/,
          );
        },

        getPreferredQualifications() {
          return null;
        },

        getJobType() {
          const rawText = getTextsFromTitledBox(".box-detail-item", ".label", /(유형)/);
          return rawJobTypeTextToEnum(rawText || "");
        },

        getRequireExperience() {
          const rawText = getTextsFromTitledBox(".box-detail-item", ".label", /(구분)/);
          return rawRequireExperienceTextToEnum(rawText || "");
        },

        getRegionText() {
          const rawText = getTextsFromTitledBox(".box-detail-item", ".label", /(지역)/);
          return rawText || null;
        },

        getApplyEndDate() {
          const rawText = getTextsFromTitledBox(".box-detail-item", ".label", /(지원 기간)/);
          const endDate = splitAndFormatDateRange(rawText || "")[1] || null;
          return endDate;
        },

        getApplyStartDate() {
          const rawText = getTextsFromTitledBox(".box-detail-item", ".label", /(지원 기간)/);
          const startDate = splitAndFormatDateRange(rawText || "")[0] || null;
          return startDate;
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
const sktJobExtractor = new SktJobExtractor();
export default sktJobExtractor;
