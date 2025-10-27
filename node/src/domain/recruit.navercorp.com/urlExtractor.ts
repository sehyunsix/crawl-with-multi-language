import type { JobUrlExtractor, JobUrl } from "../../shared/type.js";
import { ApiUrlExtractor } from "../../shared/extractor.js";
class NaverJobUrlExractor extends ApiUrlExtractor {
  constructor() {
    super("recruit.navercorp.com");
  }

  // @override
  async extractJobUrlsFromApi(): Promise<JobUrl[]> {
    const responese = await fetch(
      `https://recruit.navercorp.com/rcrt/loadJobList.do?annoId=&sw=&subJobCdArr=&sysCompanyCdArr=&empTypeCdArr=&entTypeCdArr=&workAreaCdArr=&firstIndex=${0}&recordCountPerPage=${100}&locale=ko`,
      {
        method: "GET",
      },
    );
    console.log("responese", responese);
    let jobUrls = await responese.json().then((data) =>
      data.list.map((job: any) => ({
        url: job.jobDetailLink,
      })),
    );
    console.log("jobUrls before deduplication:", jobUrls);

    jobUrls = Array.from(new Map(jobUrls.map((job: any) => [job.url, job])).values());
    return jobUrls;
  }
}

const naverJobUrlExractor = new NaverJobUrlExractor();
export default naverJobUrlExractor;
