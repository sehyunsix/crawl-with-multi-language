import type { JobUrlExtractor, JobUrl } from "../../shared/type.js";

class KtJobUrlExractor implements JobUrlExtractor {
  private domain: string = "kt.recruiter.co.kr";

  public getDomain(): string {
    return this.domain;
  }

  async extractJobUrls(): Promise<JobUrl[] | null> {
    const responese = await fetch("https://api-recruiter.recruiter.co.kr/position/v1/jobflex", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        prefix: "kt.recruiter.co.kr",
        priority: "u=1, i",
        "sec-ch-ua": '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        cookie:
          "_ga_CQZEJCRL96=GS2.1.s1758477402$o3$g0$t1758477402$j60$l0$h0; _ga_HCRNGQLH50=GS2.1.s1759542841$o1$g0$t1759542841$j60$l0$h0; _ga=GA1.3.1265182742.1758468802",
        Referer: "https://kt.recruiter.co.kr/",
      },
      body: '{"pageableRq":{"page":1,"size": 50,"sort":["CREATED_DATE_TIME"]},"filter":{"keyword":"","tagSnList":[],"jobGroupSnList":[],"careerTypeList":[],"regionSnList":[],"submissionStatusList":[],"openStatusList":[ "OPEN"],"resumeLanguageTypeList":[]}}',
      method: "POST",
    });
    const data = await responese.json();
    // console.log("response data:", data);

    const jobUrls: JobUrl[] = data.list.map((job: any) => ({
      url: `https://kt.recruiter.co.kr/career/jobs/${job.positionSn}`,
      createdAt: new Date().toISOString(),
    }));

    return jobUrls;
  }
}

const ktJobUrlExractor = new KtJobUrlExractor();
export default ktJobUrlExractor;
