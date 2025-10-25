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
class NaverJobExtractor extends BrowserJobExtractor {
  async extractJobDetailWithPage(url: JobUrl, page: Page): Promise<Job[]> {
    await page.waitForSelector(".card_title", { timeout: 2000 });

    const response = await fetch(
      url.url.replace("view.do", "loadJobList.do") + "&recordCountPerPage=1",
      { method: "GET" },
    );

    const jobPreDetail = (await response.json()).list[0];
    let job = await page.evaluate((jobPreDetail: any): Job => {
      const datetime = (dateTimeString: string): string => {
        // console.log("dateTimeString", dateTimeString);
        const isoString = dateTimeString.replace(".", "-").replace(".", "-").replace(" ", "T");

        return new Date(isoString).toISOString();
      };
      const extractor: JobPropertyExtractor = {
        getTitle(): string {
          return safeGetText(".card_title");
        },

        getCompanyName(): string {
          return "네이버";
        },

        getRawJobsText(): string {
          return safeGetText(".detail_wrap")
            .replace(/\n{2,}/g, "\n")
            .trim();
        },
        getDepartment() {
          const departmentDescription = getTextsFromTitledBox(
            ".detail_box",
            ".detail_title",
            /(조직 소개|조직소개|부서소개|부서 소개|Who We Are|조직)/,
          );

          return extractTeamEntities(departmentDescription || " ")[0] || null;
        },

        getJobDescription() {
          const departmentDescription = getTextsFromTitledBox(
            ".detail_box",
            ".detail_title",
            /(조직 소개|조직소개|부서소개|부서 소개|Who We Are|조직)/,
          );

          const jobDescription = getTextsFromTitledBox(
            ".detail_box",
            ".detail_title",
            /(업무 내용|업무내용|What You'll Do|담당 업무)/,
          );
          return departmentDescription + "\n" + jobDescription;
        },

        getRequirements() {
          return getTextsFromTitledBox(
            ".detail_box",
            ".detail_title",
            /(자격 요건|자격요건|Required Skills|필요 역량)/,
          );
        },

        getPreferredQualifications() {
          return getTextsFromTitledBox(
            ".detail_box",
            ".detail_title",
            /(우대 사항|우대사항|Preferred Skills)/,
          );
        },

        getJobType() {
          return rawJobTypeTextToEnum(jobPreDetail.empTypeCdNm);
        },

        getRequireExperience() {
          return rawRequireExperienceTextToEnum(jobPreDetail.entTypeCdNm);
        },

        getRegionText() {
          return getContentByText("li", "근무지역").split(":")[1] || null;
        },

        getApplyEndDate() {
          return datetime(jobPreDetail.endYmdTime).slice(0, 19).replace("T", " ");
        },

        getApplyStartDate() {
          return datetime(jobPreDetail.staYmdTime).slice(0, 19).replace("T", " ");
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
    }, jobPreDetail);
    return [job];
  }
}
const naverJobExtractor = new NaverJobExtractor();
export default naverJobExtractor;
