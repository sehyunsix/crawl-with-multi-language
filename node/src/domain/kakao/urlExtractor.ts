import type { JobUrlExtractor , JobUrl } from "../../shared/base.js";

async function  getJobUrlsFromKakaoApiWithPage(page :number): Promise<JobUrl[]> {
    const response = await fetch(`https://careers.kakao.com/public/api/job-list?skillSet=&part=TECHNOLOGY&company=KAKAO&keyword=&employeeType=&page=${page}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "\"Android\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": "https://careers.kakao.com/jobs?skillSet=&page=1&company=KAKAO&part=TECHNOLOGY&employeeType=&keyword=",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }

    )
    const data = await response.json();
        // console.log("response data:", data);
        
    const jobUrls : JobUrl[]   =  data.jobList.map( (job: any) => ( {
            url: `https://careers.kakao.com/jobs/${job.realId}`,
            createdAt: new Date().toISOString()
    } ) );
    return jobUrls;
}

class KakaoJobUrlExtractor implements JobUrlExtractor {

    private domain : string  = "careers.kakao.com";
    
    public getDomain(): string {
        return this.domain;
    }

    async extractJobUrls(): Promise<JobUrl[] | null> {        
        const first = await getJobUrlsFromKakaoApiWithPage(1);
        const second = await getJobUrlsFromKakaoApiWithPage(2);
        const jobUrls = first.concat(second);
        return jobUrls;
    }
}


const kakaoUrlExtractor = new KakaoJobUrlExtractor();
module.exports = kakaoUrlExtractor;

if (module === require.main) {
    (async () => {
        const urls = await kakaoUrlExtractor.extractJobUrls();
        console.log(urls);
    })();
}





