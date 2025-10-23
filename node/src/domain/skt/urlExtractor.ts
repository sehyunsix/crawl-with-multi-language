import type { JobUrlExtractor , JobUrl } from "../../shared/base.js";


class SktJobUrlExtractor implements JobUrlExtractor {

    private domain : string  = "www.skcareers.com";
    
    public getDomain(): string {
        return this.domain;
    }

    async extractJobUrls(): Promise<JobUrl[] | null> {        
        const responese =await fetch("https://www.skcareers.com/Recruit/GetRecruitList", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": "_ga=GA1.1.1440046652.1759246436; _culture=ko-KR; _ga_TDN9G4BW97=GS2.1.s1761125596$o7$g1$t1761125680$j37$l0$h0",
                "Referer": "https://www.skcareers.com/Recruit?recruitType=200001&corpCode=10005"
            },
            "body": "sort=2&searchText=&corpCode=10005&jobRole=0&recruitType=%5B%22200001%22%5D&workingType=&workingRegion=",
            "method": "POST"
        });
        const data = await responese.json();
        // console.log("response data:", data);
        
        const jobUrls : JobUrl[]   =  data.list.map( (job: any) => ( {
            url: `https://www.skcareers.com/Recruit/Detail/${job.noticeID}`,
            createdAt: new Date().toISOString()
        } ) );

        return jobUrls;
    }
}


const sktJobUrlExtractor = new SktJobUrlExtractor();
module.exports = sktJobUrlExtractor;

if (module === require.main) {
    (async () => {
        const urls = await sktJobUrlExtractor.extractJobUrls();
        console.log(urls);
    })();
}




