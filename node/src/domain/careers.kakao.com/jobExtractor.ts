import { ApiJobExtractor, BaseJobPropertyExtractor } from "../../shared/extractor.js";
import type { Job, JobUrl, JobPropertyExtractor } from "../../shared/type.js";

function getJobListWithPage(page: number): Promise<any> {
  const apiUrl =
    "https://careers.kakao.com/public/api/job-list?skillSet=&part=TECHNOLOGY&company=KAKAO&keyword=&employeeType=&page=" +
    page;

  return fetch(apiUrl).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch job list from ${apiUrl}: ${response.statusText}`);
    }
    return response.json();
  });
}
class KakaoJobExtractor extends ApiJobExtractor {
  constructor() {
    super("careers.kakao.com");
  }

  private rawJobList = [];

  async fetchJobList() {
    let response;
    let page = 1;
    while (true) {
      response = await getJobListWithPage(page);
      if (response.jobList.length === 0 || !response) {
        break;
      }
      this.rawJobList = this.rawJobList.concat(response.jobList);
      page++;
    }
  }

  protected async extractJobDetailFromApi(url: JobUrl): Promise<Job[]> {
    const jobIdMatch = url.url.match(/jobs\/([A-Za-z0-9-]+)/);
    console.log("jobIdMatch", jobIdMatch);
    let data: any = null;

    for (const job of this.rawJobList) {
      if ((job as any).realId === jobIdMatch?.[1]) {
        data = job;
        break;
      }
    }
    if (!data) {
      throw new Error(`Job data not found for URL: ${url.url}`);
    }
    class kakaoJobPropertyExtractor extends BaseJobPropertyExtractor {
      getTitle(): string {
        return data.jobOfferTitle;
      }
      getCompanyName(): string {
        return data.companyName;
      }
      getRawJobsText(): string {
        const rawText = `${data.introdcution}\n${data.workContentDesc}\n${data.qualification}`;
        return rawText;
      }

      getJobDescription(): string {
        return data.workContentDesc;
      }

      getRequirements(): string {
        return data.qualification;
      }
    }
    const extractor = new kakaoJobPropertyExtractor();
    return [
      {
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
      },
    ];
  }
}

const kakaoJobExtractor = new KakaoJobExtractor();
await kakaoJobExtractor.fetchJobList();
export default kakaoJobExtractor;
